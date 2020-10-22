import { Library } from '../../server/models';

class LibraryRA {
  getById(id: string): Promise<Library> {
    return fetch(`/api/library/${id}`).then(x => x.json());
  }
  async create(library: { name: string }): Promise<Library> {
    return fetch('/api/library', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(library)
    }).then(x => x.json());
  }
  list(): Promise<Array<Library>> {
    return fetch('/api/library').then(x => x.json());
  }
  async update(library: Library): Promise<void> {
    await fetch('/api/library', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(library)
    });
  }

  async delete(id: string) {
    await fetch(`/api/library/${id}`, {
      method: 'DELETE'
    });
  }
}

export default new LibraryRA();
