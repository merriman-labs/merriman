const fs = require('fs');
const R = require('ramda');
const uuid = require('uuid/v4');

class VideoRepo {
  constructor() {
    this._dbpath = __dirname + '/db/videos.json';

    this._ensureConfig();
  }

  /**
   * @returns {Array<Video>}
   */
  get() {
    return JSON.parse(
      fs.readFileSync(__dirname + '/db/videos.json', { encoding: 'utf8' })
    );
  }

  /**
   *
   * @param {Array<Video>} conf
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

    const existingVideo = videos.find(video => video.filename === filename);

    if (existingVideo) return existingVideo._id;

    const newVideo = this._initVideo(filename);
    fs.writeFileSync(this._dbpath, JSON.stringify(videos.concat(newVideo)));
    return newVideo._id;
  }

  /**
   *
   * @param {Video} updatedVideo
   */
  update(updatedVideo) {
    const videos = this.get();

    const newVideos = videos.map(
      video => (video._id === updatedVideo._id ? updatedVideo : video)
    );

    return this.save(newVideos);
  }

  _ensureConfig() {
    if (!fs.existsSync(this._dbpath)) this.save([]);
  }

  _initVideo(name) {
    return {
      name,
      filename: name,
      _id: uuid(),
      favorite: false
    };
  }
}

/** @typedef {{name:string,filename:string,_id:string,favorite:boolean}} Video */

module.exports = VideoRepo;
