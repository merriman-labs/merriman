const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const app = express();
const config = require('./config');
const thumb = require('./thumb-provider');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const ConfigRepo = require('./data/config-repo');
const tap = f => x => {
  f(x);
  return x;
};
const getVideoFiles = dir =>
  fs
    .readdirSync(dir)
    .filter(file => /\.(mp4|flv)$/.test(file))
    .filter(file => !fs.statSync(path.join(dir, file)).isDirectory());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(
  '/static',
  express.static(os.homedir() + '\\.node-media-server\\thumbs\\')
);
app.use(cors());

app.get('/libraries', function(req, res) {
  const repo = new ConfigRepo();
  res.json({
    libraries: repo
      .get()
      .libraries.filter(lib => !lib.hidden)
      .map(lib => lib.name)
  });
});

app.get('/video/:library/:video', function(req, res) {
  const repo = new ConfigRepo();
  const library = repo.loadLibrary(req.params.library);
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

app.get('/video-list/:library', function(req, res) {
  const library = req.params.library;
  const repo = new ConfigRepo();
  const { location } = repo.get().libraries.find(lib => lib.name === library);

  const files = getVideoFiles(location);
  res.json({ files });
});

app.get('/admin/config', function(req, res) {
  const repo = new ConfigRepo();
  res.json(repo.get());
});

app.post('/admin/config', function(req, res) {
  const repo = new ConfigRepo();
  repo.save(req.body);
  res.json(req.body);
});

app.post('/admin/init', function(req, res) {
  const repo = new ConfigRepo();
  const conf = repo.get();
  const libPaths = conf.libraries
    .map(lib => lib.location)
    .map(location => ({ location, files: getVideoFiles(location) }));
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

app.listen(80, function() {
  console.log('Listening on port 80!');
});
