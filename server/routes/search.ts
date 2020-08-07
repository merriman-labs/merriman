import { Router } from 'express';
import { MediaManager } from '../Managers/MediaManager';

const searchRouter = Router();
const mediaManager = new MediaManager();

searchRouter.get('/:term', async function(req, res) {
  const term = req.params.term;
  const results = await mediaManager.where(item =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(term.toLowerCase())
  );

  res.json({ results });
});

export default searchRouter;
