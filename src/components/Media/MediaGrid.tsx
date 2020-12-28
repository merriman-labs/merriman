import moment from 'moment';
import React from 'react';
import { FaUserAlt } from 'react-icons/fa';
import ReactImageFallback from 'react-image-fallback';
import { Link } from 'react-router-dom';
import { MediaItem } from '../../../server/models';

export const MediaCard = (props: { item: MediaItem }) => (
  <Link to={`/media/${props.item._id}`} className="card mb-3 h-100">
    <ReactImageFallback
      className="card-image-top"
      src={`/${props.item.filename}.png`}
      fallbackImage="/blank.png"
    />
    <div className="card-body">
      <p className="card-title truncate-text-2">{props.item.name}</p>
      <p className="card-text">
        <small className="text-muted">
          {moment(props.item.createdAt).fromNow()} &bull;{' '}
          <FaUserAlt className="mr-1" />
          {props.item.user.username}
        </small>
      </p>
    </div>
  </Link>
);

export const MediaGrid = (props: { items: Array<MediaItem> }) => {
  return (
    <div className="container-fluid mt-4">
      <div className="row row-cols-1 row-cols-md-4 row-cols-xl-6">
        {props.items.map((item) => (
          <div className="col mb-3" key={item._id.toString()}>
            <MediaCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
