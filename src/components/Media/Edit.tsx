import React, { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '../../../server/models';
import MediaManager from '../../managers/MediaManager';
import { RouterProps } from 'react-router';
import { ItemVisibility } from '../../constant/ItemVisibility';
import { c } from '../../util/classList';
import { MediaType } from '../../constant/MediaType';
import { Link } from 'react-router-dom';
import { TagInput } from '../TagInput';

type MediaEditProps = RouterProps & {
  match: {
    params: {
      id: string;
    };
  };
};

function validateTimestamp(str: string) {
  return /^\d{2}:\d{2}:\d{2}$/.test(str);
}

export const MediaEdit = (props: MediaEditProps) => {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [thumbnailTimestamp, setThumbnailTimestamp] = useState('00:00:10');

  const getMediaDetails = useCallback(
    () => MediaManager.details(props.match.params.id).then(setMedia),
    [props.match.params.id]
  );

  useEffect(() => {
    getMediaDetails();
  }, [getMediaDetails]);

  const handleDelete = async (hard: boolean) => {
    if (media === null) return;
    const { result } = await MediaManager.deleteById(
      media._id.toString(),
      hard
    );
    if (result) props.history.goBack();
  };

  const handleGetMeta = async (id: string) => {
    if (media === null) return;
    const { meta } = await MediaManager.requestMeta(id);

    setMedia({ ...media, meta });
  };

  const handleTagAdd = async (tags: Array<string>) => {
    if (!media) return;
    const item = { ...media, tags };
    setMedia(item);
  };

  const handleSave = async () => {
    if (media === null) return;
    await MediaManager.update(media);
  };

  const handleCheckChange = (val: boolean) => {
    setMedia((item) => (item === null ? item : { ...item, isHidden: val }));
  };

  const handleUpdateThumbnail = async () => {
    if (!validateTimestamp(thumbnailTimestamp) || !media?._id) {
      return;
    }

    await MediaManager.updateThumbnail(
      media._id.toString(),
      thumbnailTimestamp
    );
    await getMediaDetails();
  };

  return (
    media && (
      <div className="col md-12">
        <div className="mt-2 mb-5 form">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  id="name"
                  value={media.name}
                  onChange={({ target: { value } }) =>
                    setMedia({ ...media, name: value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="library-visibility">Visibility</label>
                <select
                  id="library-visibility"
                  className="form-control"
                  value={media.visibility}
                  onChange={(e) =>
                    setMedia({ ...media, visibility: +e.target.value })
                  }
                >
                  <option value={ItemVisibility.private}>Private</option>
                  <option value={ItemVisibility.public}>Public</option>
                  <option value={ItemVisibility.unlisted}>Unlisted</option>
                </select>
              </div>
              <label htmlFor="tag">Tags</label>
              <div className="input-group mt-2">
                <TagInput tags={media.tags} updateTags={handleTagAdd} />
              </div>
              <div className="my-2">
                <img
                  className="card-image-top mb-2 d-block"
                  src={`/${media.filename}.png`}
                  alt={`Thumbnail for ${media.name}`}
                />
                <label htmlFor="new-thumbnail-timestamp">
                  Update thumbnail from timestamp
                </label>
                <div className="input-group">
                  <input
                    name="new-thumbnail-timestamp"
                    type="text"
                    className="form-control"
                    placeholder="00:00:10"
                    value={thumbnailTimestamp}
                    onChange={(e) => setThumbnailTimestamp(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleUpdateThumbnail}
                  >
                    Request
                  </button>
                </div>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  name="name"
                  id="name"
                  type="checkbox"
                  checked={!media.isHidden}
                  onChange={(evt) => handleCheckChange(!evt.target.checked)}
                />
                <label htmlFor="name" className="form-check-label">
                  Show media on server
                </label>
              </div>
              {isDeleting ? (
                <>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(true)}
                  >
                    Hard Delete
                  </button>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => handleDelete(false)}
                  >
                    Soft Delete
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setIsDeleting(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-outline-success mr-1"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => setIsDeleting(true)}
                  >
                    Delete
                  </button>
                  <Link
                    to={`/media/${media._id}`}
                    className="btn btn-outline-info"
                  >
                    View Media
                  </Link>
                </>
              )}
            </div>
          </div>
          <hr />
          <div
            className={c({
              'row mt-3': true,
              invisible: media.type !== MediaType.Video
            })}
          >
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="meta">Metadata</label>
                <textarea
                  className="form-control"
                  name="meta"
                  id="meta"
                  readOnly
                  rows={10}
                  value={
                    media.meta ||
                    (media.formatData &&
                      JSON.stringify(media.formatData, undefined, 3)) ||
                    '(No metadata available)'
                  }
                />
                <button
                  className="btn btn-outline-info"
                  onClick={() => handleGetMeta(media._id.toString())}
                >
                  Generate metadata
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
