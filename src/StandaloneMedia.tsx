import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { MediaItem } from '../server/models';
import MediaManager from './managers/MediaManager';
import { Video } from './Video';

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

export default class StandaloneMedia extends Component<
  StandaloneMediaProps,
  StandaloneMediaState
> {
  constructor(props: StandaloneMediaProps) {
    super(props);
    this.state = { details: null };
  }
  async componentDidMount() {
    const details = await MediaManager.details(this.props.match.params.media);
    this.setState({ details });
  }
  render() {
    const media = this.props.match.params.media;
    window.scrollTo({ top: 0 });
    return (
      <Container>
        <Row>
          <Col>
            {media ? <Video video={media} /> : <div />}
            {this.state.details ? (
              <strong>{this.state.details.name}</strong>
            ) : (
              <div />
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
