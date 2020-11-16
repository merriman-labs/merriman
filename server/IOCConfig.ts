import { Container } from 'inversify';
import { Db } from 'mongodb';
import { DependencyType } from './Constant/DependencyType';
import { AdminController } from './Controllers/AdminController';
import { AuthController } from './Controllers/AuthController';
import { LibraryController } from './Controllers/LibraryController';
import { MediaController } from './Controllers/MediaController';
import { ServerController } from './Controllers/ServerController';
import { StreamController } from './Controllers/StreamController';
import { UserController } from './Controllers/UserController';
import { AuthEngine } from './Engines/AuthEngine';
import { LibraryEngine } from './Engines/LibraryEngine';
import { MediaEngine } from './Engines/MediaEngine';
import { MongoFactory } from './Factories/MongoFactory';
import { AuthManager } from './Managers/AuthManager';
import { FileSystemManager } from './Managers/FileSystemManager';
import { LibraryManager } from './Managers/LibraryManager';
import { MediaManager } from './Managers/MediaManager';
import { UserManager } from './Managers/UserManager';
import { FileSystemRA } from './ResourceAccess/FileSystemRA';
import LibraryRA from './ResourceAccess/LibraryRA';
import MediaRA from './ResourceAccess/MediaRA';
import { UserRA } from './ResourceAccess/UserRA';
import { Configuration } from './Utilities/ConfigUtil';

const container = new Container();

async function setupIoc(config: Configuration) {
  // Database connection needs to be set up before everything else
  const mongo = await MongoFactory.init(config);
  container.bind<Db>(DependencyType.External.MongoDB).toConstantValue(mongo);

  container.bind(DependencyType.ResourceAccess.Library).to(LibraryRA);
  container.bind(DependencyType.ResourceAccess.Media).to(MediaRA);
  container.bind(DependencyType.ResourceAccess.FileSystem).to(FileSystemRA);
  container.bind(DependencyType.ResourceAccess.User).to(UserRA);

  container.bind(DependencyType.Engines.Auth).to(AuthEngine);
  container.bind(DependencyType.Engines.Library).to(LibraryEngine);
  container.bind(DependencyType.Engines.Media).to(MediaEngine);

  container.bind(DependencyType.Managers.Auth).to(AuthManager);
  container.bind(DependencyType.Managers.Library).to(LibraryManager);
  container.bind(DependencyType.Managers.Media).to(MediaManager);
  container.bind(DependencyType.Managers.FileSystem).to(FileSystemManager);
  container.bind(DependencyType.Managers.User).to(UserManager);

  container.bind(DependencyType.Controller.Auth).to(AuthController);
  container.bind(DependencyType.Controller.Admin).to(AdminController);
  container.bind(DependencyType.Controller.Library).to(LibraryController);
  container.bind(DependencyType.Controller.Media).to(MediaController);
  container.bind(DependencyType.Controller.Server).to(ServerController);
  container.bind(DependencyType.Controller.Stream).to(StreamController);
  container.bind(DependencyType.Controller.User).to(UserController);

  return container;
}

export { setupIoc };
