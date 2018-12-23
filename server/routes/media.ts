import { Router, Response, Request } from 'express';
import LibraryRepo from '../data/LibraryRepo';
import ServerConfigRepo from '../data/ServerConfigRepo';
import ThumbProvider from '../thumb-provider';
import * as fs from 'fs';
import * as path from 'path';
import * as R from 'ramda';
import MediaRepo from '../data/MediaRepo';
import * as Busboy from 'busboy';

const mediaItemRouter = Router();
const mediaRepo = new MediaRepo();
const libraryRepo = new LibraryRepo();
const serverConfigRepo = new ServerConfigRepo();
const { mediaLocation } = serverConfigRepo.fetch();

mediaItemRouter.get('/play/:library/:video', function(req, res) {
  const videoId = req.params.video;
  const video = mediaRepo.find(({ _id }) => _id === videoId);
  const vPath = path.join(mediaLocation, video.filename);

  const stat = fs.statSync(vPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
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

mediaItemRouter.get('/detail/:video', function(req, res) {
  const video: string = req.params.video;
  const media = mediaRepo.find(({ _id }) => _id === video);
  return res.json(media);
});

mediaItemRouter.post('/upload', function(req, res) {
  const busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename) {
    const serverConfig = serverConfigRepo.fetch();

    // Enter media into database
    const mediaItem = mediaRepo.add(filename);
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

mediaItemRouter.get('/:library', async function(req, res) {
  const id = req.params.library;
  const library = await libraryRepo.find(({ _id }) => _id === id);
  const media = mediaRepo.where(({ _id }) => R.contains(_id, library.items));

  if (!library) return res.status(500).json({ message: 'Library not found!' });
  res.json({ media });
});

mediaItemRouter.get('/', function(req, res) {
  const media = mediaRepo.get();
  res.json(media);
});

export default mediaItemRouter;
