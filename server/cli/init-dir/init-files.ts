import ThumbProvider from '../../thumb-provider';
import ServerConfigRepo from '../../data/ServerConfigRepo';
import * as Bluebird from 'bluebird';
import { MediaManager } from '../../Managers/MediaManager';
import { Configuration } from '../../Utilities/ConfigUtil';

/**
 * Add a list of files to the database
 *
 * @param files Filenames to add to database
 * @param source Path of files to add
 */
export default async (
  files: Array<string>,
  source: string,
  config: Configuration
) => {
  const { thumbLocation } = config;
  const mediaManager = new MediaManager();

  await ThumbProvider.ensureThumbs(files, source, thumbLocation);
  const newItems = await Bluebird.mapSeries(files, file =>
    mediaManager.add(file, source)
  );
  newItems.forEach(item => {
    console.log(`${item.name} added to database with _id ${item._id}`);
  });
};
