import React, { Component } from 'react';
import * as R from 'ramda';
import {
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
  async _getLibraryInfo(_id) {
    const library = await (await fetch(`/api/library/details/${_id}`)).json();
    this.setState({ library });
  }
  async _getMediaItems() {
    const mediaItems = await (await fetch('/api/media-items')).json();
    this.setState({ mediaItems });
  }
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
    fetch('/api/admin/libraries/modify-media', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    }).then(() => this._getLibraryInfo(library));
  };
  _isInLibrary = media =>
    this.state.library.items && this.state.library.items.length
      ? R.contains(media, this.state.library.items)
      : false;
  _addMediaItem = media => () => {
    this._changeMediaItem('ADD', media);
  };
  _removeMediaItem = media => () => {
    this._changeMediaItem('DROP', media);
  };
  render() {
    return (
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
    );
  }
}

export default SelectMedia;
