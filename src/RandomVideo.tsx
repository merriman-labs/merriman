import React, { Component } from 'react';
import { Col } from 'reactstrap';
import { MediaItem } from '../server/models';

type VideoState = {
  current: MediaItem | null;
  history: Array<MediaItem>;
};

export default class RandomVideo extends Component<{}, VideoState> {
  constructor(props: {}) {
    super(props);
    this.state = { current: null, history: [] };
  }
  async componentDidMount() {
    this.fetchNext();
  }
  render() {
    window.scrollTo({ top: 0 });
    return (
      <Col>
        {this.state.current ? (
          <video
            className="video-player"
            id="video-player"
            controls
            src={`/api/media/play/${this.state.current._id}`}
          />
        ) : (
          <div />
        )}
        {this.state.current ? (
          <div>
            <strong>{this.state.current.name}</strong>
            <br />
            <span>{this.state.current.views} views</span>
            <br />
            <div className="btn-group">
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={this._currentQueuePosition === 0}
                onClick={this.fetchPrevious}
              >
                &larr;
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={this.fetchNext}
              >
                &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div />
        )}
      </Col>
    );
  }

  fetchNext = async () => {
    const position = this._currentQueuePosition;
    if (position === this.state.history.length - 1) {
      const details = await (await fetch(`/api/media/random`)).json();
      this.setState(s => ({
        current: details,
        history: s.history.concat(details)
      }));
    } else {
      this.setState({ current: this.state.history[position + 1] });
    }
  };

  fetchPrevious = async () => {
    if (this.state.current && this.state.history.length > 1) {
      const current = this._currentQueuePosition;
      const prev = this.state.history[current - 1];
      const details = await (await fetch(
        `/api/media/detail/${prev._id}`
      )).json();
      this.setState({ current: details });
    }
  };

  private get _currentQueuePosition() {
    return this.state.history.findIndex(
      item => item._id === this.state.current!._id
    );
  }
}
