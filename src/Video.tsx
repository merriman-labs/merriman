import React, { useState, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { MediaItem } from '../server/models';
import {
  FaPencilAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

type VideoProps = {
  video: string;
};
type VideoState = MediaItem | null;

export const Video = (props: VideoProps) => {
  const [details, setDetails] = useState<VideoState>(null);
  const { video } = props;
  window.scrollTo({ top: 0 });

  useEffect(
    () => {
      const effect = async () => {
        const details = await (await fetch(
          `/api/media/detail/${props.video}`
        )).json();
        setDetails(details);
      };
      effect();
    },
    [props.video]
  );

  return (
    <>
      <Col>
        {video ? (
          <video
            className="video-player"
            id="video-player"
            controls
            src={`/api/media/play/${video}`}
          >
            <track
              label="English"
              kind="subtitles"
              srcLang="en"
              src={`/api/media/captions/${video}`}
              default
            />
          </video>
        ) : (
          <div />
        )}
      </Col>
      <Row>
        {details ? (
          <>
            <Col md="6" sm="12">
              <Link
                to={`/media/edit/${details._id.toString()}`}
                className="btn btn-outline-info btn-sm mr-2"
              >
                <FaPencilAlt />
              </Link>
              <strong>{details.name}</strong>
            </Col>
            <Col md="6" sm="12">
              {details.tags && details.tags.length ? (
                <>
                  {details.tags.map(tag => (
                    <span className="badge badge-pill badge-secondary mr-1">{tag}</span>
                  ))}
                </>
              ) : null}
            </Col>
          </>
        ) : null}
      </Row>
    </>
  );
};
