import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import { FaFolderPlus, FaTimes, FaPlus, FaPencilAlt } from 'react-icons/fa';
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
import { Link } from 'react-router-dom';
import { useUserContext } from '../../hooks/useUserContext';

type MediaPlayerProps = {
  id: string;
  onFinished?: (media: MediaItem) => void;
};
type MediaPlayerState = MediaItem | null;
type LibraryDropdownItem = Library & { isMember: boolean };

export const MediaPlayer = (props: MediaPlayerProps) => {
  const { id, onFinished = () => {} } = props;
  const user = useUserContext();
  const [details, setDetails] = useState<MediaPlayerState>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [libraries, setLibraries] = useState<Array<LibraryDropdownItem>>([]);
  const [newLibraryName, setNewLibraryName] = useState<string>('');

  const getLibraries = useCallback(async () => {
    const libs = (await LibraryManager.list()).map<LibraryDropdownItem>(
      (lib) => ({
        ...lib,
        isMember: lib.items.some((item) => item.toString() === id.toString())
      })
    );
    setLibraries(libs);
  }, [setLibraries, id]);

  const handleLibraryClick = async (library: Library) => {
    if (library === null || details === null) return;

    const method = library.items.some((item) => item.toString() === id)
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
    window.scrollTo(0, 0);
  }, [id, getLibraries]);

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
          <>
            <Col md="6" sm="12">
              <strong>{details.name}</strong>
            </Col>

            <Col md="3" sm="12"></Col>
            <Col md="3" sm="12">
              {details.tags.map((tag) => (
                <Link to={`/media/tag/${tag}`} className="mr-1" key={tag}>
                  #{tag}
                </Link>
              ))}
            </Col>
          </>
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
            <Col md="3" sm="12" className="mb-3">
              <Dropdown
                className="d-inline-block"
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
              {details.user.userId.toString() === user?._id.toString() ? (
                <Link
                  to={`/media/edit/${details._id}`}
                  className="btn btn-outline-secondary"
                  title="edit details"
                >
                  <FaPencilAlt />
                </Link>
              ) : null}
            </Col>
          </>
        )}
      </Row>
    </>
  );
};
