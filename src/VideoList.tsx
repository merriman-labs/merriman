import React from 'react';
import { Link } from 'react-router-dom';
import { Col, ListGroup } from 'reactstrap';
import { MediaItem } from '../server/models';
type VideoListProps = {
  media: Array<MediaItem>;
  library: string;
};

const VideoList = ({ media, library }: VideoListProps) => {
  return (
    <Col>
      <ListGroup>
        {media.map((mediaItem: MediaItem) => {
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

export default VideoList;
