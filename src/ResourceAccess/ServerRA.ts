import { ListDirectoryResult } from '../../server/models/ListDirectoryResult';

class ServerRA {
  listDirectory(directory: string = ''): Promise<ListDirectoryResult> {
    return fetch(`/api/server/${directory}`).then((x) => x.json());
  }
}

export default new ServerRA();
