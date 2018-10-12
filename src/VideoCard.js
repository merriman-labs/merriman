import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardImgOverlay, CardText } from 'reactstrap';

const VideoCard = ({ library, name }) => (
  <Card>
    <Link to={`/videos/${library}/${name}`}>
      <CardImg src={`/${name}.png`} />
      <CardImgOverlay className="thumbnail-link">
        <CardText>{name}</CardText>
      </CardImgOverlay>
    </Link>
  </Card>
);

export default VideoCard;
