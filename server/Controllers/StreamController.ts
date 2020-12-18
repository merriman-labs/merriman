import * as fs from 'fs';
import * as path from 'path';
import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { IController } from './IController';
import { AppContext } from '../appContext';
import { DependencyType } from '../Constant/DependencyType';
import { MediaManager } from '../Managers/MediaManager';
import { AsyncRouter } from '../Utilities/AsyncRouter';

@injectable()
export class StreamController implements IController {
  public router = AsyncRouter();
  public path = '/media';

  constructor(
    @inject(DependencyType.Managers.Media) private _mediaManager: MediaManager
  ) {
    this.router.get('/play/:video', this.streamMedia);
    this.router.get('/captions/:id', this.getCaptions);
  }

  streamMedia: RequestHandler = async (req, res) => {
    const { mediaLocation } = AppContext.get(AppContext.WellKnown.Config);
    const videoId = req.params.video.replace('.mp4', '');
    const userId = req.user?._id ?? undefined;
    const video = await this._mediaManager.findById(videoId, userId);
    const vDir = video.path ? video.path : mediaLocation;
    const vPath = path.join(vDir, video.filename);

    const stat = fs.statSync(vPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      if (start === 0) await this._mediaManager.incrementViewCount(videoId);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(vPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      };
      res.writeHead(200, head);
      fs.createReadStream(vPath).pipe(res);
    }
  };

  getCaptions: RequestHandler = async (req, res) => {
    const item = await this._mediaManager.findById(req.params.id, req.user._id);
    if (!item.webvtt) res.status(404).send('not found');
    res.status(200).send(item.webvtt);
  };
}
