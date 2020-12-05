import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { MediaStateManager } from '../Managers/MediaStateManager';
import Validator from '../Validation/Validator';
import { IController } from './IController';

@injectable()
export class MediaStateController implements IController {
  path = '/media-state';
  router = Router();
  constructor(
    @inject(DependencyType.Managers.MediaState)
    private _mediaStateManager: MediaStateManager
  ) {
    this.router.post('/setWatchTime', this.setWatchTime);
    this.router.get('/getMediaState/:id', this.getMediaState);
  }

  getMediaState: RequestHandler = async (req, res) => {
    const mediaId = req.params.id;
    const userId = req.user._id;
    const state = await this._mediaStateManager.getMediaTime(mediaId, userId);
    return res.json(state);
  };
  setWatchTime: RequestHandler = async (req, res) => {
    const { mediaId, time, userId } = Validator.MediaState.SetWatchTime({
      userId: req.user._id,
      mediaId: req.body.mediaId,
      time: req.body.time
    });
    await this._mediaStateManager.setMediaTime(mediaId, time, userId);
    res.status(200).send();
  };
}
