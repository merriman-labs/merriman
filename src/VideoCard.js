import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardFooter, Button, CardImg } from 'reactstrap';

const VideoCard = ({ name }) => (
  <Card>
    <CardImg src={`http://192.168.50.133/static/${name}.png`} />
    <CardFooter>
      <Link to={`/videos/${name}`}>
        <Button block color="primary">
          {name}
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default VideoCard;
