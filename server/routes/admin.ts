import { Router } from 'express';
import { LibraryManager } from '../Managers/LibraryManager';

const adminRouter = Router();
const libraryManager = new LibraryManager();

adminRouter.post('/libraries/modify-media', async function(req, res) {
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

adminRouter.post('/libraries/add', async function(req, res) {
  const library = req.body;
  await libraryManager.insert(library);
  res.sendStatus(200);
});

adminRouter.delete('/libraries/:id', function(req, res) {
  const id = req.params.id;
  if (id) libraryManager.delete(id).then(_ => res.sendStatus(200));
});

export default adminRouter;
