import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';

import { Library } from '../../../server/models';
import LibraryManager from '../../managers/LibraryManager';
import { ItemVisibility } from '../../constant/ItemVisibility';
import { FaCheck, FaTimes, FaTrashAlt } from 'react-icons/fa';

export const EditLibrary = () => {
  const params = useParams<{ library: string }>();
  const history = useHistory();

  const [library, setLibrary] = useState<Library | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    LibraryManager.getById(params.library).then(setLibrary);
  }, [params.library]);

  const setVisibility = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!library) return;
    const visibility = +event.target.value as ItemVisibility;
    setLibrary({ ...library, visibility });
  };

  const updateLibrary = () => {
    if (library)
      LibraryManager.update(library).then(() => {
        toast('Library updated!');
      });
  };
  const deleteLibrary = () => {
    if (library)
      LibraryManager.delete(library._id.toString()).then(() => {
        history.push('/libraries');
      });
  };

  return library === null ? null : (
    <div className="container mt-2">
      <div className="row">
        <div className="col-md-4">
          <div className="h4">Edit Library</div>
          <div className="form-group">
            <label htmlFor="library-name" className="form-label">
              Name
            </label>
            <input
              type="email"
              className="form-control"
              id="library-name"
              aria-describedby="emailHelp"
              value={library.name}
              onChange={(e) => setLibrary({ ...library, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="library-visibility">Visibility</label>
            <select
              id="library-visibility"
              className="form-control"
              value={library.visibility}
              onChange={setVisibility}
            >
              <option value={ItemVisibility.private}>Private</option>
              <option value={ItemVisibility.public}>Public</option>
              <option value={ItemVisibility.unlisted}>Unlisted</option>
            </select>
          </div>
          <button className="btn btn-outline-success" onClick={updateLibrary}>
            Submit
          </button>
          {isDeleting ? (
            <>
              <button
                className="btn btn-outline-danger ml-2"
                onClick={deleteLibrary}
              >
                <FaCheck /> Yup
              </button>
              <button
                className="btn btn-outline-warning ml-2"
                onClick={() => setIsDeleting(false)}
              >
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-outline-danger ml-2"
              onClick={() => setIsDeleting(true)}
            >
              <FaTrashAlt /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
