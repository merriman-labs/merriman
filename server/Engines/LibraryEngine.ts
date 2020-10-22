import * as R from 'ramda';

import { Library } from '../models';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export class LibraryEngine {
  initializeLibrary(library: Library): Library {
    return R.pipe(
      R.assoc('_id', new ObjectId()),
      R.assoc('items', [])
    )(library) as Library;
  }
}
