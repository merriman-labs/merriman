import React, { Component } from 'react';
import { Jumbotron, Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchPage from './SearchPage';
import ListGroup from 'reactstrap/lib/ListGroup';
import { Library } from '../server/models';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';

type HomeState = {
  libraries: Array<Library> | null;
};
class Home extends Component<any, HomeState> {
  constructor(props: any) {
    super(props);
    this.state = { libraries: null };
  }
  componentDidMount() {
    this._fetchLibraries();
  }
  render() {
    return (
      <>
        <Jumbotron>
          <h1 className="display-4">Hello, world!</h1>
          <p className="lead">Welcome to node media server!</p>
          <SearchPage />
        </Jumbotron>
        <Container>
          <Row>
            <Col md="6">
              <ListGroup>
                {this.state.libraries
                  ? [
                      <ListGroupItem>
                        <h4>Libraries</h4>
                      </ListGroupItem>,
                      ...this.state.libraries.map(({ name, items, _id }) => (
                        <Link
                          to={`/videos/${_id.toString()}`}
                          className="list-group-item"
                        >
                          <h5 className="mb-1">{name}</h5>
                          <small className="text-muted">
                            {items.length} items
                          </small>
                        </Link>
                      ))
                    ]
                  : null}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
  private _fetchLibraries() {
    return fetch('/api/library')
      .then(response => response.json())
      .then(libraries => this.setState({ libraries }));
  }
}

export default Home;
