import { Library } from '../../server/models';

class LibraryRA {
  list(): Promise<Array<Library>> {
    return fetch('/api/library').then(x => x.json());
  }
  async addMedia(id: string, libraryId: string): Promise<void> {
    await fetch('/api/library', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        library: libraryId,
        media: id,
        action: 'ADD'
      })
    });
  }
}

export default new LibraryRA();
