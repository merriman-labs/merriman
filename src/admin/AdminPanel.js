import React, { Component } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading
} from 'reactstrap';

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { config: { libraries: [] } };
    this._formSubmit = this._formSubmit.bind(this);
    this._getConfigData = this._getConfigData.bind(this);
    this._initLibraries = this._initLibraries.bind(this);
  }
  componentDidMount() {
    this._getConfigData();
  }
  _getConfigData() {
    fetch('http://localhost/admin/config')
      .then(response => response.json())
      .then(config => this.setState({ config }));
  }
  _sendConfig(config) {
    fetch('http://localhost/admin/config', {
      body: JSON.stringify(config),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }).then(this._getConfigData);
  }
  _formSubmit(event) {
    event.preventDefault();
    const {
      name: { value: name },
      path: { value: location }
    } = this.refs;
    const conf = {
      ...this.state.config,
      libraries: this.state.config.libraries.concat({
        name,
        location,
        created: new Date().toISOString(),
        initialized: false
      })
    };
    this._sendConfig(conf);
  }
  _initLibraries(event) {
    event.preventDefault();
    fetch('http://localhost/admin/init', { method: 'POST' })
      .then(x => x.json())
      .then(console.log)
      .catch(console.log);
  }
  render() {
    return (
      <Row>
        <Col md="6">
          <h2>Add Libraries</h2>
          <Form onSubmit={this._formSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <input
                type="text"
                name="name"
                ref="name"
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <Label for="path">Path</Label>
              <input
                type="text"
                name="path"
                ref="path"
                className="form-control"
              />
            </FormGroup>
            <Button color="success" type="submit">
              Add
            </Button>
          </Form>
        </Col>
        <Col md="6">
          <h2>Libraries</h2>
          <ListGroup>
            {this.state.config.libraries.map(
              ({ name, location, created, initialized }) => (
                <ListGroupItem>
                  <ListGroupItemHeading>{name}</ListGroupItemHeading>
                  <strong>path: </strong> <code>{location}</code>
                  <Button color="danger" size="sm" className="float-right">
                    delete
                  </Button>
                </ListGroupItem>
              )
            )}
            <ListGroupItem>
              <Button color="warning" block onClick={this._initLibraries}>
                Initialize All
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    );
  }
}

export default AdminPanel;
