import { MediaItem } from '../../server/models';

class MediaRA {
  latest(count: number): Promise<Array<MediaItem>> {
    return fetch(`/api/media/latest/${count}`).then(x => x.json());
  }
}

export default new MediaRA();
