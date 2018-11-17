const fs = require('fs');
const R = require('ramda');
const uuid = require('uuid/v4');

class MediaRepo {
  constructor() {
    this._dbpath = __dirname + '/db/media.json';

    this._ensureConfig();
  }

  /**
   * @returns {Array<Video>}
   */
  get() {
    return JSON.parse(fs.readFileSync(this._dbpath, { encoding: 'utf8' }));
  }

  /**
   *
   * @param {Array<Video>} conf
   * @returns {string} The `_id` property of the new media item.
   */
  _save(conf) {
    fs.writeFileSync(this._dbpath, JSON.stringify(conf));
  }

  /**
   *
   * @param {string} filename
   * @returns {MediaItem} The `_id` property of the new media item.
   */
  add(filename) {
    const fileParts = filename.split('.');
    const fileExtension = [...fileParts.slice(1)].join('.');
    const newId = uuid();
    const newFilename = `${newId}.${fileExtension}`;

    const videos = this.get();

    const newVideo = this._initVideo(newFilename, filename, newId);
    this._save(videos.concat(newVideo));
    return newVideo;
  }
  /**
   *
   * @param {((x: MediaItem) => boolean)} predicate
   * @returns {MediaItem}
   */
  find(predicate) {
    return R.find(predicate, this.get());
  }
  /**
   *
   * @param {((x: MediaItem) => boolean)} predicate
   * @returns {Array<MediaItem>}
   */
  where(predicate) {
    return this.get().filter(predicate);
  }
  /**
   *
   * @param {Video} updatedVideo
   */
  update(updatedVideo) {
    const videos = this.get();

    const newVideos = videos.map(video =>
      video._id === updatedVideo._id ? updatedVideo : video
    );

    return this._save(newVideos);
  }

  _ensureConfig() {
    if (!fs.existsSync(this._dbpath)) this._save([]);
  }

  /**
   *
   * @param {string} name
   * @param {string} originalName
   * @returns {MediaItem}
   */
  _initVideo(name, originalName, id) {
    return {
      name: originalName,
      filename: name,
      _id: id,
      favorite: false
    };
  }
}

/** @typedef {{name:string,filename:string,_id:string,favorite:boolean}} Video */

module.exports = new MediaRepo();
