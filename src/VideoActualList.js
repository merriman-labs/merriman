import React from 'react';
import { Link } from 'react-router-dom';
import { Col, ListGroup } from 'reactstrap';
const VideoActualList = ({ media, library }) => {
  return (
    <Col>
      <ListGroup>
        {media.map(mediaItem => {
          return (
            <Link
              className="list-group-item"
              to={`/videos/${library}/${mediaItem._id}`}
              key={mediaItem._id}
            >
              {mediaItem.name}
            </Link>
          );
        })}
      </ListGroup>
    </Col>
  );
};

export default VideoActualList;
