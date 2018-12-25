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
  thumbdir: string
): Promise<string> => {
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
 */
const ensureThumbs = (
  fileNames: Array<string>,
  sourceDir: string,
  destDir: string
) => {
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

export default { create, hasThumb, ensureThumbs };
