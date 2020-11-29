import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import moment from 'moment';
import { MediaItem } from '../../server/models';
import MediaManager from '../managers/MediaManager';
import { parseQueryString } from '../util/parseQueryString';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Results = () => {
  const params = useLocation();
  const query = parseQueryString<'q'>(params.search);
  const [results, setResults] = useState<Array<MediaItem>>([]);

  useEffect(() => {
    MediaManager.search(query.q).then(setResults);
  }, [params.search]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          {results.map((result) => (
            <Link className="media mt-3" to={`/media/${result._id}`}>
              <img
                className="mr-3"
                src={`/${result.filename}.png`}
                alt={`Thumbnail for ${result.name}`}
              />
              <div className="media-body">
                <h5 className="mt-0">{result.name}</h5>
                <p className="font-weight-normal">
                  {result.views} views • {moment(result.createdAt).fromNow()}
                </p>
                <p className="font-weight-lighter"><FaUserCircle /> {result.user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
