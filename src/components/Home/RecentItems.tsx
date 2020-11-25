import React, { useEffect, useState } from 'react';
import Media from 'reactstrap/lib/Media';
import { MediaItem } from '../../../server/models';
import MediaManager from '../../managers/MediaManager';
import { MediaGrid } from '../../Media/MediaGrid';

export const RecentItems = () => {
    const [items, setItems] = useState<Array<MediaItem>>([]);

    useEffect(() => {
        MediaManager.latest(12).then(setItems);
    }, []);

    return <MediaGrid items={items} />
}