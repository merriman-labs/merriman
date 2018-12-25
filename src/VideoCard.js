import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardImgOverlay, CardText } from 'reactstrap';

const VideoCard = ({ media: { filename, name, _id }, library }) => {
  return (
    <Card>
      <Link to={`/videos/${library}/${_id}`}>
        <CardImg src={`/000000.png`} />
        <CardImgOverlay className="thumbnail-link">
          <CardText>{name}</CardText>
        </CardImgOverlay>
      </Link>
    </Card>
  );
};

export default VideoCard;
