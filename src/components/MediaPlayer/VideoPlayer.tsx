import React from 'react';
import { MediaItem } from '../../../server/models';

export const VideoPlayer = (props: { media: MediaItem }) => {
  return props.media ? (
    <video
      className="video-player"
      id="video-player"
      controls
      src={`/api/media/play/${props.media._id.toString()}`}
    >
      {props.media && props.media.webvtt ? (
        <track
          label="English"
          kind="subtitles"
          srcLang="en"
          src={`/api/media/captions/${props.media._id.toString()}`}
          default
        />
      ) : null}
    </video>
  ) : null;
};
