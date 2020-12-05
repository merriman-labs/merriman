import WatchStateRA from '../ResourceAccess/WatchStateRA';

class WatchStateManager {
  getWatchState(mediaId: string) {
    return WatchStateRA.getWatchState(mediaId);
  }

  setWatchTime(mediaId: string, time: number) {
    return WatchStateRA.setWatchTime(mediaId, time);
  }
}

export default new WatchStateManager();
