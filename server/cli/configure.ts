import { ask, askBoolean } from './util';
import ServerConfigRepo from '../data/ServerConfigRepo';
import { existsSync, mkdirSync } from 'fs';

export async function configure() {
  const configRepo = new ServerConfigRepo();
  const config = await configRepo.fetch();

  console.log('This guide will help you configure your server');

  const mediaLocation = await configureMediaLocation(
    config.mediaLocation,
    'media'
  );
  if (mediaLocation !== config.mediaLocation)
    await configRepo.setMediaLocation(mediaLocation);

  const thumbLocation = await configureMediaLocation(
    config.thumbLocation,
    'thumbnails'
  );
  if (thumbLocation !== config.thumbLocation)
    await configRepo.setThumbnailLocation(thumbLocation);

  const serverName = await configureInstanceName(config.name);
  if (serverName !== config.name) await configRepo.setServerName(serverName);

  const mongoUrl = await configureMongo(
    (config.mongo && config.mongo.url) || ''
  );
  if (!config.mongo || mongoUrl !== config.mongo.url)
    await configRepo.setMongoUrl(mongoUrl);
}

async function configureMediaLocation(existingLocation: string, item: string) {
  if (existingLocation === '') {
    const mediaLocation = await ask(
      `Please enter a location where you want to store ${item}:`
    );
    if (!existsSync(mediaLocation)) {
      const shouldCreate = await askBoolean(
        `Entered location doesn't exist (${mediaLocation}). Create it? ${
          '[y/N]'.green
        }`
      );
      if (shouldCreate) {
        console.log('Creating...');
        mkdirSync(mediaLocation);
      } else {
        return configureMediaLocation('', item);
      }
    }
    return mediaLocation;
  } else {
    const keepCurrentLocation = await ask(
      `${item} configured to be stored at ${existingLocation}\nKeep storing at this location?`
    );
    if (!keepCurrentLocation) return configureMediaLocation('', item);
    return existingLocation;
  }
}

async function configureInstanceName(existingName: string) {
  const shouldChange = await askBoolean(
    `Server is currently named ${existingName}. Change it? [y/N]`
  );
  if (shouldChange) {
    return ask('Please enter a new name for the server:');
  }
  return existingName;
}

async function configureMongo(url: string) {
  const shouldChange = await askBoolean(
    `Server is configured to connect to Mongo using the following connection string: ${url}. Change it? [y/N]`
  );
  if (shouldChange) {
    return ask('Please enter a new connection string:');
  }
  return url;
}
