import { ObjectId } from 'mongodb';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp
} from 'react-icons/fa';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Library as LibraryModel, MediaItem } from '../../../server/models';
import { useUserContext } from '../../hooks/useUserContext';
import LibraryManager from '../../managers/LibraryManager';
import MediaManager from '../../managers/MediaManager';
import { c } from '../../util/classList';
import { MediaPlayer } from '../MediaPlayer/MediaPlayer';

export const Library = () => {
  const params = useParams<{ library: string; media: string }>();
  const [library, setLibrary] = useState<LibraryModel | null>(null);
  const [media, setMedia] = useState<Array<MediaItem>>([]);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const user = useUserContext();

  const sortByOrdering = (
    ordering: Array<{ id: string | ObjectId; order: number }>
  ) => (items: Array<MediaItem>) => {
    const ordered = R.sortBy(R.prop('order'), ordering);
    const orderedItems = ordered
      .map(({ id }) =>
        items.find((item) => item._id.toString() === id.toString())
      )
      .filter(Boolean) as Array<MediaItem>;
    return orderedItems;
  };

  const loadLibrary = async () => {
    const lib = await LibraryManager.getById(params.library);
    setLibrary(lib);
    MediaManager.getByLibrary(params.library)
      .then(sortByOrdering(lib.items))
      .then(setMedia);
  };

  useEffect(() => {
    loadLibrary();
  }, [params.library]);

  useEffect(() => {
    if (!params.media) return;
    MediaManager.details(params.media).then(setCurrentMedia);
  }, [params.media]);
  const handleReorder = async (direction: 'up' | 'down', mediaId: string) => {
    if (library === null) return;
    await LibraryManager.setMediaOrder({
      libraryId: library._id.toString(),
      direction,
      mediaId
    });
    loadLibrary();
  };

  // these two should just be a ll or queue
  const getNext = () => {
    if (!currentMedia) {
      const first = library?.items.reduce((memo, item) =>
        memo.order < item.order ? memo : item
      );
      if (!first) return;
      const firstItem = media.find(
        (item) => item._id.toString() === first.id.toString()
      );
      if (!firstItem) return;
      return setCurrentMedia(firstItem);
    }
    if (!library?.items) return;
    const currentLibraryItem = library?.items.find(
      (item) => item.id.toString() === currentMedia._id.toString()
    );
    if (!currentLibraryItem) return;
    const nextLibraryItem = library?.items.find(
      (item) => item.order === currentLibraryItem?.order + 1
    );
    if (!nextLibraryItem) return;
    const nextMediaItem = media.find(
      (item) => item._id.toString() === nextLibraryItem.id.toString()
    );
    if (!nextMediaItem) return;
    setCurrentMedia(nextMediaItem);
  };

  const getPrev = () => {
    if (!currentMedia || !library?.items) return;
    const currentLibraryItem = library?.items.find(
      (item) => item.id.toString() === currentMedia._id.toString()
    );
    if (!currentLibraryItem) return;
    const nextLibraryItem = library?.items.find(
      (item) => item.order === currentLibraryItem?.order - 1
    );
    if (!nextLibraryItem) return;
    const nextMediaItem = media.find(
      (item) => item._id.toString() === nextLibraryItem.id.toString()
    );
    if (!nextMediaItem) return;
    setCurrentMedia(nextMediaItem);
  };

  return library === null ? null : (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>{library ? library.name : 'No Library Selected'}</h2>
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
      </div>
      <div className="row">
        <div className="col">
          <div className="list-group mt-3">
            {media.map((mediaItem: MediaItem) => {
              return (
                <div className="list-group-item d-flex justify-content-between">
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
