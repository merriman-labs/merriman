import React, { useState, useEffect } from 'react';
import { MediaItem } from '../../server/models';
import MediaManager from '../managers/MediaManager';
import { FaTimesCircle } from 'react-icons/fa';

type MediaEditProps = {
  match: {
    params: {
      id: string;
    };
  };
};
const mediaManager = new MediaManager();

export const MediaEdit = (props: MediaEditProps) => {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  const [srtTrack, setSrtTrack] = useState('');
  useEffect(
    () => {
      const effect = async () => {
        const media = await mediaManager.details(props.match.params.id);
        setMedia(media);
      };
      effect();
    },
    [props.match.params.id]
  );

  const handleGetMeta = async (id: string) => {
    if (media === null) return;
    const { meta } = await mediaManager.requestMeta(id);

    setMedia({ ...media, meta });
  };

  const handleGetSrt = async (id: string, track: string) => {
    if (media === null || track.length < 3) return;
    const { srt } = await mediaManager.generateSrt(id, track);

    setMedia({ ...media, srt });
  };

  const handleGenerateWebvtt = async (id: string) => {
    if (media === null) return;
    const { webvtt } = await mediaManager.generateWebVtt(id);

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
    const tags = media.tags.filter(t => t !== tag);
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
    await mediaManager.update(media);
  };

  return media === null ? null : (
    <div className="col md-12">
      <div className="mt-2 mb-5 form">
        <div className="row">
          <div className="col-md-4">
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
          </div>
          <div className="col-md-8">
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
        </div>
        <div className="row">
          <div className="col-md-4">
            <p>
              <strong>Tags</strong>
            </p>
            {media.tags && media.tags.length ? (
              <>
                {media.tags.map(tag => (
                  <span className="badge badge-pill badge-secondary mr-1">
                    {tag} <FaTimesCircle onClick={() => handleTagRemove(tag)} />
                  </span>
                ))}
              </>
            ) : null}
            <div className="input-group mt-2">
              <input
                className="form-control"
                type="text"
                value={currentTag}
                placeholder="type here and press enter to add a tag"
                onChange={x => setCurrentTag(x.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>
          <div className="col-md-8">
            <div className="form-group">
              <label htmlFor="name">Subtitles (SRT)</label>
              <textarea
                className="form-control"
                name="name"
                id="name"
                rows={10}
                value={media.srt || 'No subtitles available'}
              />
            </div>
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
                onChange={evt => setSrtTrack(evt.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4" />
          <div className="col-md-8">
            <div className="form-group">
              <label htmlFor="name">Subtitles (WebVTT)</label>
              <textarea
                className="form-control"
                name="name"
                id="name"
                rows={10}
                value={media.webvtt || 'No WebVTT subtitles available'}
              />
            </div>
            <div className="input-group mb-3">
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
        <div className="row">
          <div className="col-md">
            <button className="btn btn-outline-success" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
