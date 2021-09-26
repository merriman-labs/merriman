import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardImgOverlay, CardText, Col } from 'reactstrap';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import { MediaItem } from '../../../server/models';
import MediaManager from '../../managers/MediaManager';

type RandomMediaProps = {
  match: {
    params: {
      tag: string;
    };
  };
};

export const Random = (props: RandomMediaProps) => {
  const [media, setMedia] = useState<Array<MediaItem>>([]);
  useEffect(() => {
    const effect = async () => {
      const media = await MediaManager.random(24);
      setMedia(media);
    };

    effect();
  }, [props.match.params.tag]);
  return (
    <Container fluid>
      <Row>
        {R.splitEvery(4, media).map((group) =>
          group.map((item, i) => {
            return (
              <Col sm="6" lg="3" xl="2" key={i} className="video-cell">
                <Card>
                  <Link to={`/media/${item._id.toString()}`}>
                    <CardImg src={`/${item.filename}.png` as string} />
                    <CardImgOverlay className="thumbnail-link">
                      <CardText>{item.name}</CardText>
                    </CardImgOverlay>
                  </Link>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
};
