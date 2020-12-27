import { ObjectId } from 'mongodb';
import _ from 'lodash';
import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaSort
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

const SortDropdown = (props: {
  mode: SortMode;
  setSortmode: Dispatch<SortMode>;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle>
        Sorting <FaSort />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => props.setSortmode('ORDERASC')}>
          Track # Ascending
        </DropdownItem>
        <DropdownItem onClick={() => props.setSortmode('ORDERDESC')}>
          Track # Descending
        </DropdownItem>
        <DropdownItem onClick={() => props.setSortmode('ALPHAASC')}>
          Name (A-Z)
        </DropdownItem>
        <DropdownItem onClick={() => props.setSortmode('ALPHADESC')}>
          Name (Z-A)
        </DropdownItem>
        <DropdownItem onClick={() => props.setSortmode('CREATEDASC')}>
          Date (Newest First)
        </DropdownItem>
        <DropdownItem onClick={() => props.setSortmode('CREATEDDESC')}>
          Date (Oldest First)
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

type OrderedMediaItem = { order: number } & MediaItem;

type SortMode =
  | 'ORDERASC'
  | 'ORDERDESC'
  | 'ALPHAASC'
  | 'ALPHADESC'
  | 'CREATEDASC'
  | 'CREATEDDESC';
type Ordering = { id: string | ObjectId; order: number };

function mergeOrderings(orderings: Array<Ordering>) {
  return function (items: Array<MediaItem>): Array<OrderedMediaItem> {
    return items.map((item) => ({
      ...item,
      order: orderings.find((ord) => ord.id.toString() === item._id.toString())
        ?.order as number // since the orderings is the source of the media items, we can assume we will always find one
    }));
  };
}

function getSortFunction(mode: SortMode) {
  return function sortItems(
    items: Array<OrderedMediaItem>
  ): Array<OrderedMediaItem> {
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
        return _.orderBy(items, ['order'], 'asc');
      case 'ORDERDESC':
        return _.orderBy(items, ['order'], 'desc');
    }
  };
}

export const Library = () => {
  const params = useParams<{ library: string; media: string }>();
  const history = useHistory();
  const [library, setLibrary] = useState<LibraryModel | null>(null);
  const [media, setMedia] = useState<Array<OrderedMediaItem>>([]);
  const [sortedMedia, setSortedMedia] = useState<Array<OrderedMediaItem>>([]);
  const [currentMedia, setCurrentMedia] = useState<OrderedMediaItem | null>(
    null
  );
  const [sortMode, setSortMode] = useState<SortMode>('ORDERASC');
  const user = useUserContext();

  const loadLibrary = useCallback(async () => {
    const lib = await LibraryManager.getById(params.library);
    setLibrary(lib);
  }, [params.library]);

  const loadMedia = useCallback(() => {
    if (!library) return;

    MediaManager.getByLibrary(params.library)
      .then(mergeOrderings(library.items))
      .then(setMedia);
  }, [library, params.library]);

  useEffect(() => {
    loadLibrary();
  }, [params.library, loadLibrary]);

  useEffect(() => {
    loadMedia();
  }, [library, loadMedia]);

  useEffect(() => {
    setSortedMedia(getSortFunction(sortMode)(media));
  }, [media, sortMode])

  useEffect(() => {
    if (!params.media || media.length === 0) return setCurrentMedia(null);
    const item = media.find(item => item._id.toString() === params.media);
    if(!item || item === currentMedia) return;
    setCurrentMedia(item);
  }, [params.media, media]);

  const handleReorder = async (direction: 'up' | 'down', mediaId: string) => {
    if (library === null) return;
    await LibraryManager.setMediaOrder({
      libraryId: library._id.toString(),
      direction,
      mediaId
    });
    await loadLibrary();
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
    if (currentLibraryItem < 0 || currentLibraryItem >= sortedMedia.length) return;
    const nextMediaItem = sortedMedia[currentLibraryItem + 1];
    console.log(nextMediaItem);
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
      <div className="row my-3">
        <div className="col">
          <h2 className="h5">
            <span className="mr-2">{library.name}</span>
            <ItemVisibilityLabel visibility={library.visibility} includeIcon />
          </h2>
          <p>{library.user.username}</p>
          <p>{library.items.length} items</p>
        </div>
      </div>
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
            {sortedMedia.map((mediaItem: MediaItem) => {
              return (
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
                  {library.user.userId.toString() !== user?._id ? null : (
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorder('down', mediaItem._id.toString());
                        }}
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        className="btn btn-outline-success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorder('up', mediaItem._id.toString());
                        }}
                      >
                        <FaArrowDown />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
