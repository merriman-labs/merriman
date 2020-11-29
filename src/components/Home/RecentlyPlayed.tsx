import React, { useEffect, useState } from 'react';
import { MediaItem } from '../../../server/models';
import MediaManager from '../../managers/MediaManager';
import { MediaGrid } from '../../Media/MediaGrid';

export const RecentlyPlayed = (props: { items?: number }) => {
  const [items, setItems] = useState<Array<MediaItem>>([]);

  useEffect(() => {
    MediaManager.recentlyPlayed(props.items || 12).then(setItems);
  }, []);

  return (
    <>
      <h4 className="m-3">Pick up where you left off</h4>
      <MediaGrid items={items} />
    </>
  );
};
