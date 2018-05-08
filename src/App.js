import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route } from 'react-router';
import Video from './Video';
import Navigation from './Navigation';
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import AdminPanel from './admin/AdminPanel';
import VideoList from './VideoList';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      videos: [],
      dropdown: false,
      library: null,
      libraries: []
    };
    this.openLibraryPicker = this.openLibraryPicker.bind(this);
    this._fetchVideoList = this._fetchVideoList.bind(this);
    this._fetchLibraries = this._fetchLibraries.bind(this);
  }
  _fetchVideoList() {
    return fetch(
      `http://192.168.50.133/video-list${
        this.state.library ? '/' + this.state.library : ''
      }`
    )
      .then(response => response.json())
      .then(({ files: videos }) => this.setState({ videos }));
  }
  _fetchLibraries() {
    return fetch('http://192.168.50.133/libraries')
      .then(response => response.json())
      .then(res => this.setState(res));
  }

  componentDidMount() {
    this._fetchLibraries();
  }

  openLibraryPicker() {
    this.setState({ dropdown: !this.state.dropdown });
  }

  _libraryClick(library) {
    this.setState({ library }, this._fetchVideoList);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Navigation />
          </Col>
        </Row>

        <Row>
          <Col>
            <Dropdown
              isOpen={this.state.dropdown}
              toggle={this.openLibraryPicker}
            >
              <DropdownToggle caret>Library</DropdownToggle>
              <DropdownMenu>
                {this.state.libraries.map((library, i) => (
                  <DropdownItem
                    key={i}
                    onClick={() => this._libraryClick(library)}
                  >
                    {library}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <Route
            path="/videos/:video?"
            render={props => {
              return <Video {...props} library={this.state.library} />;
            }}
          />
        </Row>
        <Row>
          <Route
            path="/videos"
            render={props => (
              <VideoList {...props} videos={this.state.videos} />
            )}
          />
        </Row>

        <Route path="/admin" component={AdminPanel} />
      </Container>
    );
  }
}

export default App;
