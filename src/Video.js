import React from 'react';
import { Col } from 'reactstrap';

const Video = ({ library, video }) => {
  window.scrollTo({ top: 0 });
  return (
    <Col>
      {video && library ? (
        <video
          className="video-player"
          id="video-player"
          controls
          src={`/api/video/${library}/${video}`}
        />
      ) : (
        <div />
      )}
      {video && library ? <strong>{video}</strong> : <div />}
    </Col>
  );
};
export default Video;
