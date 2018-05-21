const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const app = express();
const config = require('./config');
const thumb = require('./thumb-provider');
const morgan = require('morgan');
const cors = require('cors');
const ConfigRepo = require('./data/ConfigRepo');
const LibraryManager = require('./managers/LibraryManager');

/**
 *
 * @param {string} dir
 * @returns {Promise<Array<string>>}
 */
const getVideoFiles = dir =>
  new Promise(function(res, rej) {
    fs.readdir(dir, function(err, files) {
      if (err) return rej(err);

      const videoFiles = files
        .filter(file => /\.mp4$/.test(file))
        .filter(file => !fs.statSync(path.join(dir, file)).isDirectory());

      return res(videoFiles);
    });
  });

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const thumbPath = path.join(os.homedir(), '.node-media-server', 'thumbs');
const buildPath = path.join(__dirname, '../build');

app.use(
  express.static(thumbPath, { redirect: false }),
  express.static(buildPath, { redirect: false })
);

app.get('/api/libraries', function(req, res) {
  const response = {
    libraries: LibraryManager.list()
  };
  res.json(response);
});

app.get('/api/video/:library/:video', function(req, res) {
  const library = LibraryManager.load(req.params.library);
  const vPath = path.join(library.location, req.params.video);
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

app.get('/api/video-list/:library', async function(req, res) {
  const id = req.params.library;
  const library = LibraryManager.load(id);

  if (!library) return res.status(500).json({ message: 'Library not found!' });
  const files = await getVideoFiles(library.location);
  res.json({ files });
});

app.get('/api/library/details/:id', function(req, res) {
  const { id } = req.params;
  const library = LibraryManager.load(id);

  if (!library) return res.status(500).json({ message: 'Library not found!' });
  res.json(library);
});

app.get('/api/admin/config', function(req, res) {
  const repo = new ConfigRepo();
  res.json(repo.get());
});

app.post('/api/admin/config', function(req, res) {
  const repo = new ConfigRepo();
  repo.save(req.body);
  res.json(req.body);
});

app.post('/api/admin/add-library', function(req, res) {
  LibraryManager.save(req.body);
  res.json(req.body);
});

app.post('/api/admin/init', async function(req, res) {
  const repo = new ConfigRepo();
  const conf = repo.get();

  const files = await getVideoFiles(location);

  const libPaths = conf.libraries
    .map(lib => lib.location)
    .map(location => ({ location, files }));
  if (!fs.existsSync(os.homedir() + '\\.node-media-server'))
    fs.mkdirSync(os.homedir() + '\\.node-media-server');
  const thumbProcedurePromises = libPaths.map(({ location, files }) =>
    thumb.ensureThumbs(
      files,
      location,
      os.homedir() + '\\.node-media-server\\thumbs\\'
    )
  );

  Promise.all(thumbProcedurePromises)
    .then(() => res.json('Libraries initialized!'))
    .catch(err => res.json(err));
});

app.get('/*', (req, res, next) =>
  res.sendFile(path.join(__dirname, '../build/index.html'))
);

app.listen(80, function() {
  console.log('Listening on port 80!');
});
