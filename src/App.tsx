import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route } from 'react-router';
import Navigation from './Navigation';
import VideoLibrariesPage from './VideoLibrariesPage';
import { Container, Row, Col } from 'reactstrap';
import Home from './Home';
import SelectMedia from './admin/SelectMedia';
import AdminPanel from './admin/AdminPanel';
import StandaloneMedia from './StandaloneMedia';

class App extends Component<{}> {
  render() {
    return [
      <Navigation />,
      <Container>
        <Row>
          <Route path="/media/:media" component={StandaloneMedia} />
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
        <Route exact path="/admin" component={AdminPanel} />
        <Route
          exact
          path="/admin/select-media/:library"
          component={SelectMedia}
        />
      </Container>
    ];
  }
}

export default App;
