const R = require('ramda');
const uuid = require('uuid/v4');
const VideoRepo = require('../data/VideoRepo');

class VideoManager {
  constructor() {
    this._repo = new VideoRepo();
  }

  /**
   * Adds or updates a library.
   * @param {{} | MediaItem} video
   */
  save(video) {
    const conf = this._repo.get();

    const newVid = R.has('_id', video) ? video : this._initVideo(video);
    const { _id: libId } = newVid;

    const existingVid = R.find(({ _id }) => libId === _id, conf.libraries);
    const libraries = existingVid
      ? conf.libraries.map(lib => (lib._id === libId ? video : lib))
      : conf.libraries.concat(newVid);

    const newConfig = R.mergeAll([{}, conf, { libraries }]);

    this._repo.save(newConfig);
  }

  /**
   *
   * @param {string} idToRemove `_id` of the video to remove.
   */
  delete(idToRemove) {
    const conf = this._repo.get();
    const videos = conf.videos.filter(({ _id }) => _id !== idToRemove);
    const newConfig = R.mergeAll([{}, conf, { videos }]);
    this._repo.save(newConfig);
  }

  /**
   *
   * @param {string} id the `_id` of the video to load
   */
  load(id) {
    return this._repo.get().videos.find(vid => vid._id === id);
  }

  /**
   * List all videos.
   */
  list() {
    return this._repo.get().videos;
  }

  /**
   * Initialize a new video object with required properties.
   * @param {{}} video
   * @returns {MediaItem}
   */
  _initVideo(video) {
    return R.compose(R.assoc('created', new Date()), R.assoc('_id', uuid()))(
      video
    );
  }
}

module.exports = new VideoManager();
