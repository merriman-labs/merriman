import React, { useEffect, useState } from 'react';
import { FaAngleDoubleDown } from 'react-icons/fa';
import { MediaItem } from '../../../server/models';
import MediaManager from '../../managers/MediaManager';
import { MediaGrid } from './MediaGrid';

export const RecentlyViewedPage = () => {
  const [count, setCount] = useState(24);
  const [items, setItems] = useState<Array<MediaItem>>([]);

  useEffect(() => {
    MediaManager.recentlyPlayed(count).then(setItems);
  }, []);
  return (
    <>
      <h4 className="h5 m-3">Recently Viewed</h4>
      <MediaGrid items={items} />
      <button className="btn btn-block btn-outline-info" onClick={() => setCount(count + 12)}><FaAngleDoubleDown /> Load More</button>
    </>
  );
};
