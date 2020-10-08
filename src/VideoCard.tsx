import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardImgOverlay, CardText } from 'reactstrap';
import { MediaItem } from '../server/models';

type VideoCardProps = {
  media: MediaItem;
  library: string;
};
const VideoCard = ({
  media: { filename, name, _id },
  library
}: VideoCardProps) => {
  return (
    <Card>
      <Link to={`/videos/${library}/${_id}`}>
        <CardImg
          src={`/${filename}.png`}
        />
        <CardImgOverlay className="thumbnail-link">
          <CardText>{name}</CardText>
        </CardImgOverlay>
      </Link>
    </Card>
  );
};

export default VideoCard;
