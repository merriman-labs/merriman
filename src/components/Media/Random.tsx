import * as R from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import { FaRedo } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button, Card, CardImg, Col, InputGroup } from 'reactstrap';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import { MediaItem } from '../../../server/models';
import MediaManager from '../../managers/MediaManager';

type RandomMediaProps = {
  match: {
    params: {
      tag: string;
    };
  };
};

export const RandomMedia = (props: RandomMediaProps) => {
  const [media, setMedia] = useState<Array<MediaItem>>([]);
  const [count, setCount] = useState<number>(24);

  const loadMedia = useCallback(
    function () {
      MediaManager.random(count).then(setMedia);
    },
    [count]
  );

  function handleRerollClick() {
    loadMedia();
  }

  useEffect(() => {
    loadMedia();
  }, [count, loadMedia]);
  return (
    <Container fluid>
      <Row
        style={{
          position: 'sticky',
          top: '0px',
          zIndex: 9,
          padding: '10px 0',
          marginBottom: '5px',
          backgroundColor: '#222',
          boxSizing: 'border-box'
        }}
      >
        <Col xs="6" xl="2">
          <InputGroup>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="custom-select"
            >
              {R.range(2, 11)
                .map((n) => n * 12)
                .map((n) => (
                  <option value={n}>{n}</option>
                ))}
            </select>
          </InputGroup>
        </Col>
        <Col>
          <Button onClick={handleRerollClick}>
            <FaRedo /> Reroll
          </Button>
        </Col>
      </Row>
      <Row>
        {R.splitEvery(4, media).map((group) =>
          group.map((item, i) => {
            return (
              <Col xs="6" sm="6" lg="3" xl="2" key={i} className="video-cell">
                <Card>
                  <Link to={`/media/${item._id.toString()}`}>
                    <CardImg src={`/${item.filename}.png` as string} />
                  </Link>
                  <div className="card-body">
                    <Link
                      to={`/media/${item._id.toString()}`}
                      className="card-title"
                    >
                      {item.name}
                    </Link>
                  </div>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
};
