import React, { useEffect, useState } from 'react';
import { FaFolderMinus, FaFolderPlus } from 'react-icons/fa';
import { Library } from '../../server/models';
import LibraryManager from '../managers/LibraryManager';

type LibrarySelectorProps = {
  selectedLibraries: Array<Library>;
  setSelectedLibraries: (libraries: Array<Library>) => void;
};

export const LibrarySelector = (props: LibrarySelectorProps) => {
  const [selectedLibraries, setSelectedLibraries] = useState<Array<Library>>(
    props.selectedLibraries
  );
  const [libraries, setLibraries] = useState<Array<Library>>([]);
  const [libraryName, setLibraryName] = useState('');
  const fetchLibraries = async () => {
    const libraries = await LibraryManager.list();
    setLibraries(libraries);
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  const isSelected = (library: Library) =>
    selectedLibraries.some((lib) => lib._id === library._id);

  const handleLibraryClick = (library: Library) => {
    let libs: Array<Library>;
    if (isSelected(library)) {
      libs = selectedLibraries.filter((lib) => lib._id !== library._id);
    } else {
      libs = selectedLibraries.concat(library);
    }
    setSelectedLibraries(libs);
    props.setSelectedLibraries(libs);
  };
  const handleLibraryAdd = async (name: string) => {
    await LibraryManager.create({ name });
    fetchLibraries();
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.persist();
    if (event.key === 'Enter') {
      handleLibraryAdd(libraryName);
      setLibraryName('');
    }
  };

  return (
    <div className="list-group">
      {libraries.map((library) => (
        <div
          className={
            'list-group-item link' + (isSelected(library) ? ' active' : '')
          }
          onClick={() => handleLibraryClick(library)}
        >
          {isSelected(library) ? <FaFolderMinus /> : <FaFolderPlus />}{' '}
          {library.name}
        </div>
      ))}
      <div className="list-group-item">
        <div className="form-group mb-0">
          <label className="sr-only" htmlFor="create-library">
            Add new
          </label>
          <input
            type="text"
            placeholder="create a new library"
            className="form-control"
            id="create-library"
            value={libraryName}
            onChange={(e) => setLibraryName(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
      </div>
    </div>
  );
};
