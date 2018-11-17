import React, { Component } from 'react';
import * as R from 'ramda';
import {
  Button,
  ButtonGroup,
  Col,
  Card,
  CardImg,
  CardImgOverlay,
  CardText,
  CardBody,
  CardFooter,
  Row
} from 'reactstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

class SelectMedia extends Component {
  constructor(props) {
    super(props);
    this.state = { library: null, mediaItems: [] };
  }
  _getLibraryInfo = async () => {
    const _id = this.props.match.params.library;
    const library = await (await fetch(`/api/library/details/${_id}`)).json();
    this.setState({ library });
  };
  _getMediaItems = async () => {
    const mediaItems = await (await fetch('/api/media-items')).json();
    this.setState({ mediaItems });
  };
  componentDidMount() {
    const {
      match: {
        params: { library }
      }
    } = this.props;
    this._getLibraryInfo(library);
    this._getMediaItems();
  }
  _changeMediaItem = (action, media) => {
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
  _isInLibrary = media =>
    this.state.library.items && this.state.library.items.length
      ? R.contains(media, this.state.library.items)
      : false;
  _addMediaItem = media => () => {
    const library = this.props.match.params.library;
    return this._changeMediaItem('ADD', media).then(this._getLibraryInfo);
  };
  _removeMediaItem = media => () => {
    const library = this.props.match.params.library;
    return this._changeMediaItem('DROP', media).then(this._getLibraryInfo);
  };
  _selectAll = async () => {
    const ids = R.pluck('_id', this.state.mediaItems);
    const responses = await Promise.all(
      ids.map(x => this._changeMediaItem('ADD', x))
    );
    this._getLibraryInfo();
  };
  _unselectAll = async () => {
    const ids = R.pluck('_id', this.state.mediaItems);
    const responses = await Promise.all(
      ids.map(x => this._changeMediaItem('DROP', x))
    );
    this._getLibraryInfo();
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
            {this.state.mediaItems.length &&
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
        {this.state.mediaItems.length ? (
          R.splitEvery(4, this.state.mediaItems).map(group =>
            group.map(({ _id, name, filename }, i) => (
              <Col sm="6" lg="3" key={i} className="video-cell">
                <Card>
                  <img src={`/${filename}.png`} />

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
