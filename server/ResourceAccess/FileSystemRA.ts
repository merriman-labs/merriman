import { readdirSync, statSync } from 'fs';
import { join } from 'path';

import { injectable } from 'inversify';
import { ListDirectoryResult } from '../models/ListDirectoryResult';

@injectable()
export class FileSystemRA {
  ls(path: string): ListDirectoryResult {
    const files = readdirSync(path)
      .concat('..')
      .map(file => {
        let isDirectory,
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
          isAccessible
        };
      })
      .filter(x => x.isAccessible);

    const result = {
      path,
      files
    };
    return result;
  }
}
