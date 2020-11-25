import moment from 'moment';
import React from 'react';
import ReactImageFallback from 'react-image-fallback';
import { MediaItem } from '../../server/models';

const MediaCard = (props: { item: MediaItem }) => (
  <div className="card mb-3 h-100">
    <ReactImageFallback
      className="card-image-top"
      src={`/${props.item.filename}.png`}
      fallbackImage="/blank.png"
    />
    <div className="card-body">
      <h5 className="card-title">{props.item.name}</h5>
      <p className="card-text">
        <small className="text-muted">
          {moment(props.item.created).fromNow()}
        </small>
      </p>
    </div>
  </div>
);

export const MediaGrid = (props: { items: Array<MediaItem> }) => {
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col">
          <h4 className="mb-3">Recently Added</h4>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-4 row-cols-xl-6">
        {props.items.map((item) => (
          <div className="col mb-3">
            <MediaCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
