import * as R from 'ramda';

import { Library } from '../models';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';
import { ItemVisibility } from '../Constant/ItemVisibility';

@injectable()
export class LibraryEngine {
  initializeLibrary(library: {
    name: string;
    userId: string;
    username: string;
    isSeason: boolean;
  }): Library {
    const createdAt = new Date();
    return {
      _id: new ObjectId(),
      name: library.name,
      items: [],
      user: {
        userId: new ObjectId(library.userId),
        username: library.username
      },
      createdAt,
      updatedAt: createdAt,
      visibility: ItemVisibility.public,
      isSeason: library.isSeason
    };
  }
}
