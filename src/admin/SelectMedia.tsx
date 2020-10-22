import React, { useEffect, useReducer, useState } from 'react';
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
import MediaManager from '../managers/MediaManager';
import LibraryManager from '../managers/LibraryManager';

type SelectMediaProps = {
  match: {
    params: {
      library: string;
    };
  };
};

const SelectMedia = (props: SelectMediaProps) => {
  const [mediaItems, setMediaItems] = useState<Array<MediaItem>>([]);
  const [library, updateLibrary] = useReducer<
    Library | null,
    | { action: 'ADD' | 'REMOVE'; media: string }
    | { action: 'UNSELECTALL' | 'SELECTALL' }
    | { action: 'INITIALIZE'; library: Library }
  >((state, update) => {
    if (update.action === 'INITIALIZE') return update.library;
    if (state === null) return state;
    switch (update.action) {
      case 'ADD':
        state.items.push(update.media);
        break;
      case 'REMOVE':
        state.items = state.items.filter(item => item !== update.media);
        break;
      case 'UNSELECTALL':
        state.items = [];
        break;
      case 'SELECTALL':
        state.items = mediaItems.map(x => x._id.toString());
        break;
    }
    LibraryManager.update(state);
    return state;
  }, null);

  const _isInLibrary = (media: string) =>
    library && library.items && library.items.length
      ? R.contains(media, library.items)
      : false;

  useEffect(
    () => {
      getLibrary();
      _getMediaItems();
    },
    [props.match.params.library]
  );

  function getLibrary() {
    if (props.match.params.library)
      LibraryManager.getById(props.match.params.library).then(library =>
        updateLibrary({ action: 'INITIALIZE', library })
      );
  }
  async function _getMediaItems() {
    MediaManager.list().then(setMediaItems);
  }

  return (
    <>
      <Row>
        <Col md="12" className="mb-2">
          <h2>{library ? library.name : ''}</h2>
        </Col>
      </Row>
      <Row>
        <Col md="12" className="mb-2">
          <ButtonGroup>
            {mediaItems &&
            mediaItems.length &&
            library &&
            mediaItems.length === library.items.length ? (
              <Button
                onClick={() => updateLibrary({ action: 'UNSELECTALL' })}
                color="danger"
              >
                Unselect All
              </Button>
            ) : (
              <Button
                onClick={() => updateLibrary({ action: 'SELECTALL' })}
                color="success"
              >
                Select All
              </Button>
            )}
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        {mediaItems.length ? (
          R.splitEvery(4, mediaItems).map(group =>
            group.map(({ _id, name, filename }) => (
              <Col sm="6" lg="3" key={_id.toString()} className="video-cell">
                <Card>
                  <img
                    src={`/${filename}.png`}
                    alt={`Thumbnail for file ${filename}`}
                  />

                  <CardBody>
                    <CardText>{name}</CardText>
                    {_isInLibrary(_id.toString()) ? (
                      <div
                        className="btn btn-danger"
                        onClick={() =>
                          updateLibrary({
                            action: 'REMOVE',
                            media: _id.toString()
                          })
                        }
                      >
                        <FaMinus />
                      </div>
                    ) : (
                      <div
                        className="btn btn-success"
                        onClick={() =>
                          updateLibrary({
                            action: 'ADD',
                            media: _id.toString()
                          })
                        }
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
    </>
  );
};

export default SelectMedia;
