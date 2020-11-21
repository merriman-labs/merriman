import React, { useLayoutEffect, useRef } from 'react';
import { MediaItem } from '../../../server/models';

export const AudioPlayer = (props: {
  media: MediaItem;
  onFinished: (media: MediaItem) => void;
}) => {
  const ref = useRef<HTMLAudioElement>(null);

  useLayoutEffect(() => {
    if (ref && ref.current) {
      ref.current.onended = () => {
        props.onFinished(props.media);
      };
    }
  });

  return (
    <audio
      ref={ref}
      autoPlay
      controls
      src={`/api/media/play/${props.media._id.toString()}`}
    />
  );
};
