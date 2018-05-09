import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route } from 'react-router';
import Video from './Video';
import Navigation from './Navigation';
import VideoLibrariesPage from './VideoLibrariesPage';
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import Home from './Home';

import AdminPanel from './admin/AdminPanel';
import VideoList from './VideoList';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          <Route
            path="/videos/:library?/:video?"
            component={VideoLibrariesPage}
          />
        </Row>
        <Row>
          <Col>
            <Route exact path="/" component={Home} />
          </Col>
        </Row>
        <Route path="/admin" component={AdminPanel} />
      </Container>
    );
  }
}

export default App;
