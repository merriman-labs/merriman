import React, { useState, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { MediaItem, Library } from '../server/models';
import { FaPencilAlt, FaFolderPlus, FaTimes, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from 'reactstrap/lib/Button';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import * as R from 'ramda';
import LibraryManager from './managers/LibraryManager';

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

  const handleAddLibrary = async (library: string) => {
    await LibraryManager.addMedia(props.video, library);

  };

  useEffect(
    () => {
      const effect = async () => {
        if (!libraries.length) {
          const libs = (await LibraryManager.list()).map<LibraryDropdownItem>(
            lib => ({
              ...lib,
              isMember: lib.items.includes(props.video)
            })
          );
          setLibraries(libs);
        }

        const details = await (await fetch(
          `/api/media/detail/${props.video}`
        )).json();
        setDetails(details);
      };
      effect();
    },
    [props.video, libraries.length]
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
                    <Link to={`/media/tag/${tag}`} className="badge badge-pill badge-secondary mr-1">
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
                  {libraries.map(({ name, isMember, _id }) => (
                    <DropdownItem
                      onClick={() =>
                        handleAddLibrary(_id.toString())
                      }
                    >
                      {isMember ? <FaTimes /> : <FaPlus />} {name}
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
