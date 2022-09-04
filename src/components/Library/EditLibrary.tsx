import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Library, MediaItem } from '../../../server/models';
import LibraryManager from '../../managers/LibraryManager';
import { ItemVisibility } from '../../constant/ItemVisibility';
import { FaCheck, FaLock, FaTimes, FaTrashAlt, FaUnlock } from 'react-icons/fa';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import MediaManager from '../../managers/MediaManager';
import { c } from '../../util/classList';

export const EditLibrary = () => {
  const params = useParams<{ library: string }>();
  const history = useHistory();

  const [library, setLibrary] = useState<Library | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [media, setMedia] = useState<Array<MediaItem>>([]);
  const [didReorder, setDidReorder] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    LibraryManager.getById(params.library).then(setLibrary);
    MediaManager.getByLibrary(params.library).then(setMedia);
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
  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !library) {
      return;
    }
    setMedia(R.move(result.source.index, result.destination?.index));
    setDidReorder(true);
  };
  const handleReorderClick = async () => {
    if (didReorder) {
      await LibraryManager.update({
        ...library,
        items: media.map(R.prop('_id'))
      } as Library);
      toast('Items successfully reordered.');
    }
    setIsReordering(R.not);
  };

  return library === null ? null : (
    <div className="container mt-2">
      <div className="row">
        <div className="col-md-4">
          <h3 className="h4">Edit Library</h3>
          <Link to={`/library/${library._id}`}>Go to library &rarr;</Link>
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
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              name="name"
              id="name"
              type="checkbox"
              checked={library.isSeason}
              onChange={(evt) =>
                setLibrary(
                  (library) =>
                    ({ ...library, isSeason: evt.target.checked } as Library)
                )
              }
            />
            <label htmlFor="name" className="form-check-label">
              Is season/series?
            </label>
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
      <div className="row">
        <div className="col mt-3 mb-5">
          <h3 className="h5">
            Reorder items{' '}
            <button
              className={c({
                'btn btn-sm': true,
                'btn-outline-warning': isReordering,
                'btn-outline-success': !isReordering
              })}
              onClick={handleReorderClick}
            >
              {isReordering ? <FaUnlock /> : <FaLock />}
            </button>
          </h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="upload-queue"
              isDropDisabled={!isReordering}
            >
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <div className="list-group mt-3">
                    {media.map((mediaItem, index) => (
                      <Draggable
                        key={mediaItem._id.toString()}
                        draggableId={mediaItem._id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div
                              className="list-group-item d-flex justify-content-between"
                              key={mediaItem._id.toString()}
                            >
                              <Link
                                to={`/library/${library._id.toString()}/${mediaItem._id.toString()}`}
                                key={mediaItem._id.toString()}
                              >
                                {mediaItem.name}{' '}
                              </Link>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};
