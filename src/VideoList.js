import React from 'react';
import * as R from 'ramda';
import VideoCard from './VideoCard';
import { Row, Col } from 'reactstrap';
const VideoList = ({ videos }) => {
  return R.splitEvery(4, videos).map(group => {
    return group.map((video, i) => {
      return (
        <Col sm="6" lg="3" key={i}>
          <VideoCard name={video} key={video} />
        </Col>
      );
    });
  });
};

export default VideoList;
