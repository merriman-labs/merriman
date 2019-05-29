import React, { Component } from 'react';
import { Col } from 'reactstrap';
import { MediaItem } from '../server/models';

type VideoState = {
  details: MediaItem | null;
};

export default class RandomVideo extends Component<{}, VideoState> {
  constructor(props: {}) {
    super(props);
    this.state = { details: null };
  }
  async componentDidMount() {
    const details = await (await fetch(
      `/api/media/random`
    )).json();
    this.setState({ details });
  }
  render() {
    window.scrollTo({ top: 0 });
    return (
      <Col>
        {this.state.details ? (
          <video
            className="video-player"
            id="video-player"
            controls
            src={`/api/media/play/${this.state.details._id}`}
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
    );
  }
}
