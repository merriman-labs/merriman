import React from 'react';
import { MediaItem } from '../../../server/models';

export const UnhandledTypePlayer = (props: { media: MediaItem }) => {
  return (
    <div>
      <p>
        No player for the media type <strong>{props.media.type}</strong> just
        yet. In the meantime, the file can be downloaded using the button below
      </p>
      <a
        className="btn btn-outline-info"
        download
        href={`/api/media/download/${props.media._id.toString()}`}
      >
        Download {props.media.name}
      </a>
    </div>
  );
};
