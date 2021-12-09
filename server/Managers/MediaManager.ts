import * as path from 'path';
import fs from 'fs';
import MediaRA from '../ResourceAccess/MediaRA';
import { MediaEngine } from '../Engines/MediaEngine';
import { MediaItem, MediaType, ServerLogSeverity } from '../models';
import { requestMeta, generateSubs } from '../ffmpeg';
import { fromSrt, toWebVTT } from '@johnny.reina/convert-srt';
import { MediaUtils } from '../Utilities/MediaUtils';
import { AppContext } from '../appContext';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { RegisterLocalPayload } from '../models/RegisterLocalPayload';
import ThumbProvider from '../thumb-provider';
import LibraryRA from '../ResourceAccess/LibraryRA';
import { NotFoundError } from '../Errors/NotFoundError';
import { UnauthorizedError } from '../Errors/UnauthorizedError';
import { TagStatistic } from '../ViewModels/TagStatistic';
import { MediaStateRA } from '../ResourceAccess/MediaStateRA';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { FileSystemRA } from '../ResourceAccess/FileSystemRA';
import ServerLogRA from '../ResourceAccess/ServerLogRA';

@injectable()
export class MediaManager {
  constructor(
    @inject(DependencyType.ResourceAccess.Media)
    private _mediaRA: MediaRA,
    @inject(DependencyType.Engines.Media)
    private _mediaEngine: MediaEngine,
    @inject(DependencyType.ResourceAccess.Library)
    private _libraryRA: LibraryRA,
    @inject(DependencyType.ResourceAccess.MediaState)
    private _mediaStateRA: MediaStateRA,
    @inject(DependencyType.ResourceAccess.ServerLog)
    private _serverLogRA: ServerLogRA,
    @inject(DependencyType.ResourceAccess.FileSystem)
    private _fileSystemRA: FileSystemRA
  ) {}

  async search(term: string, userId: string) {
    return this._mediaRA.search(term, userId);
  }

  random(count: number, userId: string) {
    return this._mediaRA.random(count, userId);
  }

  latest(skip: number, limit: number, userId: string) {
    return this._mediaRA.latest(skip, limit, userId);
  }

  recentlyPlayed(userId: string, limit: number) {
    return this._mediaRA.getRecentlyPlayed(userId, limit);
  }

  async registerLocal(payload: RegisterLocalPayload) {
    const serverConfig = AppContext.get(AppContext.WellKnown.Config);
    const newItem = this._mediaEngine.initializeLocalMedia(payload);
    // register item
    const mediaItem = await this._mediaRA.add(newItem);

    if (mediaItem.type === MediaType.Video) {
      // create thumbnail
      await ThumbProvider.ensureThumbs(
        [payload.filename],
        payload.path,
        serverConfig.thumbLocation
      ).catch(console.error);
    }

    // add to libraries
    await Promise.all(
      payload.libraries.map(async (library) => {
        const lib = await this._libraryRA.findById(library._id.toString());
        const item = { id: mediaItem._id.toString(), order: lib.items.length };

        this._libraryRA.addMediaToLibrary(item, library._id.toString());
      })
    );
    return mediaItem;
  }

  getByTag(tag: string, userId: string) {
    return this._mediaRA.getByTag(tag, userId);
  }

  getByLibraryId(libraryId: string, userId: string) {
    return this._mediaRA.getByLibraryId(libraryId, userId);
  }

  upload(
    user: {
      userId: string;
      username: string;
    },
    busboy: busboy.Busboy
  ) {
    const serverConfig = AppContext.get(AppContext.WellKnown.Config);
    return new Promise<MediaItem>((res, rej) => {
      const item = {
        name: null,
        tags: null,
        libraryIds: null
      };
      busboy.on('field', (name, val) => {
        if (name === 'info') {
          const info = JSON.parse(val);
          Object.assign(item, info);
        }
      });
      busboy.on('file', async (field, file, filename) => {
        const newMediaItem = this._mediaEngine.initializeUploadedMedia(
          filename,
          user.userId,
          user.username,
          serverConfig.storage.scheme,
          serverConfig.mediaLocation
        );

        await this._saveMediaLocal(
          file,
          serverConfig.mediaLocation,
          newMediaItem.filename
        );
        if (newMediaItem.filename.toLowerCase().includes('.mp4')) {
          // Make sure media has a thumbnail
          await ThumbProvider.ensureThumbs(
            [newMediaItem.filename],
            serverConfig.mediaLocation,
            serverConfig.thumbLocation
          );

          if (serverConfig.storage.scheme === 's3') {
            await this._saveMediaS3(
              this._fileSystemRA.getStream(
                newMediaItem.path,
                newMediaItem.filename
              ),
              newMediaItem.filename,
              newMediaItem._id.toString(),
              user.userId
            );
            // We don't need to keep the file on disk if we're using s3
            await this._fileSystemRA.rm(
              newMediaItem.path,
              newMediaItem.filename
            );
          }
        }
        newMediaItem.name = item.name || newMediaItem.name;
        newMediaItem.tags = item.tags || newMediaItem.tags;

        const result = await this._mediaRA.add(newMediaItem);
        // Add item to any selected libraries
        if (item.libraryIds) {
          for (let libraryId of item.libraryIds) {
            await this._libraryRA.addMediaToLibrary(
              { id: result._id.toString(), order: 0 },
              libraryId
            );
          }
        }
        return res(result);
      });
    });
  }

