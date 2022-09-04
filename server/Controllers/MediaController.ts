import { RequestHandler } from 'express';
import * as path from 'path';
import Busboy from 'busboy';
import { MediaManager } from '../Managers/MediaManager';
import { IController } from './IController';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import Validator from '../Validation/Validator';
import { ensureSuperadmin } from '../Middleware/EnsureSuperadmin';
import { NotFoundError } from '../Errors/NotFoundError';
import { AsyncRouter } from '../Utilities/AsyncRouter';
import { HttpStatus } from '../Constant/HttpStatus';
import { ensureLoggedIn } from '../Middleware/EnsureLoggedIn';

@injectable()
export class MediaController implements IController {
  public router = AsyncRouter();
  public path = '/media';
  constructor(
    @inject(DependencyType.Managers.Media) private _mediaManager: MediaManager
  ) {
    this.router.get('/search/:term', this.searchByTerm);
    this.router.get('/detail/:_id', this.getById);
    this.router.get('/random', this.getRandom);
    this.router.get('/list/byTag/:tag', this.getByTag);
    this.router.get('/tags', this.listTags);
    this.router.get('/list/byLibrary/:library', this.getMediaForLibrary);
    this.router.get('/latest', this.latest);
    this.router.get('/recentlyPlayed', this.recentlyPlayed);
    this.router.get('/download/:id', this.download);
    this.router.post('/upload', this.upload);
    this.router.post('/request-meta/:id', this.requestMeta);
    this.router.post('/request-srt/:id/:track', this.requestSrt);
    this.router.post('/request-webvtt/:id', this.requestWebVTT);
    this.router.post('/registerLocal', ensureSuperadmin, this.registerLocal);
    this.router.post(
      '/regenerate-thumbnail',
      ensureLoggedIn,
      this.regenerateThumbnail
    );
    this.router.put('/', this.update);
    this.router.delete('/:id', this.delete);
  }

  download: RequestHandler = async (req, res) => {
    const mediaId = Validator.Utility.ObjectId(req.params.id);
    const file = await this._mediaManager.findById(mediaId, req.user._id);
    if (!file) throw new NotFoundError('No media at ' + mediaId);
    const { filename, path: dir } = file;
    const fullpath = path.join(dir, filename);
    res.download(fullpath);
  };

  searchByTerm: RequestHandler = async (req, res) => {
    const term = req.params.term;
    if (!term || term === '') return res.json([]);
    const results = await this._mediaManager.search(term, req.user._id);

    res.json(results);
  };

  registerLocal: RequestHandler = async (req, res) => {
    // @ts-ignore
    const userId = Validator.Utility.ObjectId(req.user._id);
    const body = { ...req.body, userId, username: req.user.username };
    const payload = Validator.Media.RegisterLocal(body);
    const item = await this._mediaManager.registerLocal(payload);
    return res.json(item);
  };

  regenerateThumbnail: RequestHandler = async (req, res) => {
    const userId = Validator.Utility.ObjectId(req.user._id);

    await this._mediaManager.regenerateThumb(
      req.body.mediaId,
      userId,
      req.body.timestamp
    );
    return res.json({ status: 'ok' });
  };

  recentlyPlayed: RequestHandler = async (req, res) => {
    // @ts-ignore
    const userId = Validator.Utility.ObjectId(req.user._id);
    const limit =
      typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 0;
    const recent = await this._mediaManager.recentlyPlayed(userId, limit);
    res.json(recent);
  };

  update: RequestHandler = async (req, res) => {
    await this._mediaManager.update(req.body, req.user._id);
    return res.json({ status: 'OK' });
  };

  delete: RequestHandler = async (req, res) => {
    const hardDelete = req.query.hard === 'true';
    const result = await this._mediaManager.deleteById(
      req.params.id,
      req.user._id,
      hardDelete
    );
    res.json({ result });
  };

  getById: RequestHandler = async (req, res) => {
    const id: string = req.params._id;
    const media = await this._mediaManager.findById(id, req.user._id);
    return res.json(media);
  };

  upload: RequestHandler = async (req, res) => {
    // @ts-ignore
    const userId = Validator.Utility.ObjectId(req.user._id);
    const busboy = Busboy({ headers: req.headers });

    req.pipe(busboy);

    const result = await this._mediaManager.upload(
      {
        userId,
        username: req.user.username
      },
      busboy
    );
    return res.status(HttpStatus.Created).send(result);
  };

  getRandom: RequestHandler = async (req, res) => {
    const { count = 1 } = req.query;
    const media = await this._mediaManager.random(+count, req.user._id);
    res.json(media);
  };

  getByTag: RequestHandler = async (req, res) => {
    const tag = req.params.tag;
    const items = await this._mediaManager.getByTag(tag, req.user._id);
    res.json({ items });
  };

  listTags: RequestHandler = async (req, res) => {
    const tags = await this._mediaManager.getTags(req.user._id);
    res.json({ tags });
  };

  getMediaForLibrary: RequestHandler = async (req, res) => {
    const libraryId = req.params.library;
    const media = await this._mediaManager.getByLibraryId(
      libraryId,
      req.user._id
    );
    res.json(media);
  };

  latest: RequestHandler = async (req, res) => {
    let { skip = '0', limit = '20' } = req.query;

    const allItems = await this._mediaManager.latest(
      +skip,
      +limit,
      req.user._id
    );
    res.json(allItems);
  };

  requestMeta: RequestHandler = async (req, res) => {
    const meta = await this._mediaManager.requestMeta(
      req.params.id,
      req.user._id
    );
    return res.json({ meta });
  };

  requestSrt: RequestHandler = async (req, res) => {
    const srt = await this._mediaManager.generateSubs(
      req.params.id,
      req.params.track,
      req.user._id
    );
    return res.json({ srt });
  };

  requestWebVTT: RequestHandler = async (req, res) => {
    const webvtt = await this._mediaManager.generateWebVtt(
      req.params.id,
      req.user._id
    );
    return res.json({ webvtt });
  };
}
