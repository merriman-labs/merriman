import React, { Component } from 'react';
import { Col } from 'reactstrap';

export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = { details: null };
  }
  async componentDidMount() {
    const details = await (await fetch(
      `/api/media/detail/${this.props.video}`
    )).json();
    this.setState({ details });
  }
  render() {
    const { library, video } = this.props;
    window.scrollTo({ top: 0 });
    return (
      <Col>
        {video && library ? (
          <video
            className="video-player"
            id="video-player"
            controls
            src={`/api/media/play/${library}/${video}`}
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
