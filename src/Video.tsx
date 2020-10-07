import React, { Component, useState, useEffect } from 'react';
import { Col } from 'reactstrap';
import { MediaItem } from '../server/models';

type VideoProps = {
  video: string;
  library: string;
};
type VideoState = MediaItem | null;

export const Video = (props: VideoProps) => {
  const [details, setDetails] = useState<VideoState>(null);
  const { library, video } = props;
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
    <Col>
      {video && library ? (
        <video
          className="video-player"
          id="video-player"
          controls
          src={`/api/media/play/${video}`}
        />
      ) : (
        <div />
      )}
      {details ? <strong>{details.name}</strong> : <div />}
    </Col>
  );
};
