import { Router } from 'express';
import * as R from 'ramda';
import { MediaManager } from '../Managers/MediaManager';
import { LibraryManager } from '../Managers/LibraryManager';

const libraryRouter = Router();
const libraryRepo = new LibraryManager();
const mediaRepo = new MediaManager();

// List all libraries
libraryRouter.get('/', async function(req, res) {
  const response = await libraryRepo.get();
  res.json(response);
});

// Return the details of a library
libraryRouter.get('/details/:id', async function(req, res) {
  const { id } = req.params;
  const library = await libraryRepo.findById(id);

  if (!library) return res.status(500).json({ message: 'Library not found!' });
  res.json(library);
});

// Return media for a particular library
libraryRouter.get('/:library', async function(req, res) {
  const id = req.params.library;
  const library = await libraryRepo.findById(id);

  const media = await mediaRepo.where(({ _id }) =>
    R.contains(_id, library.items)
  );

  if (!library) return res.status(500).json({ message: 'Library not found!' });
  res.json({ media });
});

export default libraryRouter;
