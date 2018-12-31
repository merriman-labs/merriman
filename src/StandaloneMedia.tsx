import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { MediaItem } from '../server/models';

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
    const details = await (await fetch(
      `/api/media/detail/${this.props.match.params.media}`
    )).json();
    this.setState({ details });
  }
  render() {
    const media = this.props.match.params.media;
    window.scrollTo({ top: 0 });
    return (
      <Container>
        <Row>
          <Col>
            {media ? (
              <video
                className="video-player"
                id="video-player"
                controls
                src={`/api/media/play/${media}`}
              />
            ) : (
              <div />
            )}
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
