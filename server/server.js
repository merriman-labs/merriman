const express = require('express');
const fs = require('fs');
const os = require('os');
const R = require('ramda');
const path = require('path');
const app = express();
const config = require('./config');
const busboy = require('connect-busboy');
const morgan = require('morgan');
const cors = require('cors');
const { sortBy, reverse } = require('ramda');
const thumb = require('./thumb-provider');

const serverConfigRepo = require('./data/ServerConfigRepo');
const mediaRepo = require('./data/MediaRepo');
const libraryRepo = require('./data/LibraryRepo');

/**
 *
 * @param {string} dir
 * @returns {Array<string>}
 */
const getVideoFiles = dir => {
  const files = fs
    .readdirSync(dir)
    .filter(file => /\.mp4$/.test(file))
    .filter(file => !fs.statSync(path.join(dir, file)).isDirectory());

  const sorted = reverse(
    sortBy(filename => fs.statSync(path.join(dir, filename)).birthtimeMs, files)
  );
  return sorted;
};
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(busboy());

const thumbPath = serverConfigRepo.fetch().thumbLocation;
const mediaPath = serverConfigRepo.fetch().mediaLocation;
const buildPath = path.join(__dirname, '../build');

app.use(
  express.static(thumbPath, { redirect: false }),
  express.static(buildPath, { redirect: false })
);

app.post('/api/upload', function(req, res) {
  if (req.busboy) {
    req.busboy.on('file', function(
      fieldname,
      file,
      filename,
      encoding,
      mimetype
    ) {
      const serverConfig = serverConfigRepo.fetch();

      // Enter media into database
      const mediaItem = mediaRepo.add(filename);
      file.pipe(
        fs.createWriteStream(serverConfig.mediaLocation + mediaItem.filename)
      );

      req.busboy.on('finish', function() {
        if (filename.toLowerCase().indexOf('.mp4')) {
          // Make sure media has a thumbnail
          thumb.ensureThumbs(
            [mediaItem.filename],
            serverConfig.mediaLocation,
            serverConfig.thumbLocation
          );
        }
      });
    });

    req.busboy.on('finish', function() {
      res.writeHead(200, { Connection: 'close' });
      res.end("That's all folks!");
    });
    return req.pipe(req.busboy);
  }
  res.writeHead(404);
  res.end();
});

app.get('/api/libraries', async function(req, res) {
  const response = await libraryRepo.get();
  res.json(response);
});

app.post('/api/admin/libraries/modify-media', async function(req, res) {
  const { library, media, action } = req.body;
  if (library && media && action) {
    if (action === 'ADD') {
      libraryRepo
        .addMediaToLibrary(media, library)
        .then(() => res.sendStatus(200));
    }
    if (action === 'DROP') {
      libraryRepo
        .removeMediaToLibrary(media, library)
        .then(() => res.sendStatus(200));
    }
  } else {
    res.sendStatus(500);
  }
});

app.post('/api/admin/libraries/add', function(req, res) {
  const library = req.body;
  libraryRepo.insert(library);
  res.sendStatus(200);
});

app.delete('/api/admin/libraries/:id', function(req, res) {
  const id = req.params.id;
  if (id) libraryRepo.delete(id).then(_ => res.sendStatus(200));
});

app.get('/api/video/:library/:video', function(req, res) {
  const videoId = req.params.video;
  const video = mediaRepo.find(({ _id }) => _id === videoId);
  const vPath = path.join(mediaPath, video.filename);

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

app.get('/api/media-items', function(req, res) {
  const media = mediaRepo.get();
  res.json(media);
});

app.get('/api/media-items/:library', async function(req, res) {
  const id = req.params.library;
  const library = await libraryRepo.find(({ _id }) => _id === id);
  const media = mediaRepo.where(({ _id }) => R.contains(_id, library.items));

  if (!library) return res.status(500).json({ message: 'Library not found!' });
  res.json({ media });
});

app.get('/api/library/details/:id', async function(req, res) {
  const { id } = req.params;
  const library = await libraryRepo.find(({ _id }) => _id === id);

  if (!library) return res.status(500).json({ message: 'Library not found!' });
  res.json(library);
});

app.post('/api/admin/server-config', function(req, res) {
  const { mediaLocation, thumbnailLocation } = req.body;

  if (mediaLocation) serverConfigRepo.setMediaLocation(mediaLocation);
  if (thumbnailLocation)
    serverConfigRepo.setThumbnailLocation(thumbnailLocation);
  res.sendStatus(200);
});

app.get('/api/admin/server-config', function(req, res) {
  const config = serverConfigRepo.fetch();
  res.json(config);
});

app.get('/*', (req, res, next) =>
  res.sendFile(path.join(__dirname, '../build/index.html'))
);

app.listen(80, function() {
  console.log('Listening on port 80!');
});
