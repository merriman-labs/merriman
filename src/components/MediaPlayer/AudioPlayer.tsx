import React, { useLayoutEffect, useRef } from 'react';
import { MediaHandlerComponentProps } from './MediaHandlerComponentProps';

export const AudioPlayer = (props: MediaHandlerComponentProps) => {
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
      controls
      src={`/api/media/play/${props.media._id.toString()}`}
    />
  );
};
