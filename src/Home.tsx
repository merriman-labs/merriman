import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { TagsList } from './Media/TagsList';
import { RecentItems } from './components/Home/RecentItems';
import { RecentlyPlayed } from './components/Home/RecentlyPlayed';

const Home = () => {
  return (
    <>
      <RecentlyPlayed />
      <RecentItems />
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
