import React, { Component } from 'react';
import * as R from 'ramda';
import {
  Button,
  ButtonGroup,
  Col,
  Card,
  CardText,
  CardBody,
  Row
} from 'reactstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MediaItem, Library } from '../../server/models';
import Bluebird from 'bluebird';

type SelectMediaProps = {
  match: {
    params: {
      library: string;
    };
  };
};
type SelectMediaState = {
  library: Library | null;
  mediaItems: Array<MediaItem> | null;
};

class SelectMedia extends Component<SelectMediaProps, SelectMediaState> {
  constructor(props: SelectMediaProps) {
    super(props);
    this.state = { library: null, mediaItems: [] };
  }
  _getLibraryInfo = async () => {
    const _id = this.props.match.params.library;
    const library = await (await fetch(`/api/library/details/${_id}`)).json();
    this.setState({ library });
  };
  _getMediaItems = async () => {
    const mediaItems = await (await fetch('/api/media')).json();
    console.log(mediaItems);
    this.setState({ mediaItems: R.sortBy(x => x.created, mediaItems) });
  };
  componentDidMount() {
    const {
      match: {
        params: { library }
      }
    } = this.props;
    this._getLibraryInfo();
    this._getMediaItems();
  }
  _changeMediaItem = (action: string, media: string) => {
    const library = this.props.match.params.library;
    const data = {
      action,
      library,
      media
    };
    return fetch('/api/admin/libraries/modify-media', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
  };
  _isInLibrary = (media: string) =>
    this.state.library &&
    this.state.library.items &&
    this.state.library.items.length
      ? R.contains(media, this.state.library.items)
      : false;
  _addMediaItem = (media: string) => () => {
    return this._changeMediaItem('ADD', media).then(this._getLibraryInfo);
  };
  _removeMediaItem = (media: string) => () => {
    return this._changeMediaItem('DROP', media).then(this._getLibraryInfo);
  };
  _selectAll = async () => {
    const ids = R.pluck('_id', this.state.mediaItems as Array<
      MediaItem
    >) as Array<string>;
    Bluebird.mapSeries(ids.filter(x => !this._isInLibrary(x)), x =>
      this._changeMediaItem('ADD', x)
    ).then(this._getLibraryInfo);
  };
  _unselectAll = async () => {
    const ids = R.pluck('_id', this.state.mediaItems as Array<
      MediaItem
    >) as Array<string>;
    Promise.all(
      ids
        .filter(x => !this._isInLibrary(x))
        .map(x => this._changeMediaItem('DROP', x))
    ).then(this._getLibraryInfo);
  };
  render() {
    return [
      <Row>
        <Col md="12" className="mb-2">
          <h2>{this.state.library ? this.state.library.name : ''}</h2>
        </Col>
      </Row>,
      <Row>
        <Col md="12" className="mb-2">
          <ButtonGroup>
            {this.state.mediaItems &&
            this.state.mediaItems.length &&
            this.state.library &&
            this.state.mediaItems.length === this.state.library.items.length ? (
              <Button onClick={this._unselectAll} color="danger">
                Unselect All
              </Button>
            ) : (
              <Button onClick={this._selectAll} color="success">
                Select All
              </Button>
            )}
          </ButtonGroup>
        </Col>
      </Row>,
      <Row>
        {this.state.mediaItems && this.state.mediaItems.length ? (
          R.splitEvery(4, this.state.mediaItems).map(group =>
            group.map(({ _id, name, filename }) => (
              <Col sm="6" lg="3" key={_id} className="video-cell">
                <Card>
                  <img
                    src={`/${filename}.png`}
                    alt={`Thumbnail for file ${filename}`}
                  />

                  <CardBody>
                    <CardText>{name}</CardText>
                    {this._isInLibrary(_id) ? (
                      <div
                        className="btn btn-danger"
                        onClick={this._removeMediaItem(_id)}
                      >
                        <FaMinus />
                      </div>
                    ) : (
                      <div
                        className="btn btn-success"
                        onClick={this._addMediaItem(_id)}
                      >
                        <FaPlus />
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            ))
          )
        ) : (
          <div />
        )}
      </Row>
    ];
  }
}

export default SelectMedia;
