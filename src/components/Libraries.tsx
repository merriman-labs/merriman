import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaUserCircle } from 'react-icons/fa';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Library } from '../../server/models';
import { useUserContext } from '../hooks/useUserContext';
import LibraryManager from '../managers/LibraryManager';
import { ItemVisibilityLabel } from './ItemVisibility';

export const Libraries = () => {
  const params = useLocation();
  const user = useUserContext();
  const [libraries, setLibraries] = useState<Array<Library>>([]);
  const [newLibraryName, setNewLibraryName] = useState('');
  const loadLibraries = () => LibraryManager.list().then(setLibraries);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      LibraryManager.create({ name: newLibraryName, isSeason: false }).then(
        () => {
          setNewLibraryName('');
          toast('Library created!');
          loadLibraries();
        }
      );
    }
  };

  useEffect(() => {
    loadLibraries();
  }, [params.search]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <div className="media mt-3">
            <div className="media-body">
              <div className="form-group">
                <label htmlFor="new-library-name">Create new library</label>
                <input
                  id="new-library-name"
                  type="text"
                  className="form-control"
                  value={newLibraryName}
                  onChange={(e) => setNewLibraryName(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
          </div>
          {libraries.map((result) => (
            <Link
              className="media mt-3"
              to={`/library/${result._id}`}
              key={result._id.toString()}
            >
              <div className="media-body">
                <h5 className="d-flex justify-content-between">
                  <span>{result.name}</span>
                  {user?._id.toString() === result.user.userId.toString() ? (
                    <Link to={`/library/edit/${result._id}`}>
                      <FaPencilAlt />
                    </Link>
                  ) : null}
                </h5>
                <p className="font-weight-normal">
                  {result.items.length} items •{' '}
                  {moment(result.createdAt).fromNow()}
                </p>
                <p className="font-weight-lighter">
                  <FaUserCircle /> {result.user.username}
                </p>
                <p>
                  <span className="badge bg-secondary">
                    <ItemVisibilityLabel
                      visibility={result.visibility}
                      includeIcon
                    />
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
