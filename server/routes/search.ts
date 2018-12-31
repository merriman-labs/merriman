import { Router } from 'express';
import MediaItemRepo from '../data/MediaRepo';

const searchRouter = Router();
const mediaRepo = new MediaItemRepo();

searchRouter.get('/:term', async function(req, res) {
  const term = req.params.term;
  const results = mediaRepo.where(item =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(term.toLowerCase())
  );

  if (!results) return res.status(500).json({ message: 'Library not found!' });
  res.json({ results });
});

export default searchRouter;
