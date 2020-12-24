import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TagStatistic } from '../../../server/ViewModels';
import MediaManager from '../../managers/MediaManager';

export const TagsPage = () => {
  const [tags, setTags] = useState<Array<TagStatistic>>([]);

  useEffect(() => {
    MediaManager.tags().then(({ tags }) => setTags(tags));
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          {tags.map((result) => (
            <Link className="mt-3 btn btn-primary mr-3" to={`/media/tag/${result.tag}`} key={result.tag}>
              {result.tag}{' '}
              <span className="badge badge-light">{result.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
