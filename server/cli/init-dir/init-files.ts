import MediaRepo from '../../data/MediaRepo';
import ThumbProvider from '../../thumb-provider';
import ServerConfigRepo from '../../data/ServerConfigRepo';
import * as Bluebird from 'bluebird';

const serverConfigRepo = new ServerConfigRepo();

/**
 * Add a list of files to the database
 *
 * @param files Filenames to add to database
 * @param source Path of files to add
 */
export default async (files: Array<string>, source: string) => {
  const { thumbLocation } = await serverConfigRepo.fetch();
  const mediaRepo = new MediaRepo();

  await ThumbProvider.ensureThumbs(files, source, thumbLocation);
  const newItems = await Bluebird.mapSeries(files, file =>
    mediaRepo.addExternal(file, source)
  );
  newItems.forEach(item => {
    console.log(`${item.name} added to database with _id ${item._id}`);
  });
};
