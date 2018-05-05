const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
/** @type {ServerConfig} */
const config = require('./config');
const thumb = require('./thumb-provider');
const morgan = require('morgan');
const tap = f => x => {
  f(x);
  return x;
};
app.use(morgan('dev'));
app.use('/static', express.static(config.videos.thumbpath));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'));
});

app.get('/video-list', function(req, res) {
  fs.readdir(config.videos.path, (err, files) => {
    console.log(files);
    const fileNames = files
      .filter(file => /\.(mp4|flv)$/.test(file))
      .map(tap(console.log))
      .filter(
        file => !fs.statSync(path.join(config.videos.path, file)).isDirectory()
      )
      .map(tap(console.log))
      .sort((a, b) => Math.random() - 0.5);
    //res.json({ files: fileNames });

    //TODO - Move this shit somewhere else so it can be used to init the media library
    Promise.all(
      fileNames.map(filename => {
        return thumb
          .hasThumb(filename, config.videos.thumbpath)
          .then(exists => {
            return thumb.create(
              filename,
              config.videos.path,
              config.videos.thumbpath
            );
          });
      })
    ).then(() => res.json({ files: fileNames }));
  });
});
const getHeader = (fileSize, start, end, chunkSize) =>
  !!(start || end || chunkSize)
    ? {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4'
      }
    : {
        'Content-Length': size,
        'Content-Type': 'video/mp4'
      };
app.get('/v/:v', function(req, res) {
  const vPath = path.join(config.videos.path, req.params.v);
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

app.listen(80, function() {
  console.log('Listening on port 80!');
});
