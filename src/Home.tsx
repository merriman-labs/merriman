import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { TagsList } from './Media/TagsList';
import { RecentlyPlayed } from './components/Home/RecentlyPlayed';
import { NewItems } from './components/Home/NewItems';

const Home = () => {
  return (
    <>
      <RecentlyPlayed />
      <NewItems />
      <Container fluid className="mt-3">
        <Row>
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
};

export default Home;
