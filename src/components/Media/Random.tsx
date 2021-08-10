import React, { useEffect, useState } from 'react';
import { Col } from 'reactstrap';
import { MediaItem } from '../../../server/models';
import { MediaPlayer } from '../MediaPlayer/MediaPlayer';
import MediaManager from '../../managers/MediaManager';
import * as R from 'ramda';

export const RandomMedia = () => {
  const [index, setIndex] = useState(-1);
  const [history, setHistory] = useState<Array<MediaItem>>([]);

  useEffect(() => {
    next();
  }, []);

  function next() {
    MediaManager.random(1).then(([item]) => {
      setHistory((hist) => hist.concat(item));
      setIndex(R.inc);
    });
  }

  function back() {
    setIndex(R.dec);
  }

  window.scrollTo({ top: 0 });
  return (
    <Col>
      {index >= 0 ? (
        <MediaPlayer id={history[index]._id.toString()} />
      ) : (
        <div />
      )}
      {index >= 0 ? (
        <div>
          <span>{history[index].views} views</span>
          <br />
          <div className="btn-group mb-1">
            <button
              className="btn btn-outline-primary btn-sm"
              disabled={index === 0}
              onClick={back}
            >
              &larr;
            </button>
            <button className="btn btn-outline-primary btn-sm" onClick={next}>
              &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div />
      )}
    </Col>
  );
};
