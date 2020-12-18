import * as R from 'ramda';
import { ObjectId } from 'mongodb';
import { MediaItem } from '../../server/models';

export class PlayQueue {
  private _queue: Array<MediaItem> = [];
  constructor(
    items: Array<MediaItem>,
    ordering: Array<{ id: ObjectId | string; order: number }>
  ) {
    const sorted = R.sortBy(R.prop('order'), ordering)
      .map(({ id }) => {
        return items.find((item) => item._id.toString() === id.toString());
      })
      .filter(Boolean) as Array<MediaItem>;
    this._queue.push(...sorted);
  }
}
