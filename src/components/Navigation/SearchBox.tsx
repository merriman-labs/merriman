import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useHistory } from 'react-router';

export const SearchBox = () => {
  const [term, setTerm] = useState('');
  const history = useHistory();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      history.push(`/results?q=${term}`);
    }
  };
  return (
    <div className="form-inline my-2 my-lg-0 w-md-25 w-sm-100">
      <div className="input-group flex-fill">
        <input
          type="search"
          className="form-control"
          onChange={(e) => setTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          value={term}
          placeholder="Search"
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
