import { Router } from 'express';
import * as R from 'ramda';
import { MediaManager } from '../Managers/MediaManager';
import { LibraryManager } from '../Managers/LibraryManager';

const libraryRouter = Router();
const libraryManager = new LibraryManager();
const mediaRepo = new MediaManager();

// List all libraries
libraryRouter.get('/', async function(req, res) {
  const response = await libraryManager.get();
  res.json(response);
});

// Return the details of a library
libraryRouter.get('/details/:id', async function(req, res) {
  const { id } = req.params;
  const library = await libraryManager.findById(id);

  if (!library) return res.status(500).json({ message: 'Library not found!' });
  res.json(library);
});

// Return media for a particular library
libraryRouter.get('/:library', async function(req, res) {
  const id = req.params.library;
  const library = await libraryManager.findById(id);

  const media = await mediaRepo.where(({ _id }) =>
    R.contains(_id, library.items)
  );

  if (!library) return res.status(500).json({ message: 'Library not found!' });
  res.json({ media });
});

libraryRouter.post('/', async function(req, res) {
  const { library, media, action } = req.body;
  if (library && media && action) {
    if (action === 'ADD') {
      libraryManager
        .addMediaToLibrary(media, library)
        .then(() => res.sendStatus(200));
    }
    if (action === 'DROP') {
      libraryManager
        .removeMediaFromLibrary(media, library)
        .then(() => res.sendStatus(200));
    }
  } else {
    res.sendStatus(500);
  }
});

export default libraryRouter;
