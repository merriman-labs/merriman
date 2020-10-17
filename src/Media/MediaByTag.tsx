import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardImgOverlay, CardText, Col } from 'reactstrap';
import { MediaItem } from '../../server/models';
import MediaManager from '../managers/MediaManager';

type MediaByTagProps = {
  match: {
    params: {
      tag: string;
    };
  };
};

const mediaManager = new MediaManager();

export const MediaByTag = (props: MediaByTagProps) => {
  const [media, setMedia] = useState<Array<MediaItem>>([]);
  useEffect(
    () => {
      const effect = async () => {
        const { items: media } = await mediaManager.getByTag(
          props.match.params.tag
        );
        setMedia(media);
      };

      effect();
    },
    [props.match.params.tag]
  );
  return (
    <>
      {R.splitEvery(4, media).map(group => {
        return group.map((item, i) => {
          return (
            <Col sm="6" lg="3" key={i} className="video-cell">
              <Card>
                <Link to={`/media/${item._id.toString()}`}>
                  <CardImg src={`/${item.filename}.png`} />
                  <CardImgOverlay className="thumbnail-link">
                    <CardText>{item.name}</CardText>
                  </CardImgOverlay>
                </Link>
              </Card>
            </Col>
          );
        });
      })}
    </>
  );
};
