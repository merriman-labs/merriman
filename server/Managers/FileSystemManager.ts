import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { FileSystemRA } from '../ResourceAccess/FileSystemRA';

@injectable()
export class FileSystemManager {
  constructor(
    @inject(DependencyType.ResourceAccess.FileSystem)
    private _fileSystemRA: FileSystemRA
  ) {}

  ls(path: string) {
    return this._fileSystemRA.ls(path);
  }
}
