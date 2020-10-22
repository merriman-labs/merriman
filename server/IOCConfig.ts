import { Container } from 'inversify';
import { Db } from 'mongodb';
import { DependencyType } from './Constant/DependencyType';
import { LibraryController } from './Controllers/LibraryController';
import { MediaController } from './Controllers/MediaController';
import { LibraryEngine } from './Engines/LibraryEngine';
import { MediaEngine } from './Engines/MediaEngine';
import { MongoFactory } from './Factories/MongoFactory';
import { LibraryManager } from './Managers/LibraryManager';
import { MediaManager } from './Managers/MediaManager';
import LibraryRA from './ResourceAccess/LibraryRA';
import MediaRA from './ResourceAccess/MediaRA';
import { Configuration } from './Utilities/ConfigUtil';

const container = new Container();

async function setupIoc(config: Configuration) {
  container.bind(DependencyType.ResourceAccess.Library).to(LibraryRA);
  container.bind(DependencyType.ResourceAccess.Media).to(MediaRA);

  container.bind(DependencyType.Engines.Library).to(LibraryEngine);
  container.bind(DependencyType.Engines.Media).to(MediaEngine);

  container.bind(DependencyType.Managers.Library).to(LibraryManager);
  container.bind(DependencyType.Managers.Media).to(MediaManager);

  container.bind(DependencyType.Controller.Library).to(LibraryController);
  container.bind(DependencyType.Controller.Media).to(MediaController);

  await MongoFactory.init(config);
  const mongo = await MongoFactory.create();
  container.bind<Db>(DependencyType.External.MongoDB).toConstantValue(mongo);
}

export { container, setupIoc };
