import React from 'react';
import { MediaItem } from '../../../server/models';

export const UnhandledTypePlayer = (props: {
  media: MediaItem;
  url: string;
}) => {
  return (
    <div>
      <p>
        No player for the media type <strong>{props.media.type}</strong> just
        yet. In the meantime, the file can be downloaded using the button below
      </p>
      <a className="btn btn-outline-info" download href={props.url}>
        Download {props.media.name}
      </a>
    </div>
  );
};
