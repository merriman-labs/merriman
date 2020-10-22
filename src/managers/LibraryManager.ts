import { Library } from '../../server/models';
import LibraryRA from '../ResourceAccess/LibraryRA';

class LibraryManager {
  getById(id: string): Promise<Library> {
    return LibraryRA.getById(id);
  }
  create(library: { name: string }): Promise<Library> {
    return LibraryRA.create(library);
  }
  list() {
    return LibraryRA.list();
  }
  update(library: Library) {
    return LibraryRA.update(library);
  }
  delete(id: string) {
    return LibraryRA.delete(id);
  }
}

export default new LibraryManager();
