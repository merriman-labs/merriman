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
