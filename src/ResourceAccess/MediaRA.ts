import { Library, MediaItem, RegisterLocalPayload } from '../../server/models';

class MediaRA {
  list(): Promise<Array<MediaItem>> {
    return fetch('/api/media').then((x) => x.json());
  }

  registerLocal(
    payload: Omit<RegisterLocalPayload, 'userId'>
  ): Promise<MediaItem> {
    return fetch('/api/media/registerLocal', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());
  }

  update(item: MediaItem): Promise<{ status: 'OK' }> {
    return fetch('/api/media/', {
      method: 'PUT',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());
  }
  latest(count: number): Promise<Array<MediaItem>> {
    return fetch(`/api/media/latest/${count}`).then((x) => x.json());
  }
  random(): Promise<MediaItem> {
    return fetch(`/api/media/random`).then((x) => x.json());
  }

  search(term: string): Promise<Array<MediaItem>> {
    return fetch(`/api/media/search/${term}`).then((x) => x.json());
  }
  async upload(data: FormData) {
    await fetch('/api/media/upload', {
      method: 'POST',
      body: data
    });
  }
  tags(): Promise<{ tags: Array<string> }> {
    return fetch(`/api/media/tags`, { credentials: 'include' }).then((x) =>
      x.json()
    );
  }
  getByTag(tag: string): Promise<{ items: Array<MediaItem> }> {
    return fetch(`/api/media/list/byTag/${tag}`).then((x) => x.json());
  }
  getByLibrary(library: string): Promise<Array<MediaItem>> {
    return fetch(`/api/media/list/byLibrary/${library}`).then((x) => x.json());
  }
  details(id: string): Promise<MediaItem> {
    return fetch(`/api/media/detail/${id}`).then((x) => x.json());
  }
  deleteById(id: string, hard: boolean = false): Promise<{ result: boolean }> {
    return fetch(`/api/media/${id}?hard=${hard}`, {
      method: 'DELETE'
    }).then((x) => x.json());
  }
  requestMeta(id: string): Promise<{ meta: string }> {
    return fetch(`/api/media/request-meta/${id}`, {
      method: 'POST'
    }).then((x) => x.json());
  }
  generateSrt(id: string, track: string): Promise<{ srt: string }> {
    return fetch(`/api/media/request-srt/${id}/${track}`, {
      method: 'POST'
    }).then((x) => x.json());
  }

  generateWebVtt(id: string): Promise<{ webvtt: string }> {
    return fetch(`/api/media/request-webvtt/${id}`, {
      method: 'POST'
    }).then((x) => x.json());
  }
}

export default new MediaRA();
