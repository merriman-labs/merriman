import { Router } from 'express';
import LibraryRepo from '../data/LibraryRepo';

const adminRouter = Router();
const libraryRepo = new LibraryRepo();

adminRouter.post('/libraries/modify-media', async function(req, res) {
  const { library, media, action } = req.body;
  if (library && media && action) {
    if (action === 'ADD') {
      libraryRepo
        .addMediaToLibrary(media, library)
        .then(() => res.sendStatus(200));
    }
    if (action === 'DROP') {
      libraryRepo
        .removeMediaToLibrary(media, library)
        .then(() => res.sendStatus(200));
    }
  } else {
    res.sendStatus(500);
  }
});

adminRouter.post('/libraries/add', async function(req, res) {
  const library = req.body;
  await libraryRepo.insert(library);
  res.sendStatus(200);
});

adminRouter.delete('/libraries/:id', function(req, res) {
  const id = req.params.id;
  if (id) libraryRepo.delete(id).then(_ => res.sendStatus(200));
});

export default adminRouter;
