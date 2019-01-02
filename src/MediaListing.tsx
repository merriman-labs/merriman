import React, { Component } from 'react';
import { Col, ButtonGroup, Button } from 'reactstrap';
import { MediaItem } from '../server/models';
import VideoList from './VideoList';
import VideoGrid from './VideoGrid';

type ViewType = 'LIST' | 'GRID';
type MediaListingProps = {
  media: Array<MediaItem>;
  library: string;
};
type MediaListingState = {
  selectedView: ViewType;
};

export default class MediaListing extends Component<
  MediaListingProps,
  MediaListingState
> {
  constructor(props: MediaListingProps) {
    super(props);
    this.state = { selectedView: 'LIST' };
  }

  render() {
    return [
      <div className="col-md-12 my-2">
        <Button color="primary" onClick={this._toggleView}>
          <span className="text-capitalize">
            {this._getNextViewName(this.state.selectedView).toLowerCase()}
          </span>
        </Button>
      </div>,
      this._getView(this.state.selectedView)(this.props)
    ];
  }

  private _getNextViewName(view: string) {
    return view === 'LIST' ? 'GRID' : 'LIST';
  }

  private _toggleView = () => {
    this.setState(({ selectedView }) => ({
      selectedView: this._getNextViewName(selectedView)
    }));
  };

  private _getView(view: ViewType) {
    switch (view) {
      case 'GRID':
        return VideoGrid;
      case 'LIST':
      default:
        return VideoList;
    }
  }
}
