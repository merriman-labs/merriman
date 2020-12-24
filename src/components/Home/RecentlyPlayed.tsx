import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../../../server/models';
import MediaManager from '../../managers/MediaManager';
import { MediaCarousel } from '../MediaCarousel/MediaCarousel';

export const RecentlyPlayed = (props: { items?: number }) => {
  const [items, setItems] = useState<Array<MediaItem>>([]);
  useEffect(() => {
    MediaManager.recentlyPlayed(props.items || 12).then(setItems);
  }, []);

  return (
    <>
      <h2 className="h5 m-3">Recently Viewed <Link className="ml-3" to="/media/recently-viewed">see all</Link></h2>
      <MediaCarousel items={items} />
    </>
  );
};
