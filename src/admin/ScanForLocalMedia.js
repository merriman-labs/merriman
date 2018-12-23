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

export default class ScanForLocalMedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      scanning: false
    };
  }
  render() {
    return (
      <FormGroup>
        <h2>
          <Label for="name">Scan for new media</Label>
        </h2>
        <ListGroup>
          {this.state.files.length ? (
            this.state.files.map(({ name, uploaded }, i) => (
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
              disabled={this.state.scanning}
              onClick={this._runMediaScan}
            >
              Scan
            </Button>
          </ListGroupItem>
        </ListGroup>
      </FormGroup>
    );
  }
  _runMediaScan = () => {
    fetch('/api/admin/local-media-scan', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({})
    })
      .then(x => x.json())
      .then(files => files.map(name => ({ name, uploaded: false })))
      .then(files => this.setState({ files }));
  };
}
