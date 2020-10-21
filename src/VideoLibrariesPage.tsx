import React, { Component } from 'react';
import { Video } from './Video';
import { Container, Row, Col } from 'reactstrap';
import { MediaItem, Library } from '../server/models';
import MediaListing from './MediaListing';
import { sortBy } from 'ramda';
import LibraryManager from './managers/LibraryManager';

type VideoLibrariesPageProps = {
  match: {
    params: {
      library: string;
      video: string;
    };
  };
};

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
          <Col>{video ? <Video video={video} /> : <div />}</Col>
        </Row>
        <Row>
          {this.state.media && this.state.media.length ? (
            <MediaListing
              library={library}
              media={sortBy(x => x.name, this.state.media)}
            />
          ) : (
            <Col>
              <h3>Select a library above.</h3>
            </Col>
          )}
        </Row>
      </Container>
    );
  }
  _dropdownSelected(library: string) {
    this.setState({ library, dropdown: false }, () => {
      this._fetchVideoList(library);
      this._getLibraryDetails(library);
    });
  }
  _getLibraryDetails(id: string) {
    LibraryManager.getById(id)
      .then(libraryDetails => this.setState({ libraryDetails }));
  }
  _fetchVideoList(id: string) {
    if (id) {
      return fetch(`/api/media/${id}`)
        .then(response => response.json())
        .then(response => this.setState(response));
    }
  }
  _fetchLibraries() {
    return fetch('/api/library')
      .then(response => response.json())
      .then(libraries => this.setState({ libraries }));
  }
  _toggleLibraryPicker() {
    this.setState({ dropdown: !this.state.dropdown });
  }
}

export default VideoLibrariesPage;
