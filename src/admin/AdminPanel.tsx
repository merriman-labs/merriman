import React, { Component } from 'react';
import { Button, Row, Col } from 'reactstrap';
import Container from 'reactstrap/lib/Container';
type FileInfo = { uploaded: boolean; file: File };
type AdminPanelProps = {};
type AdminPanelState = {
  files: Array<FileInfo>;
};

const AdminPanel = () => {
  const handleStopServer = () => {
    fetch('/api/admin/stop', { method: 'POST' });
  };
  return (
    <>
      <Container className="mt-2">
        <Row>
          <Col md="6">
            <h2>Server</h2>
            <Button color="danger" onClick={handleStopServer}>
              Kill Server
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminPanel;
