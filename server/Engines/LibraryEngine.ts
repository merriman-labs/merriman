import * as R from 'ramda';

import { Library } from '../models';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export class LibraryEngine {
  initializeLibrary(library: { name: string; userId: string }): Library {
    return R.pipe(
      R.assoc('_id', new ObjectId()),
      R.assoc('items', []),
      R.assoc('userId', new ObjectId(library.userId)),
      R.assoc('createdAt', new Date())
    )(library) as Library;
  }
}
