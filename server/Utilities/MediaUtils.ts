import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

export namespace MediaUtils {
  export function deleteMedia(dir: string, filename: string) {
    const fullpath = join(dir, filename);
    if (!existsSync(fullpath)) return;
    unlinkSync(fullpath);
  }
}
