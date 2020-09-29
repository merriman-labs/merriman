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
  FormGroup,
  Label
} from 'reactstrap';
import { Library } from '../../server/models';

type FileInfo = { uploaded: boolean; file: File };
type AdminPanelProps = {};
type AdminPanelState = {
  files: Array<FileInfo>;
  libraries: Array<Library>;
  newLibraryName: string;
};

class AdminPanel extends Component<AdminPanelProps, AdminPanelState> {
  constructor(props: AdminPanelProps) {
    super(props);
    this.state = {
      files: [],
      libraries: [],
      newLibraryName: ''
    };
    this._handleInputChange = this._handleInputChange.bind(this);
  }
  componentDidMount() {
    this._getLibraryData();
  }
  _getLibraryData = () => {
    fetch('/api/library')
      .then(response => response.json())
      .then(libraries => this.setState({libraries}))
      .catch(console.log);
  };
  _handleFileUploadChanged({
    target: { files, value }
  }: React.ChangeEvent<HTMLInputElement>) {
    const fileObjects = [...files]
      .map(file => ({ file }))
      .map(R.assoc('uploaded', false));

    this.setState({ files: fileObjects });
  }
  _handleFileUpload = () => {
    this.state.files.forEach(({ file }) => this._sendFile(file));
  };
  _sendFile(file: File) {
    const data = new FormData();
    data.append('file', file);

    return fetch('/api/media/upload', {
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
  _handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
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
  _handleDropLibrary = (_id: string) => () => {
    fetch(`/api/admin/libraries/${_id}`, {
      method: 'DELETE'
    }).then(this._getLibraryData);
  };
  _handleStopServer = () => {
    console.log('Stopping server');
    fetch('/api/admin/stop', { method: 'POST' })
  }
  render() {
    return <>
      <Row>
        <Col md="6">
          <h2>Libraries</h2>
          <ListGroup className="form">
            {this.state.libraries.length ? (
              this.state.libraries.map(({ _id, name, items }, i) => (
                <ListGroupItem key={_id.toString()}>
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
                      onClick={this._handleDropLibrary(_id.toString())}
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
        <Col md="6">
          <FormGroup>
            <h2>
              <Label for="name">File Upload</Label>
            </h2>
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
      <Row>
        <Col md="6">
          <h2>Server</h2>
          <Button color="danger" onClick={this._handleStopServer}>Kill Server</Button>
        </Col>
      </Row>
    </>
  }
}

export default AdminPanel;
