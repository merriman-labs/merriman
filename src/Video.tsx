import React, { useState, useEffect } from 'react';
import { Col, Button, Row } from 'reactstrap';
import { MediaItem } from '../server/models';
import {
  FaPencilAlt,
  FaCheck,
  FaCog,
  FaTimesCircle,
  FaTimes
} from 'react-icons/fa';

type VideoProps = {
  video: string;
};
type VideoState = MediaItem | null;

const update = async (item: MediaItem) => {
  await fetch('/api/media/', {
    method: 'PUT',
    body: JSON.stringify(item),
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const Video = (props: VideoProps) => {
  const [details, setDetails] = useState<VideoState>(null);
  const [editing, setEdit] = useState(false);
  const [editingTags, setEditingTags] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const { video } = props;
  window.scrollTo({ top: 0 });

  const handleNameChange = (name: string) => {
    setDetails(det => (det === null ? null : { ...det, name }));
  };

  const handleTagAdd = async (tag: string) => {
    if (details === null || tag === '') return;
    const tags = details.tags ? details.tags.concat(tag) : [tag];
    const item = { ...details, tags };
    setDetails(item);
    setCurrentTag('');
    await update(item);
  };

  const handleTagRemove = async (tag: string) => {
    if (details === null) return;
    const tags = details.tags.filter(t => t !== tag);
    const item = { ...details, tags };
    setDetails(item);
    await update(item);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.persist();
    if (event.key === 'Enter') {
      handleTagAdd(currentTag);
    }
  };

  useEffect(
    () => {
      const effect = async () => {
        const details = await (await fetch(
          `/api/media/detail/${props.video}`
        )).json();
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
          />
        ) : (
          <div />
        )}
      </Col>
      <Row>
        {details ? (
          <>
            <Col md="6" sm="12">
              {editing ? (
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    value={details.name}
                    onChange={x => handleNameChange(x.target.value)}
                  />
                  <div className="input-group-append">
                    <Button
                      color="success"
                      outline
                      title="save changes"
                      onClick={() => {
                        setEdit(!editing);
                        update(details);
                      }}
                    >
                      <FaCheck />
                    </Button>
                    <Button
                      color="danger"
                      outline
                      title="cancel title edit"
                      onClick={() => setEdit(false)}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    color="info"
                    outline
                    size="sm"
                    className="mr-2"
                    title="edit title"
                    onClick={() => setEdit(true)}
                  >
                    <FaPencilAlt />
                  </Button>
                  <strong>{details.name}</strong>
                </>
              )}
            </Col>
            <Col md="6" sm="12">
              {details.tags && details.tags.length ? (
                <>
                  {details.tags.map(tag => (
                    <span className="badge badge-pill badge-secondary mr-1">
                      {tag}{' '}
                      <FaTimesCircle onClick={() => handleTagRemove(tag)} />
                    </span>
                  ))}
                </>
              ) : null}
              {editingTags ? (
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    value={currentTag}
                    onChange={x => setCurrentTag(x.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <Button
                    color="danger"
                    size="sm"
                    outline
                    onClick={() => setEditingTags(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  color="info"
                  size="sm"
                  outline
                  onClick={() => setEditingTags(true)}
                >
                  <FaCog /> Edit tags
                </Button>
              )}
            </Col>
          </>
        ) : null}
      </Row>
    </>
  );
};
