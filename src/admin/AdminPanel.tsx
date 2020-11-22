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
import Container from 'reactstrap/lib/Container';
import LibraryManager from '../managers/LibraryManager';
import MediaManager from '../managers/MediaManager';

type FileInfo = { uploaded: boolean; file: File };
type AdminPanelProps = {};
type AdminPanelState = {
  files: Array<FileInfo>;
};

class AdminPanel extends Component<AdminPanelProps, AdminPanelState> {
  constructor(props: AdminPanelProps) {
    super(props);
    this.state = {
      files: []
    };
  }
  _handleFileUploadChanged({
    target: { files }
  }: React.ChangeEvent<HTMLInputElement>) {
    const fileObjects = [...files]
      .map((file) => ({ file }))
      .map(R.assoc('uploaded', false));

    this.setState({ files: fileObjects });
  }
  _handleFileUpload = () => {
    this.state.files.forEach(({ file }) => this._sendFile(file));
  };
  _sendFile(file: File) {
    const data = new FormData();
    data.append('file', file);

    return MediaManager.upload(data).then((_) =>
      this.setState(({ files }) => ({
        files: files.map((f) =>
          f.file.name === file.name ? R.assoc('uploaded', true, f) : f
        )
      }))
    );
  }
  _handleStopServer = () => {
    fetch('/api/admin/stop', { method: 'POST' });
  };
  render() {
    return (
      <>
        <Container className="mt-2">
          <Row>
            <Col md="6">
              <h2>Server</h2>
              <Button color="danger" onClick={this._handleStopServer}>
                Kill Server
              </Button>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default AdminPanel;
