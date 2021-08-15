import { Library } from '../../server/models';

class LibraryRA {
  getById(id: string): Promise<Library> {
    return fetch(`/api/library/${id}`).then((x) => x.json());
  }
  async create(library: { name: string; isSeason: boolean }): Promise<Library> {
    return fetch('/api/library', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(library)
    }).then((x) => x.json());
  }
  list(): Promise<Array<Library>> {
    return fetch('/api/library').then((x) => x.json());
  }
  async update(library: Library): Promise<void> {
    const payload: Partial<Library> = {
      _id: library._id,
      name: library.name,
      visibility: library.visibility,
      items: library.items,
      isSeason: library.isSeason
    };
    await fetch('/api/library', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  }

  async addItem(libraryId: string, mediaId: string): Promise<void> {
    await fetch('/api/library/addMedia', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        libraryId,
        mediaId
      })
    });
  }

  async removeItem(libraryId: string, mediaId: string): Promise<void> {
    await fetch('/api/library/removeMedia', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        libraryId,
        mediaId
      })
    });
  }

  async delete(id: string) {
    await fetch(`/api/library/${id}`, {
      method: 'DELETE'
    });
  }
}

export default new LibraryRA();
