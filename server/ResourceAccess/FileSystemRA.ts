import { createReadStream, readdirSync, statSync } from 'fs';
import { unlink } from 'fs/promises';
import { join } from 'path';
import * as R from 'ramda';

import { injectable } from 'inversify';
import { ListDirectoryResult } from '../models/ListDirectoryResult';

@injectable()
export class FileSystemRA {
  ls(dirPath: string): ListDirectoryResult {
    const files = readdirSync(dirPath)
      .concat('..')
      .map((file) => {
        let isDirectory: boolean,
          isAccessible = true;
        try {
          isDirectory = statSync(join(dirPath, file)).isDirectory();
        } catch (err) {
          isAccessible = false;
        }
        return {
          name: file,
          isDirectory,
          fullPath: join(dirPath, file),
          isAccessible,
          directoryPath: dirPath
        };
      })
      .filter((x) => x.isAccessible);

    const [dirs, file] = R.partition((file) => file.isDirectory, files);

    const result = {
      path: dirPath,
      files: R.sortBy(R.prop('name'), dirs).concat(
        R.sortBy(R.prop('name'), file)
      )
    };
    return result;
  }
  rm(filePath: string, filename: string): Promise<void> {
    return unlink(join(filePath, filename));
  }
  getStream(filePath: string, filename: string) {
    return createReadStream(join(filePath, filename));
  }
}
