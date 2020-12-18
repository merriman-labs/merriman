import React, { useState, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { FaFolderPlus, FaTimes, FaPlus } from 'react-icons/fa';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import * as R from 'ramda';
import { Library, MediaItem } from '../../../server/models';
import LibraryManager from '../../managers/LibraryManager';
import MediaManager from '../../managers/MediaManager';
import { MediaSwitch } from './MediaSwitch';
import moment from 'moment';

type MediaPlayerProps = {
  id: string;
  onFinished?: (media: MediaItem) => void;
};
type MediaPlayerState = MediaItem | null;
type LibraryDropdownItem = Library & { isMember: boolean };

export const MediaPlayer = (props: MediaPlayerProps) => {
  const { id, onFinished = () => {} } = props;
  const [details, setDetails] = useState<MediaPlayerState>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [libraries, setLibraries] = useState<Array<LibraryDropdownItem>>([]);
  const [newLibraryName, setNewLibraryName] = useState<string>('');

  const getLibraries = async () => {
    const libs = (await LibraryManager.list()).map<LibraryDropdownItem>(
      (lib) => ({
        ...lib,
        isMember: lib.items.some((item) => item.id === id)
      })
    );
    setLibraries(libs);
  };

  const handleLibraryClick = async (library: Library) => {
    if (library === null || details === null) return;

    const method = library.items.some((item) => item.id === id)
      ? LibraryManager.removeMedia
      : LibraryManager.addMedia;

    await method(library._id.toString(), details._id.toString()).then(
      getLibraries
    );
  };

  useEffect(() => {
    const effect = async () => {
      await getLibraries();
      const details = await MediaManager.details(id);
      setDetails(details);
    };
    effect();
  }, [id]);

  const handleLibraryKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await LibraryManager.create({ name: newLibraryName });
      setNewLibraryName('');
      await getLibraries();
    }
  };

  return (
    <>
      <Col>
        {details ? (
          <MediaSwitch media={details} onFinished={onFinished} />
        ) : null}
      </Col>
      <Row>
        {details ? (
          <Col md="6" sm="12">
            <strong>{details.name}</strong>
          </Col>
        ) : null}
      </Row>
      <Row>
        {details === null ? null : (
          <>
            <Col md="3" sm="12">
              <p className="mt-2">
                {details.views} views |{' '}
                {moment(details.createdAt).format('MMM D, YYYY')}
              </p>
            </Col>
            <Col md="6" sm="12" />
            <Col md="3" sm="12">
              <Dropdown
                isOpen={dropdownOpen}
                toggle={() => setDropdownOpen(R.not)}
              >
                <DropdownToggle color="secondary" outline>
                  <FaFolderPlus />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Add to library</DropdownItem>
                  <div className="dropdown-item">
                    <div className="form-group">
                      <input
                        type="text"
                        id="new-library"
                        className="form-control"
                        placeholder="Create new library"
                        value={newLibraryName}
                        onChange={(e) => setNewLibraryName(e.target.value)}
                        onKeyPress={handleLibraryKeyPress}
                      />
                    </div>
                  </div>
                  {libraries.map((library) => (
                    <DropdownItem
                      onClick={() => handleLibraryClick(library)}
                      key={library._id.toString()}
                    >
                      {library.isMember ? <FaTimes /> : <FaPlus />}{' '}
                      {library.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};
