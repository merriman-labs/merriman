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
    this.router.get('/external/:video', this.getMediaUrl);
  }

  getMediaUrl: RequestHandler = async (req, res) => {
    const url = await this._mediaManager.getMediaUrl(req.params.video);
    return res.send(url).status(200);
  };

  streamMedia: RequestHandler = async (req, res) => {
    const config = AppContext.get(AppContext.WellKnown.Config);
    const videoId = req.params.video.replace('.mp4', '');
    const userId = req.user?._id ?? undefined;
    const video = await this._mediaManager.findById(videoId, userId);
    const vDir = video.path ? video.path : config.mediaLocation;
    const mediaPath = config.rewritePath(vDir);

    const vPath = path.join(mediaPath, video.filename);

    res.sendFile(vPath);
  };

  getCaptions: RequestHandler = async (req, res) => {
    const item = await this._mediaManager.findById(req.params.id, req.user._id);
    if (!item.webvtt) res.status(404).send('not found');
    res.status(200).send(item.webvtt);
  };
}
