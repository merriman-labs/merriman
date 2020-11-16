import { RequestHandler, Router } from 'express';
import ThumbProvider from '../thumb-provider';
import * as fs from 'fs';
import * as path from 'path';
import * as R from 'ramda';
import Busboy from 'busboy';
import * as chance from 'chance';
import moment = require('moment');
import { MediaManager } from '../Managers/MediaManager';
import { AppContext } from '../appContext';
import { IController } from './IController';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import Validator from '../Validation/Validator';
import { ensureSuperadmin } from '../Middleware/EnsureSuperadmin';

const Chance = chance.Chance();

@injectable()
export class MediaController implements IController {
  public router = Router();
  public path = '/media';
  constructor(
    @inject(DependencyType.Managers.Media) private _mediaManager: MediaManager
  ) {
    this.router.get('/search/:term', this.searchByTerm);
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
    this.router.post('/registerLocal', ensureSuperadmin, this.registerLocal);
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

  registerLocal: RequestHandler = async (req, res) => {
    const userId = Validator.Utility.ObjectId(req.user._id);
    const body = { ...req.body, userId };
    const payload = Validator.Media.RegisterLocal(body);
    const item = await this._mediaManager.registerLocal(payload);
    return res.json(item);
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

  getById: RequestHandler = async (req, res) => {
    const id: string = req.params._id;
    const media = await this._mediaManager.findById(id);
    return res.json(media);
  };

  upload: RequestHandler = (req, res) => {
    const userId = Validator.Utility.ObjectId(req.user._id);
    const serverConfig = AppContext.get(AppContext.WellKnown.Config);
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', async (fieldname, file, filename) => {
      // Enter media into database
      const mediaItem = await this._mediaManager.add(filename, userId);
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
