import { MediaItem } from '../../server/models';

class MediaRA {
  latest(count: number): Promise<Array<MediaItem>> {
    return fetch(`/api/media/latest/${count}`).then(x => x.json());
  }
  details(id: string): Promise<MediaItem> {
    return fetch(`/api/media/detail/${id}`).then(x => x.json());
  }
  requestMeta(id: string): Promise<{ meta: string }> {
    return fetch(`/api/media/request-meta/${id}`, { method: 'POST' }).then(x =>
      x.json()
    );
  }
  generateSrt(id: string, track: string): Promise<{ srt: string }> {
    return fetch(`/api/media/request-srt/${id}/${track}`, {
      method: 'POST'
    }).then(x => x.json());
  }

  generateWebVtt(id: string): Promise<{ webvtt: string }> {
    return fetch(`/api/media/request-webvtt/${id}`, {
      method: 'POST'
    }).then(x => x.json());
  }
}

export default new MediaRA();
