import React, { Component } from 'react';
import Video from './Video';
import VideoList from './VideoList';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Container, Row, Col } from 'reactstrap';
import Chance from 'chance';
const chance = Chance.Chance(Math.random);

class VideoLibrariesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      media: [],
      videos: [],
      libraries: [],
      dropdown: false,
      video: null,
      library: null,
      libraryDetails: { name: null }
    };
    this._toggleLibraryPicker = this._toggleLibraryPicker.bind(this);
    this._fetchVideoList = this._fetchVideoList.bind(this);
    this._fetchLibraries = this._fetchLibraries.bind(this);
    this._shuffle = this._shuffle.bind(this);
    this._randomVideo = this._randomVideo.bind(this);
  }

  componentDidMount() {
    this._fetchLibraries();

    const id = this.props.match.params.library;
    if (id) {
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
            <ButtonGroup>
              <Button color="secondary">
                {this.state.libraryDetails.name
                  ? this.state.libraryDetails.name
                  : 'No Library Selected'}
              </Button>
              {library ? (
                <Button onClick={this._shuffle} color="dark">
                  Shuffle
                </Button>
              ) : (
                <div />
              )}
              {this.state.media.length ? (
                <Link
                  className="btn btn-dark"
                  to={`/videos/${library}/${this._randomVideo()._id}`}
                >
                  Random
                </Link>
              ) : (
                <div />
              )}
              <ButtonGroup>
                <Button
                  onClick={this._toggleLibraryPicker}
                  className="dropdown-toggle"
                  color="dark"
                >
                  Library
                </Button>
                <div
                  className={
                    'dropdown-menu' + (this.state.dropdown ? ' show' : '')
                  }
                >
                  {this.state.libraries.map((library, i) => (
                    <Link
                      to={`/videos/${library._id}/`}
                      className="dropdown-item"
                      onClick={() => this._dropdownSelected(library._id)}
                      key={library._id}
                    >
                      {library.name}{' '}
                      <span className="badge badge-primary badge-pill">
                        {library.items.length}
                      </span>
                    </Link>
                  ))}
                </div>
              </ButtonGroup>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            {video ? <Video library={library} video={video} /> : <div />}
          </Col>
        </Row>
        <Row>
          {this.state.media && this.state.media.length ? (
            <VideoList library={library} media={this.state.media} />
          ) : (
            <Col>
              <h3>Select a library above.</h3>
            </Col>
          )}
        </Row>
      </Container>
    );
  }
  _randomVideo() {
    return chance.pickone(this.state.media);
  }
  _shuffle() {
    if (this.state.media.length)
      this.setState({
        media: this.state.media.sort(() => Math.random() - 0.5)
      });
  }
  _dropdownSelected(library) {
    this.setState({ library, dropdown: false }, () => {
      this._fetchVideoList(library);
      this._getLibraryDetails(library);
    });
  }
  _getLibraryDetails(id) {
    fetch(`/api/library/details/${id}`)
      .then(response => response.json())
      .then(libraryDetails => this.setState({ libraryDetails }));
  }
  _fetchVideoList(id) {
    if (id) {
      return fetch(`/api/library/${id}`)
        .then(response => response.json())
        .then(response => this.setState(response));
    }
  }
  _fetchLibraries() {
    return fetch('/api/library')
      .then(response => response.json())
      .then(({ libraries }) => this.setState({ libraries }));
  }
  _toggleLibraryPicker() {
    this.setState({ dropdown: !this.state.dropdown });
  }
}

export default VideoLibrariesPage;
