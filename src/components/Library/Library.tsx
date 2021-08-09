import _ from 'lodash';
import * as R from 'ramda';
import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaLock,
  FaSort,
  FaUnlock
} from 'react-icons/fa';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Library as LibraryModel, MediaItem } from '../../../server/models';
import { useUserContext } from '../../hooks/useUserContext';
import LibraryManager from '../../managers/LibraryManager';
import MediaManager from '../../managers/MediaManager';
import { c } from '../../util/classList';
import { MediaPlayer } from '../MediaPlayer/MediaPlayer';
import { ItemVisibilityLabel } from '../ItemVisibility';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import { ObjectId } from 'mongodb';

const SortDropdown = (props: {
  mode: SortMode;
  setSortmode: Dispatch<SortMode>;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="d-inline">
      <DropdownToggle>
        Sorting <FaSort />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          active={props.mode === 'ORDERASC'}
          onClick={() => props.setSortmode('ORDERASC')}
        >
          Track # Ascending
        </DropdownItem>
        <DropdownItem
          active={props.mode === 'ORDERDESC'}
          onClick={() => props.setSortmode('ORDERDESC')}
        >
          Track # Descending
        </DropdownItem>
        <DropdownItem
          active={props.mode === 'ALPHAASC'}
          onClick={() => props.setSortmode('ALPHAASC')}
        >
          Name (A-Z)
        </DropdownItem>
        <DropdownItem
          active={props.mode === 'ALPHADESC'}
          onClick={() => props.setSortmode('ALPHADESC')}
        >
          Name (Z-A)
        </DropdownItem>
        <DropdownItem
          active={props.mode === 'CREATEDDESC'}
          onClick={() => props.setSortmode('CREATEDDESC')}
        >
          Date (Newest First)
        </DropdownItem>
        <DropdownItem
          active={props.mode === 'CREATEDASC'}
          onClick={() => props.setSortmode('CREATEDASC')}
        >
          Date (Oldest First)
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

type SortMode =
  | 'ORDERASC'
  | 'ORDERDESC'
  | 'ALPHAASC'
  | 'ALPHADESC'
  | 'CREATEDASC'
  | 'CREATEDDESC';

function getSortFunction(
  mode: SortMode,
  items: Array<MediaItem>
): Array<MediaItem> {
  switch (mode) {
    case 'ALPHAASC':
      return _.orderBy(items, ['name'], 'asc');
    case 'ALPHADESC':
      return _.orderBy(items, ['name'], 'desc');
    case 'CREATEDASC':
      return _.orderBy(items, ['_id'], 'asc');
    case 'CREATEDDESC':
      return _.orderBy(items, ['_id'], 'desc');
    case 'ORDERASC':
      return items;
    case 'ORDERDESC':
      return _.reverse([...items]);
  }
}

export const Library = () => {
  const params = useParams<{ library: string; media: string }>();
  const history = useHistory();
  const [library, setLibrary] = useState<LibraryModel | null>(null);
  const [media, setMedia] = useState<Array<MediaItem>>([]);
  const [sortedMedia, setSortedMedia] = useState<Array<MediaItem>>([]);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('ALPHAASC');
  const [isReordering, setIsReordering] = useState(false);
  const [didReorder, setDidReorder] = useState(false); // :(
  const user = useUserContext();

  const loadLibrary = useCallback(async () => {
    if (isReordering) return;
    const lib = await LibraryManager.getById(params.library);
    setLibrary(lib);
  }, [params.library, isReordering]);

  const loadMedia = useCallback(() => {
    if (!library || isReordering) return;

    MediaManager.getByLibrary(params.library)
      .then((items) => {
        return library.items.map(
          (libItem) =>
            items.find(
              (item) => item._id.toString() === libItem.toString()
            ) as MediaItem
        );
      })
      .then(setMedia);
  }, [library, params.library]);

  useEffect(() => {
    loadLibrary();
  }, [params.library, loadLibrary]);

  useEffect(() => {
    if (isReordering) return;
    loadMedia();
  }, [library, loadMedia]);

  useEffect(() => {
    if (isReordering) return;
    const items = getSortFunction(sortMode, media);
    setSortedMedia(items);
  }, [sortMode, media]);

  useEffect(() => {
    if (!params.media || media.length === 0) return setCurrentMedia(null);
    const item = media.find((item) => item._id.toString() === params.media);
    if (!item) return;
    setCurrentMedia(item);
  }, [params.media, media]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !library) {
      return;
    }
    setMedia(R.move(result.source.index, result.destination?.index));
    setDidReorder(true);
  };

  const setMediaLocation = (id: string) =>
    library &&
    history.push(`/library/${library._id.toString()}/${id.toString()}`);

  const getNext = () => {
    if (!currentMedia) {
      const first = _.first(sortedMedia);
      if (!first) return;
      return setMediaLocation(first._id.toString());
    }
    const currentLibraryItem = sortedMedia.indexOf(currentMedia);
    if (currentLibraryItem < 0 || currentLibraryItem >= sortedMedia.length)
      return;
    const nextMediaItem = sortedMedia[currentLibraryItem + 1];
    setMediaLocation(nextMediaItem._id.toString());
  };

  const getPrev = () => {
    if (!currentMedia || !sortedMedia.length) return;
    const currentLibraryItem = sortedMedia.indexOf(currentMedia);
    if (currentLibraryItem < 1) return;
    const nextLibraryItem = sortedMedia[currentLibraryItem - 1];
    setMediaLocation(nextLibraryItem._id.toString());
  };

  const handleReorderClick = () => {
    if (didReorder) {
      LibraryManager.update({
        ...library,
        items: media.map(R.prop('_id'))
      } as LibraryModel);
    }
    setIsReordering(R.not);
  };

  return library === null ? null : (
    <div className="container">
      {currentMedia ? null : (
        <div className="row my-3">
          <div className="col">
            <h2 className="h5">
              <span className="mr-2">{library.name}</span>
              <ItemVisibilityLabel
                visibility={library.visibility}
                includeIcon
              />
            </h2>
            <p>{library.user.username}</p>
            <p>{library.items.length} items</p>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col">
          {currentMedia ? (
            <MediaPlayer
              id={currentMedia._id.toString()}
              onFinished={() => getNext()}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="btn-group">
            <button
              className={c({
                'btn btn-outline-info': true,
                disabled: currentMedia === null || currentMedia === media[0]
              })}
              onClick={getPrev}
            >
              <FaArrowLeft />
            </button>
            <button className="btn btn-outline-info" onClick={getNext}>
              <FaArrowRight />
            </button>
          </div>
        </div>
        <div className="col">
          {user?._id === library.user.userId.toString() &&
            sortMode === 'ORDERASC' && (
              <button
                className="btn btn-outline-warn"
                onClick={handleReorderClick}
              >
                {isReordering ? <FaUnlock /> : <FaLock />}
              </button>
            )}
          <SortDropdown mode={sortMode} setSortmode={setSortMode} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="upload-queue"
              isDropDisabled={!isReordering}
            >
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <div className="list-group mt-3">
                    {(isReordering ? media : sortedMedia).map(
                      (mediaItem, index) => (
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
                      )
                    )}
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
