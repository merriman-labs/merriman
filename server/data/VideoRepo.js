const fs = require('fs');
const R = require('ramda');
const uuid = require('uuid/v4');

class VideoRepo {
  constructor() {
    this._dbpath = __dirname + '/db/videos.json';

    this._ensureConfig();
  }

  /**
   * @returns {Array<MediaItem>}
   */
  get() {
    return JSON.parse(
      fs.readFileSync(__dirname + '/db/videos.json', { encoding: 'utf8' })
    );
  }

  /**
   *
   * @param {string} filename
   * @returns {string} The `_id` property of the new media item.
   */
  save(conf) {
    fs.writeFileSync(this._dbpath, JSON.stringify(conf));
  }

  /**
   *
   * @param {string} filename
   * @returns {string} The `_id` property of the new media item.
   */
  add(filename) {
    const videos = this.get();
    const newVideo = this._initVideo(filename);
    fs.writeFileSync(this._dbpath, JSON.stringify(videos.concat(newVideo)));
    return newVideo._id;
  }

  _ensureConfig() {
    if (!fs.existsSync(this._dbpath)) this.save([]);
  }

  _initVideo(name) {
    return {
      name,
      filename: name,
      _id: uuid()
    };
  }
}

module.exports = VideoRepo;
