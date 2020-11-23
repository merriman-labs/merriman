import React, { Component, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useHistory } from 'react-router';
import {} from 'reactstrap';

type SearchProps = { onUpdate: (term: string) => void };

export const SearchBox = () => {
  const [term, setTerm] = useState('');
  const history = useHistory();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      history.push(`/results?q=${term}`);
    }
  };
  return (
    <div className="form-inline my-2 my-lg-0">
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          onChange={(e) => setTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          value={term}
          placeholder="Find media on this server..."
        />
        <div className="input-group-append">
          <span className="btn btn-outline-primary">
            <FaSearch />
          </span>
        </div>
      </div>
    </div>
  );
};
