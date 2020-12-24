import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../../../server/models';
import MediaManager from '../../managers/MediaManager';
import { MediaCarousel } from '../MediaCarousel/MediaCarousel';

export const NewItems = () => {
  const [items, setItems] = useState<Array<MediaItem>>([]);
  useEffect(() => {
    MediaManager.latest(6).then(setItems);
  }, []);

  return (
    <>
      <h2 className="h5 m-3">Recently Added <Link className="ml-3" to="/media/recent">see all</Link></h2>
      <MediaCarousel items={items} />
    </>
  );
};
