import React from 'react';
import * as R from 'ramda';
import VideoCard from './VideoCard';
import { Col } from 'reactstrap';
import { MediaItem } from '../server/models';

type VideoListProps = { media: Array<MediaItem>; library: string };

const VideoList = ({ media, library }: VideoListProps) => {
  return R.splitEvery(4, media).map(group => {
    return group.map((media, i) => {
      return (
        <Col sm="6" lg="3" key={i} className="video-cell">
          <VideoCard media={media} key={media.filename} library={library} />
        </Col>
      );
    });
  });
};

export default VideoList;
