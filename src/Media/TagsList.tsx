import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MediaManager from '../managers/MediaManager';

export const TagsList = () => {
  const [tags, setTags] = useState<Array<string>>([]);
  useEffect(() => {
    const doEffect = async () => {
      const result = await MediaManager.tags();
      setTags(result.tags);
    };
    doEffect();
  }, []);

  return (
    <>
      {tags.map(tag => (
        <Link key={tag} to={`media/tag/${tag}`} className="badge badge-pill badge-secondary mr-1">{tag}</Link>
      ))}
    </>
  );
};
