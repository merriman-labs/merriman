import React, { Component } from 'react';
import { FaSearch } from 'react-icons/fa';
import {} from 'reactstrap';

type SearchProps = { onUpdate: ((term: string) => void) };

class Search extends Component<SearchProps, {}> {
  render() {
    return (
      <div className="input-group mt-4">
        <input
          type="search"
          className="form-control"
          onChange={this._handleInputChange}
          placeholder="Find media on this server..."
        />
        <div className="input-group-append">
          <span className="btn btn-outline-primary">
            <FaSearch />
          </span>
        </div>
      </div>
    );
  }
  private _handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const searchTerm = event.target.value;
    this.props.onUpdate(searchTerm);
  };
}

export default Search;
