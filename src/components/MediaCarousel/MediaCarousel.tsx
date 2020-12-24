import React from 'react';
import ReactImageFallback from 'react-image-fallback';
import { Carousel } from 'react-responsive-carousel';
import { MediaItem } from '../../../server/models';
import { Link } from 'react-router-dom';

export const MediaCarousel = ({ items }: { items: Array<MediaItem> }) => {
  return (
    <Carousel showArrows infiniteLoop showStatus={false}>
      {items.map((item) => (
        <Link className="d-block" to={`/media/${item._id}`} key={item._id.toString()}>
          <ReactImageFallback
            className="card-image-top"
            src={`/${item.filename}.png`}
            fallbackImage="/blank.png"
          />
          <p className="legend">{item.name}</p>
        </Link>
      ))}
    </Carousel>
  );
};
