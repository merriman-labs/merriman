import { Library, SetMediaOrderPayload } from '../../server/models';
import LibraryRA from '../ResourceAccess/LibraryRA';

class LibraryManager {
  getById(id: string): Promise<Library> {
    return LibraryRA.getById(id);
  }
  create(library: { name: string; isSeason: boolean }): Promise<Library> {
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
  addMedia(libraryId: string, mediaId: string) {
    return LibraryRA.addItem(libraryId, mediaId);
  }
  removeMedia(libraryId: string, mediaId: string) {
    return LibraryRA.removeItem(libraryId, mediaId);
  }
  setMediaOrder(payload: SetMediaOrderPayload) {
    return LibraryRA.setMediaOrder(payload);
  }
}

export default new LibraryManager();
