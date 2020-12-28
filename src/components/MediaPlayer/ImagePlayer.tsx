import React from 'react';
import { MediaItem } from '../../../server/models';

export const ImagePlayer = (props: { media: MediaItem }) => {
  return (
    <img
      src={`/api/media/play/${props.media._id.toString()}`}
      alt={props.media.name + ' tagged with ' + props.media.tags.join(', ')}
    />
  );
};
