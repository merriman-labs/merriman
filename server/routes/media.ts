import { Router } from 'express';
import ServerConfigRepo from '../data/ServerConfigRepo';
import ThumbProvider from '../thumb-provider';
import * as fs from 'fs';
import * as path from 'path';
import * as R from 'ramda';
import * as Busboy from 'busboy';
import * as chance from 'chance';
import moment = require('moment');
import { MediaManager } from '../Managers/MediaManager';
import { LibraryManager } from '../Managers/LibraryManager';

const Chance = chance.Chance();
const mediaItemRouter = Router();
const mediaManager = new MediaManager();
const libraryManager = new LibraryManager();
const serverConfigRepo = new ServerConfigRepo();

// Play a video in chunks
mediaItemRouter.get('/play/:video', async function(req, res) {
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
});

mediaItemRouter.get('/captions/:id', async function(req, res) {
  const item = await mediaManager.findById(req.params.id);
  if (!item.webvtt) res.status(404).send('not found');
  res.status(200).send(item.webvtt);
});

// Return the media item
mediaItemRouter.get('/detail/:_id', async function(req, res) {
  const id: string = req.params._id;
  const media = await mediaManager.findById(id);
  return res.json(media);
});

// Upload a media item
mediaItemRouter.post('/upload', function(req, res) {
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
});

mediaItemRouter.get('/', async function(req, res) {
  const media = await mediaManager.get();
  res.json(media);
});

mediaItemRouter.get('/random', async function(req, res) {
  const media = await mediaManager.get();
  res.json(Chance.pickone(media));
});

mediaItemRouter.get('/:library', async function(req, res) {
  const id = req.params.library;
  const library = await libraryManager.findById(id);

  if (!library) return res.status(500).json({ message: 'Library not found!' });

  const media = await mediaManager.where(({ _id }) =>
    R.contains(_id, library.items)
  );
  res.json({ media });
});

mediaItemRouter.get('/latest/:count', async function(req, res) {
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
});

mediaItemRouter.post('/request-meta/:id', async function(req, res) {
  const meta = await mediaManager.requestMeta(req.params.id);
  return res.json({ meta });
});

mediaItemRouter.post('/request-srt/:id/:track', async function(req, res) {
  const srt = await mediaManager.generateSubs(req.params.id, req.params.track);
  return res.json({ srt });
});

mediaItemRouter.post('/request-webvtt/:id', async function(req, res) {
  const webvtt = await mediaManager.generateWebVtt(req.params.id);
  return res.json({ webvtt });
});

mediaItemRouter.put('/', async function(req, res) {
  await mediaManager.update(req.body);
  return res.json({ status: 'OK' });
});

export default mediaItemRouter;
