import React, { useState, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { MediaItem, Library } from '../server/models';
import { FaPencilAlt, FaFolderPlus, FaTimes, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import * as R from 'ramda';
import LibraryManager from './managers/LibraryManager';
import MediaManager from './managers/MediaManager';

type VideoProps = {
  video: string;
};
type VideoState = MediaItem | null;
type LibraryDropdownItem = Library & { isMember: boolean };

export const Video = (props: VideoProps) => {
  const [details, setDetails] = useState<VideoState>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [libraries, setLibraries] = useState<Array<LibraryDropdownItem>>([]);
  const { video } = props;
  window.scrollTo({ top: 0 });

  const getLibraries = async () => {
    const libs = (await LibraryManager.list()).map<LibraryDropdownItem>(
      lib => ({
        ...lib,
        isMember: lib.items.includes(props.video)
      })
    );
    setLibraries(libs);
  };

  const handleAddLibrary = async (library: Library) => {
    if (library === null || details === null) return;
    const items = library.items.includes(details._id.toString())
      ? library.items.filter(item => item !== details._id.toString())
      : library.items.concat(details._id.toString());
    await LibraryManager.update({
      ...library,
      items
    }).then(getLibraries);
  };

  useEffect(
    () => {
      const effect = async () => {
        const details = await MediaManager.details(props.video);
        setDetails(details);
      };
      effect();
    },
    [props.video]
  );

  return (
    <>
      <Col>
        {video ? (
          <video
            className="video-player"
            id="video-player"
            controls
            src={`/api/media/play/${video}`}
          >
            {details && details.webvtt ? (
              <track
                label="English"
                kind="subtitles"
                srcLang="en"
                src={`/api/media/captions/${video}`}
                default
              />
            ) : null}
          </video>
        ) : (
          <div />
        )}
      </Col>
      <Row>
        {details ? (
          <>
            <Col md="6" sm="12">
              <Link
                to={`/media/edit/${details._id.toString()}`}
                className="btn btn-outline-info btn-sm mr-2"
              >
                <FaPencilAlt />
              </Link>
              <strong>{details.name}</strong>
            </Col>
            <Col md="3" sm="12">
              {details.tags && details.tags.length ? (
                <>
                  {details.tags.map(tag => (
                    <Link
                      to={`/media/tag/${tag}`}
                      className="badge badge-pill badge-secondary mr-1"
                    >
                      {tag}
                    </Link>
                  ))}
                </>
              ) : null}
            </Col>
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
                  {libraries.map(library => (
                    <DropdownItem onClick={() => handleAddLibrary(library)}>
                      {library.isMember ? <FaTimes /> : <FaPlus />}{' '}
                      {library.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Col>
          </>
        ) : null}
      </Row>
    </>
  );
};
