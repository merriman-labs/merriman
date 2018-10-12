const path = require('path');
const ffmpeg = require('./ffmpeg');
const fs = require('fs');

/**
 *
 * @param {string} filePath
 * @param {string} thumbdir
 * @returns {Promise<boolean>}
 */
const hasThumb = (filename, thumbdir) =>
  new Promise((resolve, reject) => {
    fs.exists(path.join(thumbdir, filename + '.png'), resolve);
  });

/**
 *
 * @param {string} filename
 * @param {string} sourcedir
 * @param {string} thumbdir
 * @returns {Promise<string>}
 */
const create = (filename, sourcedir, thumbdir) => {
  return ffmpeg(
    path.join(sourcedir, filename),
    path.join(thumbdir, filename + '.png'),
    '00:00:01',
    '200x125'
  ).then(() => filename);
};

const _ensureStorage = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
};

/**
 *
 * @param {Array<string>} fileNames
 * @param {string} sourceDir
 * @param {string} destDir
 */
const ensureThumbs = (fileNames, sourceDir, destDir) => {
  _ensureStorage(destDir);
  return Promise.all(
    fileNames.map(filename => {
      return hasThumb(filename, destDir).then(exists => {
        return exists
          ? 'Thumb already exists!'
          : create(filename, sourceDir, destDir);
      });
    })
  );
};

module.exports = { create, hasThumb, ensureThumbs };
