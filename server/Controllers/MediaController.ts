import { RequestHandler, Router } from 'express';
import ThumbProvider from '../thumb-provider';
import * as fs from 'fs';
import * as path from 'path';
import * as R from 'ramda';
import Busboy from 'busboy';
import * as chance from 'chance';
import moment = require('moment');
import { MediaManager } from '../Managers/MediaManager';
import { LibraryManager } from '../Managers/LibraryManager';
import { AppContext } from '../appContext';
import { IController } from './IController';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';

const Chance = chance.Chance();

@injectable()
export class MediaController implements IController {
  public router = Router();
  public path = '/media';
  constructor(
    @inject(DependencyType.Managers.Library)
    private _libraryManager: LibraryManager,
    @inject(DependencyType.Managers.Media) private _mediaManager: MediaManager
  ) {
    this.router.get('/search/:term', this.searchByTerm);
    this.router.get('/play/:video', this.streamMedia);
    this.router.get('/captions/:id', this.getCaptions);
    this.router.get('/detail/:_id', this.getById);
    this.router.get('/', this.list);
    this.router.get('/random', this.getRandom);
    this.router.get('/list/byTag/:tag', this.getByTag);
    this.router.get('/tags', this.listTags);
    this.router.get('/list/byLibrary/:library', this.getMediaForLibrary);
    this.router.get('/latest/:count', this.latest);
    this.router.post('/upload', this.upload);
    this.router.post('/request-meta/:id', this.requestMeta);
    this.router.post('/request-srt/:id/:track', this.requestSrt);
    this.router.post('/request-webvtt/:id', this.requestWebVTT);
    this.router.put('/', this.update);
    this.router.delete('/:id', this.delete);
  }

  searchByTerm: RequestHandler = async (req, res) => {
    const term = req.params.term;
    if (!term || term === '') return res.json([]);
    const results = await this._mediaManager.where((item) =>
      JSON.stringify(item).toLowerCase().includes(term.toLowerCase())
    );

    res.json(results);
  };

  update: RequestHandler = async (req, res) => {
    await this._mediaManager.update(req.body);
    return res.json({ status: 'OK' });
  };

  delete: RequestHandler = async (req, res) => {
    const hardDelete = req.query.hard === 'true';
    const result = await this._mediaManager.deleteById(
      req.params.id,
      hardDelete
    );
    res.json({ result });
  };

  streamMedia: RequestHandler = async (req, res) => {
    const { mediaLocation } = AppContext.get(AppContext.WellKnown.Config);
    const videoId = req.params.video;
    const video = await this._mediaManager.findById(videoId);
    const vDir = video.path ? video.path : mediaLocation;
    const vPath = path.join(vDir, video.filename);

    const stat = fs.statSync(vPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      if (start === 0) await this._mediaManager.incrementViewCount(videoId);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(vPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      };
      res.writeHead(200, head);
      fs.createReadStream(vPath).pipe(res);
    }
  };

  getCaptions: RequestHandler = async (req, res) => {
    const item = await this._mediaManager.findById(req.params.id);
    if (!item.webvtt) res.status(404).send('not found');
    res.status(200).send(item.webvtt);
  };

  getById: RequestHandler = async (req, res) => {
    const id: string = req.params._id;
    const media = await this._mediaManager.findById(id);
    return res.json(media);
  };

  upload: RequestHandler = (req, res) => {
    const serverConfig = AppContext.get(AppContext.WellKnown.Config);
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', async (fieldname, file, filename) => {
      // Enter media into database
      const mediaItem = await this._mediaManager.add(filename);
      file.pipe(
        fs.createWriteStream(serverConfig.mediaLocation + mediaItem.filename)
      );

      busboy.on('finish', function () {
        if (filename.toLowerCase().indexOf('.mp4')) {
          // Make sure media has a thumbnail
          ThumbProvider.ensureThumbs(
            [mediaItem.filename],
            serverConfig.mediaLocation,
            serverConfig.thumbLocation
          );
        }
      });
    });

    busboy.on('finish', function () {
      console.log('Upload complete');
      res.writeHead(200, { Connection: 'close' });
      res.end("That's all folks!");
    });

    return req.pipe(busboy);
  };

  list: RequestHandler = async (req, res) => {
    const media = await this._mediaManager.get();
    res.json(media);
  };
  getRandom: RequestHandler = async (req, res) => {
    const media = await this._mediaManager.get();
    res.json(Chance.pickone(media));
  };

  getByTag: RequestHandler = async (req, res) => {
    const tag = req.params.tag;
    const items = await this._mediaManager.getByTag(tag);
    res.json({ items });
  };

  listTags: RequestHandler = async (req, res) => {
    const tags = await this._mediaManager.getTags();
    res.json({ tags });
  };

  getMediaForLibrary: RequestHandler = async (req, res) => {
    const libraryId = req.params.library;
    const media = await this._mediaManager.getByLibraryId(libraryId);
    res.json(media);
  };

  latest: RequestHandler = async (req, res) => {
    const count = +req.params.count;
    const allItems = await this._mediaManager.get();
    const newest = allItems
      .filter((x) => x.created !== undefined)
      .sort((a, b) =>
        moment(a.created).isBefore(b.created)
          ? -1
          : moment(b.created).isBefore(a.created)
          ? 1
          : 0
      );
    res.json(R.take(count, R.reverse(newest)));
  };

  requestMeta: RequestHandler = async (req, res) => {
    const meta = await this._mediaManager.requestMeta(req.params.id);
    return res.json({ meta });
  };

  requestSrt: RequestHandler = async (req, res) => {
    const srt = await this._mediaManager.generateSubs(
      req.params.id,
      req.params.track
    );
    return res.json({ srt });
  };

  requestWebVTT: RequestHandler = async (req, res) => {
    const webvtt = await this._mediaManager.generateWebVtt(req.params.id);
    return res.json({ webvtt });
  };
}
