import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { MediaItem, Library } from '../server/models';
import MediaListing from './MediaListing';
import { sortBy } from 'ramda';
import LibraryManager from './managers/LibraryManager';
import MediaManager from './managers/MediaManager';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { RouterProps } from 'react-router';
import { MediaPlayer } from './components/MediaPlayer/MediaPlayer';

type VideoLibrariesPageProps = {
  match: {
    params: {
      library: string;
      video: string;
    };
  };
} & RouterProps;

type VideoLibrariesPageState = {
  media: Array<MediaItem>;
  libraries: Array<Library>;
  dropdown: boolean;
  library: string | null;
  libraryDetails: Library | null;
};

class VideoLibrariesPage extends Component<
  VideoLibrariesPageProps,
  VideoLibrariesPageState
> {
  constructor(props: VideoLibrariesPageProps) {
    super(props);
    this.state = {
      media: [],
      libraries: [],
      dropdown: false,
      library: null,
      libraryDetails: null
    };
    this._toggleLibraryPicker = this._toggleLibraryPicker.bind(this);
    this._fetchVideoList = this._fetchVideoList.bind(this);
    this._fetchLibraries = this._fetchLibraries.bind(this);
  }

  componentDidMount() {
    this._fetchLibraries();

    const id = this.props.match.params.library;

    if (id && id !== '0') {
      this._fetchVideoList(id);
      this._getLibraryDetails(id);
    }
  }

  getCurrent = () => {
    const id = this.props.match.params.video;

    const currentIndex = this.state.media.findIndex(
      (item) => item._id.toString() === id
    );
    return currentIndex;
  };

  getNext = () => {
    const current = this.getCurrent();
    if (current === -1 || this.state.media.length - 1 === current) return;
    this.props.history.push(
      `/videos/${this.props.match.params.library}/${this.state.media[
        current + 1
      ]._id.toString()}`
    );
  };

  getPrev = () => {
    const current = this.getCurrent();
    if (current < 1) return;
    this.props.history.push(
      `/videos/${this.props.match.params.library}/${this.state.media[
        current - 1
      ]._id.toString()}`
    );
  };

  render() {
    const {
      match: {
        params: { video, library }
      }
    } = this.props;
    return (
      <Container>
        <Row>
          <Col>
            <h2>
              {this.state.libraryDetails
                ? this.state.libraryDetails.name
                : 'No Library Selected'}
            </h2>
          </Col>
        </Row>
        <Row>
          <Col>{video ? <MediaPlayer id={video} onFinished={() => this.getNext()} /> : <div />}</Col>
        </Row>
        <Row>
          <Col>
            <div className="btn-group">
              <button className="btn btn-outline-info" onClick={this.getPrev}>
                <FaArrowLeft />
              </button>
              <button className="btn btn-outline-info" onClick={this.getNext}>
                <FaArrowRight />
              </button>
            </div>
          </Col>
        </Row>
        <Row>
          {this.state.media && this.state.media.length ? (
            <MediaListing library={library} media={this.state.media} />
          ) : null}
        </Row>
      </Container>
    );
  }
  _getLibraryDetails(id: string) {
    LibraryManager.getById(id).then((libraryDetails) =>
      this.setState({ libraryDetails })
    );
  }
  _fetchVideoList(id: string) {
    if (id) {
      return MediaManager.getByLibrary(id).then((items) => {
        const media = sortBy((x) => x.name, items);
        this.setState({ media });
      });
    }
  }
  _fetchLibraries() {
    return fetch('/api/library')
      .then((response) => response.json())
      .then((libraries) => this.setState({ libraries }));
  }
  _toggleLibraryPicker() {
    this.setState({ dropdown: !this.state.dropdown });
  }
}

export default VideoLibrariesPage;
