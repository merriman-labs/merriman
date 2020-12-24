import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { MediaItem } from '../../../server/models';
import { MediaPlayer } from '../MediaPlayer/MediaPlayer';
import { useParams } from 'react-router';

type StandaloneMediaProps = {
  match: {
    params: {
      media: string;
    };
  };
};
type StandaloneMediaState = {
  details: MediaItem | null;
};

export const StandaloneMedia = () => {
  const params = useParams<{ media: string }>();
  window.scrollTo({ top: 0 });
  return (
    <Container>
      <Row>
        <Col>{params.media ? <MediaPlayer id={params.media} /> : null}</Col>
      </Row>
    </Container>
  );
};
