import { Router } from 'express';
import ThumbProvider from '../thumb-provider';
import * as fs from 'fs';
import * as path from 'path';
import * as R from 'ramda';
import * as Busboy from 'busboy';
import * as chance from 'chance';
import moment = require('moment');
import { MediaManager } from '../Managers/MediaManager';
import { LibraryManager } from '../Managers/LibraryManager';
import { AppContext } from '../appContext';
import { IController } from './IController';

const Chance = chance.Chance();
const mediaManager = new MediaManager();
const libraryManager = new LibraryManager();

export class MediaController implements IController {
  public router = Router();
  public path = '/media';
  constructor() {
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

  searchByTerm = async (req, res) => {
    const term = req.params.term;
    const results = await mediaManager.where(item =>
      JSON.stringify(item)
        .toLowerCase()
        .includes(term.toLowerCase())
    );

    res.json({ results });
  };

  async update(req, res) {
    await mediaManager.update(req.body);
    return res.json({ status: 'OK' });
  }

  async delete(req, res) {
    const hardDelete = req.query.hard === 'true';
    const result = await mediaManager.deleteById(req.params.id, hardDelete);
    res.json({ result });
  }

  streamMedia = async (req, res) => {
    const serverConfigRepo = AppContext.get(AppContext.WellKnown.Config);
    const { mediaLocation } = await serverConfigRepo.fetch();
    const videoId = req.params.video;
    const video = await mediaManager.findById(videoId);
    const vDir = video.path ? video.path : mediaLocation;
    const vPath = path.join(vDir, video.filename);

    const stat = fs.statSync(vPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      if (start === 0) await mediaManager.incrementViewCount(videoId);
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

  getCaptions = async (req, res) => {
    const item = await mediaManager.findById(req.params.id);
    if (!item.webvtt) res.status(404).send('not found');
    res.status(200).send(item.webvtt);
  };

  getById = async (req, res) => {
    const id: string = req.params._id;
    const media = await mediaManager.findById(id);
    return res.json(media);
  };

  upload = (req, res) => {
    const serverConfigRepo = AppContext.get(AppContext.WellKnown.Config);
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', async function(fieldname, file, filename) {
      const serverConfig = await serverConfigRepo.fetch();

      // Enter media into database
      const mediaItem = await mediaManager.add(filename);
      file.pipe(
        fs.createWriteStream(serverConfig.mediaLocation + mediaItem.filename)
      );

      busboy.on('finish', function() {
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

    busboy.on('finish', function() {
      console.log('Upload complete');
      res.writeHead(200, { Connection: 'close' });
      res.end("That's all folks!");
    });

    return req.pipe(busboy);
  };

  list = async (req, res) => {
    const media = await mediaManager.get();
    res.json(media);
  };
  getRandom = async (req, res) => {
    const media = await mediaManager.get();
    res.json(Chance.pickone(media));
  };

  getByTag = async (req, res) => {
    const tag = req.params.tag;
    const items = await mediaManager.getByTag(tag);
    res.json({ items });
  };

  listTags = async (req, res) => {
    const tags = await mediaManager.getTags();
    res.json({ tags });
  };

  getMediaForLibrary = async (req, res) => {
    const id = req.params.library;
    const library = await libraryManager.findById(id);

    if (!library)
      return res.status(500).json({ message: 'Library not found!' });

    const media = await mediaManager.where(({ _id }) =>
      R.contains(_id.toString(), library.items)
    );
    res.json(media);
  };

  latest = async (req, res) => {
    const count = +req.params.count;
    const allItems = await mediaManager.get();
    const newest = allItems
      .filter(x => x.created !== undefined)
      .sort((a, b) =>
        moment(a.created).isBefore(b.created)
          ? -1
          : moment(b.created).isBefore(a.created)
          ? 1
          : 0
      );
    res.json(R.take(count, R.reverse(newest)));
  };

  requestMeta = async (req, res) => {
    const meta = await mediaManager.requestMeta(req.params.id);
    return res.json({ meta });
  };

  requestSrt = async (req, res) => {
    const srt = await mediaManager.generateSubs(
      req.params.id,
      req.params.track
    );
    return res.json({ srt });
  };

  requestWebVTT = async (req, res) => {
    const webvtt = await mediaManager.generateWebVtt(req.params.id);
    return res.json({ webvtt });
  };
}
