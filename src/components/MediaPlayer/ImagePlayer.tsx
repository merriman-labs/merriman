import React from 'react';
import { MediaItem } from '../../../server/models';

export const ImagePlayer = (props: { media: MediaItem; url: string }) => {
  return (
    <img
      src={props.url}
      alt={props.media.name + ' tagged with ' + props.media.tags.join(', ')}
    />
  );
};
