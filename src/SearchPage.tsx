import React, { Component } from 'react';
import Search from './Search';
import { MediaItem } from '../server/models';
import SearchResults from './SearchResults';
import MediaManager from './managers/MediaManager';

type SearchPageProps = {};
type SearchPageState = {
  results: Array<MediaItem>;
};

class SearchPage extends Component<SearchPageProps, SearchPageState> {
  constructor(props: SearchPageProps) {
    super(props);
    this.state = { results: [] };
  }
  render() {
    return [
      <Search onUpdate={this._getResults} />,
      this.state.results.length ? (
        <SearchResults results={this.state.results} />
      ) : (
        <div />
      )
    ];
  }
  private _getResults = async (term: string): Promise<void> => {
    if (!term) {
      return this.setState({ results: [] });
    }
    const results = await MediaManager.search(term);

    this.setState({ results });
  };
}

export default SearchPage;