  private _saveMediaLocal(
    file: NodeJS.ReadableStream,
    location: string,
    key: string
  ) {
    // ignore this little guy please
    return new Promise<void>((res, rej) => {
      file
        .pipe(fs.createWriteStream(path.join(location, key)))
        .on('finish', async () => {
          res();
        })
        .on('error', (error) => {
          console.log(error);
          return rej('An error occurred while storing the upload');
        });
    });
  }

  private async _saveMediaS3(
    file: NodeJS.ReadableStream,
    key: string,
    mediaId: string,
    userId: string
  ) {
    const serverConfig = AppContext.get(AppContext.WellKnown.Config);
    if (serverConfig.storage.scheme !== 's3')
      throw new Error('Cannot save media to S3');
    const client = new S3Client({
      region: serverConfig.storage.region,
      credentials: {
        accessKeyId: serverConfig.storage.accessKeyId,
        secretAccessKey: serverConfig.storage.accessKeySecret
      }
    });
    const logId = await this._serverLogRA.createMigrationLog({
      entries: [],
      mediaId,
      userId,
      startTime: new Date()
    });
    const upload = new Upload({
      client,
      params: {
        Bucket: serverConfig.storage.bucket,
        Key: key,
        Body: file
      }
    });
    upload.on('httpUploadProgress', (progress) => {
      this._serverLogRA.addMigrationLogEntry(logId.toHexString(), {
        createdAt: new Date(),
        level: ServerLogSeverity.info,
        message: `Uploaded ${progress.loaded} of ${progress.total} to ${progress.Bucket}/${progress.Key}`
      });
    });

    return upload
      .done()
      .then((value) => {
        this._serverLogRA.finishMigrationLogEntry(logId.toHexString());
        return value;
      })
      .catch((err) => {
        this._serverLogRA.addMigrationLogEntry(logId.toHexString(), {
          createdAt: new Date(),
          level: ServerLogSeverity.info,
          message: `There was an error: ${err}`
        });
      });
  }

  getMediaUrl(id: string) {
    return this._mediaRA.getMediaUrl(id);
  }

  getByStorageScheme(storageScheme: 's3' | 'filesystem') {
    return this._mediaRA.getByStorageScheme(storageScheme);
  }

  findById(id: string, userId: string) {
    return this._mediaRA.findById(id, userId);
  }

  async deleteById(id: string, userId: string, hardDelete: boolean = false) {
    const config = AppContext.get(AppContext.WellKnown.Config);
    const media = await this._mediaRA.findById(id, userId);
    if (!media) return false;
    if (hardDelete) {
      const path = media.path ? media.path : config.mediaLocation;
      MediaUtils.deleteMedia(path, media.filename);
    }
    await this._libraryRA.removeMediaFromLibraries(id);
    await this._mediaStateRA.deleteAllForMedia(id);
    return this._mediaRA.deleteById(id);
  }

  async update(item: MediaItem, userId: string) {
    const existing = await this._mediaRA.findById(item._id.toString(), userId);
    if (!existing) throw new NotFoundError('NOT_FOUND');
    if (existing.user.userId.toString() !== userId)
      throw new UnauthorizedError('NOT_AUTHORIZED');
    return this._mediaRA.update(item);
  }

  incrementViewCount(id: string) {
    return this._mediaRA.incrementPlayCount(id);
  }

  getTags(userId: string): Promise<Array<TagStatistic>> {
    return this._mediaRA.getTags(userId);
  }

  async requestMeta(id: string, userId: string) {
    const media = await this._mediaRA.findById(id, userId);
    const { stdout, stderr } = await requestMeta(
      path.join(media.path, media.filename)
    );
    const meta = stdout === '' ? stderr : stdout;
    media.meta = meta;
    await this._mediaRA.update(media);
    return meta;
  }

  async generateSubs(id: string, track: string, userId: string) {
    const media = await this._mediaRA.findById(id, userId);
    const subs = await generateSubs(
      path.join(media.path, media.filename),
      track
    );
    media.srt = subs;

    await this._mediaRA.update(media);
    return subs;
  }

  async generateWebVtt(id: string, userId: string) {
    const media = await this._mediaRA.findById(id, userId);
    if (!media.srt) throw new Error('No SRT subs found');
    const jsubs = fromSrt(media.srt);
    const webvtt = toWebVTT(jsubs);
    media.webvtt = webvtt;

    await this._mediaRA.update(media);
    return webvtt;
  }

  async migrateToS3(mediaId: string, userId: string) {
    const config = AppContext.get(AppContext.WellKnown.Config);
    if (config.storage.scheme !== 's3')
      throw new Error('Unable to migrate to S3 without configuration present.');
    const media = await this._mediaRA.findById(mediaId, userId);
    const stream = this._fileSystemRA.getStream(media.path, media.filename);
    await this._saveMediaS3(
      stream,
      media.filename,
      media._id.toString(),
      userId
    );
    await this._mediaRA.update({
      ...media,
      storageScheme: 's3',
      updatedAt: new Date(),
      path: ''
    });
  }
}
