import ServerRA from '../ResourceAccess/ServerRA';

class ServerManager {
  listDirectory(directory?: string) {
    return ServerRA.listDirectory(directory);
  }
}

export default new ServerManager();
