import React, { Component } from 'react';
import Video from './Video';
import VideoList from './VideoList';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Container,
  Row,
  Col,
  DropdownItem
} from 'reactstrap';

class VideoLibrariesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      libraries: [],
      dropdown: false,
      video: null,
      library: null
    };
    this._toggleLibraryPicker = this._toggleLibraryPicker.bind(this);
    this._fetchVideoList = this._fetchVideoList.bind(this);
    this._fetchLibraries = this._fetchLibraries.bind(this);
    this._shuffle = this._shuffle.bind(this);
  }

  componentDidMount() {
    this._fetchLibraries();

    if (this.props.match.params.library)
      this._fetchVideoList(this.props.match.params.library);
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
              <Button color="dark" disabled>
                {library ? library : 'No Library Selected'}
              </Button>
              {library ? (
                <Button onClick={this._shuffle}>Shuffle</Button>
              ) : (
                <div />
              )}
              <ButtonGroup>
                <Button
                  onClick={this._toggleLibraryPicker}
                  className="dropdown-toggle"
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
                      to={`/videos/${library.name}/`}
                      className="dropdown-item"
                      onClick={() => this._dropdownSelected(library.name)}
                    >
                      {library.name}
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
          {this.state.videos.length > 0 ? (
            <VideoList library={library} videos={this.state.videos} />
          ) : (
            <Col>
              <h3>Select a library above.</h3>
            </Col>
          )}
        </Row>
      </Container>
    );
  }
  _shuffle() {
    if (this.state.videos.length)
      this.setState({
        videos: this.state.videos.sort(() => Math.random() - 0.5)
      });
  }
  _dropdownSelected(library) {
    this.setState({ library, dropdown: false }, () =>
      this._fetchVideoList(library)
    );
  }

  _fetchVideoList(library) {
    const pathTail = library ? '/' + library : '';

    return fetch(`http://192.168.50.133/api/video-list${pathTail}`)
      .then(response => response.json())
      .then(({ files: videos }) => this.setState({ videos }));
  }
  _fetchLibraries() {
    return fetch('http://192.168.50.133/api/libraries')
      .then(response => response.json())
      .then(({ libraries }) => this.setState({ libraries }));
  }
  _toggleLibraryPicker() {
    this.setState({ dropdown: !this.state.dropdown });
  }
}

export default VideoLibrariesPage;
