import React, { useEffect, useState } from 'react';
import { MediaItem } from '../../../server/models';
import MediaManager from '../../managers/MediaManager';
import { MediaGrid } from '../../Media/MediaGrid';

export const RecentItems = (props: { items?: number }) => {
  const [items, setItems] = useState<Array<MediaItem>>([]);

  useEffect(() => {
    MediaManager.latest(props.items || 12).then(setItems);
  }, [props.items]);

  return (
    <>
      <h4 className="h5 m-3">New stuff</h4>
      <MediaGrid items={items} />
    </>
  );
};
