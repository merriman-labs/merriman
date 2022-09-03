import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { NewItems } from './NewItems';
import { TagCloud } from '../TagCloud/TagCloud';

const Home = () => {
  return (
    <>
      <NewItems />
      <Container fluid className="mt-3">
        <Row>
          <Col md="6">
            <h2 className="h5">Tags</h2>
            <TagCloud />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
