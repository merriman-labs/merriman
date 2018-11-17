import React, { Component } from 'react';
import { FaClock, FaCheckCircle, FaPlus, FaTrash } from 'react-icons/fa';
import * as R from 'ramda';
import {
  Button,
  ButtonGroup,
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
    this.state = {
      config: { mediaLocation: '', thumbLocation: '' },
      files: [],
      libraries: [],
      newLibraryName: ''
    };
    this._handleInputChange = this._handleInputChange.bind(this);
  }
  componentDidMount() {
    this._getConfigData();
    this._getLibraryData();
  }
  _getConfigData = () => {
    fetch('/api/admin/server-config')
      .then(response => response.json())
      .then(config => this.setState({ config }))
      .catch(console.log);
  };
  _getLibraryData = () => {
    fetch('/api/libraries')
      .then(response => response.json())
      .then(libraries => this.setState(libraries))
      .catch(console.log);
  };
  _sendConfig(config) {
    return fetch('/api/admin/config', {
      body: JSON.stringify(config),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    });
  }
  _formSubmit = () => {
    const data = {
      mediaLocation: this.state.config.mediaLocation,
      thumbLocation: this.state.config.thumbLocation
    };

    fetch('/api/admin/server-config', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
  };
  _handleFileUploadChanged({ target: { files, value } }) {
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
  _handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const path = target.name;
    this.setState(R.assocPath(R.split('.', path), value));
  }
  _handleAddLibrary = () => {
    const data = {
      name: this.state.newLibraryName
    };

    fetch('/api/admin/libraries/add', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    })
      .then(this._getLibraryData)
      .then(() => this.setState({ newLibraryName: '' }));
  };
  _handleDropLibrary = _id => () => {
    const data = {
      _id
    };

    fetch(`/api/admin/libraries/${_id}`, {
      method: 'DELETE'
    }).then(this._getLibraryData);
  };
  render() {
    return [
      <Row>
        <Col md="6">
          <h2>Server Config</h2>
          <div className="form">
            <FormGroup>
              <Label for="mediaLocation">Media Location</Label>
              <input
                type="text"
                name="config.mediaLocation"
                className="form-control"
                value={this.state.config.mediaLocation}
                onChange={this._handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="thumbLocation">Thumbnail Location</Label>
              <input
                type="text"
                name="config.thumbLocation"
                className="form-control"
                value={this.state.config.thumbLocation}
                onChange={this._handleInputChange}
              />
            </FormGroup>
            <Button color="success" type="submit" onClick={this._formSubmit}>
              Add
            </Button>
          </div>
        </Col>
        <Col md="6">
          <h2>Libraries</h2>
          <ListGroup className="form">
            {this.state.libraries.length ? (
              this.state.libraries.map(({ _id, name, items }) => (
                <ListGroupItem key={_id}>
                  <ListGroupItemHeading>{name}</ListGroupItemHeading>
                  <span>{items.length} items</span>
                  <ButtonGroup className="float-right">
                    <a
                      className="btn btn-success"
                      href={`/admin/select-media/${_id}`}
                    >
                      <FaPlus /> Select Media
                    </a>
                    <Button
                      color="danger"
                      onClick={this._handleDropLibrary(_id)}
                    >
                      <FaTrash />
                    </Button>
                  </ButtonGroup>
                </ListGroupItem>
              ))
            ) : (
              <div />
            )}
            <ListGroupItem>
              <FormGroup>
                <ListGroupItemHeading>New Library</ListGroupItemHeading>
                <Label>Name</Label>
                <input
                  type="text"
                  name="newLibraryName"
                  className="form-control"
                  value={this.state.newLibraryName}
                  onChange={this._handleInputChange}
                />
              </FormGroup>
              <Button color="success" onClick={this._handleAddLibrary}>
                <FaPlus />
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
              onChange={e => this._handleFileUploadChanged(e)}
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
