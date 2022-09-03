import axios from 'axios';
import { MediaItem, RegisterLocalPayload } from '../../server/models';
import { TagStatistic } from '../../server/ViewModels';
import { post } from '../util/HttpMethods';

class MediaRA {
  registerLocal(
    payload: Omit<RegisterLocalPayload, 'userId' | 'username'>
  ): Promise<MediaItem> {
    return fetch('/api/media/registerLocal', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((x) => x.json());
  }

  recentlyPlayed(limit: number): Promise<Array<MediaItem>> {
    return fetch(`/api/media/recentlyPlayed?limit=${limit}`).then((x) =>
      x.json()
    );
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
  latest(limit: number, skip: number = 0): Promise<Array<MediaItem>> {
    return fetch(`/api/media/latest?skip=${skip}&limit=${limit}`).then((x) =>
      x.json()
    );
  }
  random(count: number): Promise<Array<MediaItem>> {
    return fetch(`/api/media/random?count=${count}`).then((x) => x.json());
  }

  search(term: string): Promise<Array<MediaItem>> {
    return fetch(`/api/media/search/${term}`).then((x) => x.json());
  }
  async upload(
    data: FormData,
    updateProgress: (progress: number) => void
  ): Promise<MediaItem> {
    return axios
      .post('/api/media/upload', data, {
        onUploadProgress: (p) => {
          updateProgress(Math.ceil((p.loaded / p.total) * 100));
        }
      })
      .then((x) => x.data);
  }
  tags(): Promise<{ tags: Array<TagStatistic> }> {
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

  regenerateThumbnail(mediaId: string, timestamp: string): Promise<void> {
    return post('/api/media/regenerate-thumbnail', { mediaId, timestamp });
  }
}

export default new MediaRA();
