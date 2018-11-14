import React, { Component } from 'react';
import { FaClock, FaCheckCircle } from 'react-icons/fa';
import * as R from 'ramda';
import {
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Form,
  FormGroup,
  Label
} from 'reactstrap';
import LibraryEdit from './LibraryEdit';

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { config: { libraries: [] }, files: [] };
    this._formSubmit = this._upsertLib.bind(this);
    this._getConfigData = this._getConfigData.bind(this);
    this._initLibraries = this._initLibraries.bind(this);
    this._removeLibrary = this._removeLibrary.bind(this);
    this._upsertLib = this._upsertLib.bind(this);
  }
  componentDidMount() {
    this._getConfigData();
  }
  _getConfigData() {
    fetch('/api/admin/config')
      .then(response => response.json())
      .then(config => this.setState({ config }))
      .catch(console.log);
  }
  _sendConfig(config) {
    return fetch('/api/admin/config', {
      body: JSON.stringify(config),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    });
  }
  _upsertLib(library) {
    fetch('/api/admin/add-library', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(library)
    }).then(this._getConfigData);
  }
  _initLibraries(event) {
    event.preventDefault();
    fetch('/api/admin/init', { method: 'POST' })
      .then(x => x.json())
      .then(console.log)
      .catch(console.log);
  }
  _removeLibrary({ name, location }) {
    const libraries = this.state.config.libraries.filter(
      lib => !(lib.name === name && lib.location === location)
    );
    const config = { ...this.state.config, libraries };

    this._sendConfig(config).then(() => {
      this.setState({ config }, this._getConfigData);
    });
  }
  handleFileUploadChanged({ target: { files, value } }) {
    const fileObjects = [...files]
      .map(file => ({ file }))
      .map(R.assoc('uploaded', false));
    this.setState({ files: fileObjects });
  }
  _handleFileUpload = () => {
    this.state.files.forEach(({ file }) => this._sendFile(file));
  };
  _sendFile(file) {
    const data = new FormData();
    data.append('file', file);

    return fetch('/api/upload', {
      method: 'POST',
      body: data
    }).then(_ =>
      this.setState(({ files }) => ({
        files: files.map(f =>
          f.file.name === file.name ? R.assoc('uploaded', true, f) : f
        )
      }))
    );
  }
  render() {
    return [
      <Row>
        <Col md="6">
          <h2>Add Libraries</h2>
          <LibraryEdit saveLib={this._upsertLib} />
        </Col>
        <Col md="6">
          <h2>Libraries</h2>
          <ListGroup>
            {this.state.config.libraries.map(
              ({ _id, name, location, created, initialized }) => (
                <ListGroupItem key={_id}>
                  <ListGroupItemHeading>{name}</ListGroupItemHeading>
                  <strong>path: </strong> <code>{location}</code>
                  <Button
                    onClick={() => this._removeLibrary({ name, location })}
                    color="danger"
                    size="sm"
                    className="float-right"
                  >
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
      </Row>,
      <Row>
        <Col md="6">
          <FormGroup>
            <Label for="name">File</Label>
            <input
              type="file"
              name="file"
              ref="file"
              className="form-control"
              onChange={e => this.handleFileUploadChanged(e)}
              multiple
            />
            <ListGroup>
              {this.state.files.length ? (
                this.state.files.map(({ file: { name }, uploaded }, i) => (
                  <ListGroupItem key={i}>
                    {uploaded ? <FaCheckCircle /> : <FaClock />}&nbsp;
                    {name}
                  </ListGroupItem>
                ))
              ) : (
                <div />
              )}
              <ListGroupItem>
                <Button
                  color="success"
                  block
                  disabled={!this.state.files.length}
                  onClick={this._handleFileUpload}
                >
                  Upload
                </Button>
              </ListGroupItem>
            </ListGroup>
          </FormGroup>
        </Col>
      </Row>
    ];
  }
}

export default AdminPanel;
