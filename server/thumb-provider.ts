import * as path from 'path';
import ffmpeg from './ffmpeg';
import * as fs from 'fs';

const hasThumb = (filename: string, thumbdir: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    fs.exists(path.join(thumbdir, filename + '.png'), resolve);
  });

/**
 *
 */
const create = (
  filename: string,
  sourcedir: string,
  thumbdir: string,
  timestamp: string
): Promise<string> => {
  return ffmpeg(
    path.join(sourcedir, filename),
    path.join(thumbdir, filename + '.png'),
    timestamp,
    '200x125'
  ).then(() => filename);
};

const _ensureStorage = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
};

/**
 *
 */
const ensureThumbs = (
  fileNames: Array<string>,
  sourceDir: string,
  destDir: string,
  force: boolean = false,
  timestamp: string = '00:00:10'
) => {
  _ensureStorage(destDir);
  return Promise.all(
    fileNames.map((filename) => {
      return hasThumb(filename, destDir).then((exists) => {
        return !exists || force
          ? create(filename, sourceDir, destDir, timestamp)
          : 'Thumb already exists!';
      });
    })
  );
};

export default { create, hasThumb, ensureThumbs };
