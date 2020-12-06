import React from 'react';
import { MediaType } from '../../constant/MediaType';
import { AudioPlayer } from './AudioPlayer';
import { ImagePlayer } from './ImagePlayer';
import { MediaHandlerComponentProps } from './MediaHandlerComponentProps';
import { UnhandledTypePlayer } from './UnhandledTypePlayer';
import { VideoPlayer } from './VideoPlayer';

export const MediaSwitch = (props: MediaHandlerComponentProps) => {
  switch (props.media.type) {
    case MediaType.Audio:
      return <AudioPlayer media={props.media} onFinished={props.onFinished} />;
    case MediaType.Image:
      return <ImagePlayer media={props.media} />;
    case MediaType.Video:
      return <VideoPlayer media={props.media} onFinished={props.onFinished} />;
    default:
      return <UnhandledTypePlayer media={props.media} />;
  }
};
