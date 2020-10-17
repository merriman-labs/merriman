import LibraryRA from '../data/LibraryRA';

class LibraryManager {
  list() {
    return LibraryRA.list();
  }
  addMedia(id: string, library: string) {
    return LibraryRA.addMedia(id, library);
  }
}

export default new LibraryManager();
