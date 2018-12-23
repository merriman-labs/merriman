import { Router } from 'express';
import LibraryRepo from '../data/LibraryRepo';
import ServerConfigRepo from '../data/ServerConfigRepo';
import MediaRepo from '../data/MediaRepo';

const adminRouter = Router();
const libraryRepo = new LibraryRepo();
const mediaRepo = new MediaRepo();
const serverConfigRepo = new ServerConfigRepo();

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

adminRouter.post('/libraries/add', function(req, res) {
  const library = req.body;
  libraryRepo.insert(library);
  res.sendStatus(200);
});

adminRouter.delete('/libraries/:id', function(req, res) {
  const id = req.params.id;
  if (id) libraryRepo.delete(id).then(_ => res.sendStatus(200));
});

adminRouter.post('/local-media-scan', async function(req, res) {
  return res.json(mediaRepo.findUnregisteredMedia());
});

adminRouter.post('/server-config', function(req, res) {
  const { mediaLocation, thumbnailLocation } = req.body;

  if (mediaLocation) serverConfigRepo.setMediaLocation(mediaLocation);
  if (thumbnailLocation)
    serverConfigRepo.setThumbnailLocation(thumbnailLocation);
  res.sendStatus(200);
});

adminRouter.get('/server-config', function(req, res) {
  const config = serverConfigRepo.fetch();
  res.json(config);
});

export default adminRouter;
