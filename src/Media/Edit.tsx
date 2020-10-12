import React, { useState, useEffect } from 'react';
import { MediaItem } from '../../server/models';
import MediaManager from '../managers/MediaManager';

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
  }

  return media === null ? null : (
    <div className="col md-12">
      <div className="mt-2 form">
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
          <div className="col-md-4" />
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
                <button className="btn btn-outline-info" type="button" onClick={() => handleGetSrt(media._id.toString(), srtTrack)}>Generate from:</button>
              </div>
              <input type="text" className="form-control" value={srtTrack} onChange={evt => setSrtTrack(evt.target.value)} />
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
                <button className="btn btn-outline-info" type="button" onClick={() => handleGenerateWebvtt(media._id.toString())}>Generate from SRT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
