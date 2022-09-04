import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { MediaPlayer } from '../MediaPlayer/MediaPlayer';
import { useParams } from 'react-router';

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
