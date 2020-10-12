import { existsSync, readFileSync } from 'fs';
import { fromSrt } from '@johnny.reina/convert-srt';

import { MongoFactory } from '../Factories/MongoFactory';
import ServerConfigRepo from '../data/ServerConfigRepo';
import { MediaManager } from '../Managers/MediaManager';

export async function checkSubs(config: string) {
  const configRepo = new ServerConfigRepo(config);
  await MongoFactory.init(configRepo);
  const { mediaLocation } = await configRepo.fetch();

  const mediaManager = new MediaManager();
  const items = await mediaManager.get();
  items.forEach(async item => {
    if (Array.isArray(item.subtitles)) return;
    const path = item.path || mediaLocation;
    const name = item.filename
      .split('.')
      .slice(0, -1)
      .join('');
    const filePath = `${path}\\${name}.srt`;
    if (existsSync(filePath)) {
      console.log(`Adding subs for ${item.name} from ${filePath}`);
      const srt = readFileSync(filePath, { encoding: 'utf8' });
      const subs = fromSrt(srt);
      item.subs = subs;
      await mediaManager.update(item);
    }
  });
}
