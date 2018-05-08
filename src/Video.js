import React from 'react';
import { Row, Col } from 'reactstrap';

const Video = ({
  match: {
    params: { video }
  },
  library
}) => {
  window.scrollTo({ top: 0 });
  return (
    <Col>
      {video && library ? (
        <video
          className="video-player"
          id="video-player"
          controls
          src={`http://192.168.50.133/video/${library}/${video}`}
        />
      ) : (
        <div />
      )}
    </Col>
  );
};
export default Video;
