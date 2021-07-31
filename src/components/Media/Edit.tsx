import React, { useState, useEffect } from 'react';
import { MediaItem } from '../../../server/models';
import MediaManager from '../../managers/MediaManager';
import { FaTimesCircle } from 'react-icons/fa';
import { RouterProps } from 'react-router';
import { ItemVisibility } from '../../constant/ItemVisibility';
import { c } from '../../util/classList';
import { MediaType } from '../../constant/MediaType';
import { Link } from 'react-router-dom';

type MediaEditProps = RouterProps & {
  match: {
    params: {
      id: string;
    };
  };
};

export const MediaEdit = (props: MediaEditProps) => {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  const [srtTrack, setSrtTrack] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    MediaManager.details(props.match.params.id).then(setMedia);
  }, [props.match.params.id]);

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

  const handleGetSrt = async (id: string, track: string) => {
    if (media === null || track.length < 3) return;
    const { srt } = await MediaManager.generateSrt(id, track);

    setMedia({ ...media, srt });
  };

  const handleGenerateWebvtt = async (id: string) => {
    if (media === null) return;
    const { webvtt } = await MediaManager.generateWebVtt(id);

    setMedia({ ...media, webvtt });
  };

  const handleTagAdd = async (tag: string) => {
    if (media === null || tag === '') return;
    const tags = media.tags ? media.tags.concat(tag) : [tag];
    const item = { ...media, tags };
    setMedia(item);
    setCurrentTag('');
  };

  const handleTagRemove = async (tag: string) => {
    if (media === null) return;
    const tags = media.tags.filter((t) => t !== tag);
    const item = { ...media, tags };
    setMedia(item);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.persist();
    if (event.key === 'Enter') {
      handleTagAdd(currentTag);
    }
  };

  const handleSave = async () => {
    if (media === null) return;
    await MediaManager.update(media);
  };

  const handleCheckChange = (val: boolean) => {
    setMedia((item) => (item === null ? item : { ...item, isHidden: val }));
  };

  return media === null ? null : (
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
            <div className="form-group mt-2">
              <label htmlFor="tag">Tags</label>
              <div className="mb-2">
                {media.tags && media.tags.length ? (
                  <>
                    {media.tags.map((tag) => (
                      <span className="badge badge-pill badge-secondary mr-1">
                        {tag}{' '}
                        <FaTimesCircle onClick={() => handleTagRemove(tag)} />
                      </span>
                    ))}
                  </>
                ) : null}
              </div>
              <input
                id="tag"
                className="form-control"
                type="text"
                value={currentTag}
                placeholder="type here and press enter to add a tag"
                onChange={(x) => setCurrentTag(x.target.value)}
                onKeyDown={handleKeyPress}
              />
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
                Show
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
                value={media.meta || '(No metadata available)'}
              />
              <button
                className="btn btn-outline-info"
                onClick={() => handleGetMeta(media._id.toString())}
              >
                Generate metadata
              </button>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="name">Subtitles (SRT)</label>
              <textarea
                className="form-control"
                name="name"
                id="name"
                rows={10}
                value={media.srt || 'No subtitles available'}
                readOnly
              />
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <button
                    className="btn btn-outline-info"
                    type="button"
                    onClick={() => handleGetSrt(media._id.toString(), srtTrack)}
                  >
                    Generate from track:
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={srtTrack}
                  onChange={(evt) => setSrtTrack(evt.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="name">Subtitles (WebVTT)</label>
              <textarea
                className="form-control"
                name="name"
                id="name"
                rows={10}
                value={media.webvtt || 'No WebVTT subtitles available'}
                readOnly
              />

              <div className="input-group">
                <div className="input-group-prepend">
                  <button
                    className="btn btn-outline-info"
                    type="button"
                    onClick={() => handleGenerateWebvtt(media._id.toString())}
                  >
                    Generate from SRT
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <p>
              <strong>Burn new video</strong>
            </p>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <button
                  className="btn btn-outline-info"
                  type="button"
                  onClick={() => handleGetSrt(media._id.toString(), srtTrack)}
                >
                  Generate from tracks:
                </button>
              </div>
              <input
                type="text"
                className="form-control"
                value={srtTrack}
                placeholder="video track, e.g. 0:0"
                onChange={(evt) => setSrtTrack(evt.target.value)}
              />
              <input
                type="text"
                className="form-control"
                value={srtTrack}
                placeholder="audio track, e.g. 0:2"
                onChange={(evt) => setSrtTrack(evt.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
