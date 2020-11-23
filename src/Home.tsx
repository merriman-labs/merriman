import React, { Component } from 'react';
import { Jumbotron, Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchPage from './SearchPage';
import ListGroup from 'reactstrap/lib/ListGroup';
import { Library } from '../server/models';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import { TagsList } from './Media/TagsList';
import LibraryManager from './managers/LibraryManager';

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
        <Container className="mt-3">
          <Row>
            <Col md="6">
              <ListGroup>
                {this.state.libraries
                  ? [
                      <ListGroupItem key="0">
                        <h4>Libraries</h4>
                      </ListGroupItem>,
                      ...this.state.libraries.map(({ name, items, _id }) => (
                        <Link
                          to={`/videos/${_id.toString()}`}
                          className="list-group-item"
                          key={_id.toString()}
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
            <Col md="6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Tags</h5>
                  <p className="card-text">
                    <TagsList />
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
  private _fetchLibraries() {
    return LibraryManager.list().then(libraries =>
      this.setState({ libraries })
    );
  }
}

export default Home;
