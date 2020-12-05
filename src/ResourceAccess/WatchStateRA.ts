import { MediaState } from '../../server/models';

class WatchStateRA {
  getWatchState(mediaId: string): Promise<MediaState> {
    return fetch(`/api/media-state/getMediaState/${mediaId}`).then((x) =>
      x.json()
    );
  }

  setWatchTime(mediaId: string, time: number) {
    fetch('/api/media-state/setWatchTime', {
      body: JSON.stringify({ mediaId, time }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
  }
}

export default new WatchStateRA();
