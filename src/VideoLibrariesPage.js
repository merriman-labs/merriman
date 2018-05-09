import React, { Component } from 'react';
import * as R from 'ramda';
import VideoCard from './VideoCard';
import Video from './Video';
import VideoList from './VideoList';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
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
              {library ? (
                <Button color="dark" disabled>
                  {library}
                </Button>
              ) : (
                <div />
              )}
              <Button onClick={this._shuffle}>Shuffle</Button>
              <ButtonGroup className={this.state.dropdown ? 'show' : ''}>
                <Button
                  onClick={this._toggleLibraryPicker}
                  className="dropdown-toggle"
                >
                  Library
                </Button>
                <DropdownMenu className={this.state.dropdown ? 'show' : ''}>
                  {this.state.libraries.map((library, i) => (
                    <Link to={`/videos/${library}/`}>
                      <DropdownItem
                        key={i}
                        onClick={() => this._dropdownSelected(library)}
                      >
                        {library}
                      </DropdownItem>
                    </Link>
                  ))}
                </DropdownMenu>
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
    console.log(library);
    return fetch(
      `http://192.168.50.133/video-list${library ? '/' + library : ''}`
    )
      .then(response => response.json())
      .then(({ files: videos }) => this.setState({ videos }));
  }
  _fetchLibraries() {
    return fetch('http://192.168.50.133/libraries')
      .then(response => response.json())
      .then(res => this.setState(res));
  }
  _toggleLibraryPicker() {
    this.setState({ dropdown: !this.state.dropdown });
  }
}

export default VideoLibrariesPage;
