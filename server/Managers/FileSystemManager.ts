import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { ListDirectoryResult } from '../models/ListDirectoryResult';
import { FileSystemRA } from '../ResourceAccess/FileSystemRA';
import MediaRA from '../ResourceAccess/MediaRA';
import * as R from 'ramda';

@injectable()
export class FileSystemManager {
  constructor(
    @inject(DependencyType.ResourceAccess.FileSystem)
    private _fileSystemRA: FileSystemRA,
    @inject(DependencyType.ResourceAccess.Media)
    private _mediaRA: MediaRA
  ) {}

  async ls(path: string): Promise<ListDirectoryResult> {
    const directoryResult = this._fileSystemRA.ls(path);
    const directoryFileNames = directoryResult.files
      .filter((file) => !file.isDirectory)
      .map((file) => file.name);
    if (directoryFileNames.length > 0) {
      const existing = await this._mediaRA.findAllByFileName(
        directoryFileNames
      );

      if (existing.length > 0) {
        const diff = R.differenceWith(
          (a, b) => a.name === b.filename,
          directoryResult.files,
          existing
        );
        directoryResult.files = diff;
      }
    }
    return directoryResult;
  }
}
