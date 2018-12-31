import React, { Component } from 'react';
import {} from 'reactstrap';
import { Link } from 'react-router-dom';
import { MediaItem } from '../server/models';

type SearchResultsProps = { results: Array<MediaItem> };

const SearchResults = (props: SearchResultsProps) => {
  return (
    <div className="list-group">
      {props.results.map(({ _id, name }) => (
        <Link to={`/media/${_id}`} className="list-group-item">
          {name}
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;
