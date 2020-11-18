import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import * as R from 'ramda';

import { injectable } from 'inversify';
import { ListDirectoryResult } from '../models/ListDirectoryResult';

@injectable()
export class FileSystemRA {
  ls(path: string): ListDirectoryResult {
    const files = readdirSync(path)
      .concat('..')
      .map((file) => {
        let isDirectory: boolean,
          isAccessible = true;
        try {
          isDirectory = statSync(join(path, file)).isDirectory();
        } catch (err) {
          isAccessible = false;
        }
        return {
          name: file,
          isDirectory,
          fullPath: join(path, file),
          isAccessible,
          directoryPath: path
        };
      })
      .filter((x) => x.isAccessible);

    const [dirs, file] = R.partition((file) => file.isDirectory, files);

    const result = {
      path,
      files: R.sortBy(R.prop('name'), dirs).concat(
        R.sortBy(R.prop('name'), file)
      )
    };
    return result;
  }
}
