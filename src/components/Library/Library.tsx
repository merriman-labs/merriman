import _ from 'lodash';
import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaCog, FaSort } from 'react-icons/fa';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Library as LibraryModel, MediaItem } from '../../../server/models';
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
import { useUserContext } from '../../hooks/useUserContext';

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
  const user = useUserContext();

  const loadLibrary = useCallback(async () => {
    const lib = await LibraryManager.getById(params.library);
    setLibrary(lib);
  }, [params.library]);

  const loadMedia = useCallback(() => {
    if (!library) return;

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

  // Load initial library object when library state or param, or isReordering changes
  useEffect(() => {
    loadLibrary();
  }, [params.library, loadLibrary]);

  // Load full media items when library state
  useEffect(() => {
    loadMedia();
  }, [library, loadMedia]);

  useEffect(() => {
    const items = getSortFunction(sortMode, media);
    setSortedMedia(items);
  }, [sortMode, media]);

  useEffect(() => {
    if (!params.media || media.length === 0) return setCurrentMedia(null);
    const item = media.find((item) => item._id.toString() === params.media);
    if (!item) return;
    setCurrentMedia(item);
  }, [params.media, media]);

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
              {user?._id.toString() === library.user.userId.toString() && (
                <Link to={`/library/edit/${library._id}`} className="ml-1">
                  <FaCog />
                </Link>
              )}
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
          <SortDropdown mode={sortMode} setSortmode={setSortMode} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="list-group mt-3">
            {sortedMedia.map((mediaItem, index) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
