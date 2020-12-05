import React from 'react';
import { MediaItem } from '../../../server/models';
import { MediaType } from '../../constant/MediaType';
import { AudioPlayer } from './AudioPlayer';
import { ImagePlayer } from './ImagePlayer';
import { VideoPlayer } from './VideoPlayer';

export const MediaSwitch = (props: { media: MediaItem, onFinished: (media: MediaItem) => void }) => {
  switch (props.media.type) {
    case MediaType.Audio:
      return <AudioPlayer media={props.media} onFinished={props.onFinished} />;
    case MediaType.Image:
      return <ImagePlayer media={props.media} />;
    case MediaType.Video:
      return <VideoPlayer media={props.media} />;
    default:
      return <h4>Player not found for media type {props.media.type}</h4>;
  }
};
