import React, { useState } from 'react';
import { FaPlus, FaTimesCircle } from 'react-icons/fa';

type TagInputProps = {
  tags: Array<string>;
  updateTags: (tags: Array<string>) => void;
  disabled?: boolean;
};

export const TagInput = (props: TagInputProps) => {
  const [currentTag, setCurrentTag] = useState('');
  const handleTagAdd = async () => {
    const tags = props.tags ? props.tags.concat(currentTag) : [currentTag];
    props.updateTags(tags);
    setCurrentTag('');
  };

  const handleTagRemove = async (tag: string) => {
    const tags = props.tags.filter((t) => t !== tag);
    props.updateTags(tags);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.persist();
    if (event.key === 'Enter') {
      handleTagAdd();
    }
  };
  return (
    <>
      {props.tags.map((tag) => (
        <span className="badge badge-pill badge-secondary mr-1">
          {tag} <FaTimesCircle onClick={() => handleTagRemove(tag)} />
        </span>
      ))}
      <div className="input-group mt-2">
        <input
          className="form-control"
          type="text"
          value={currentTag}
          placeholder="type here and press enter to add a tag"
          onChange={(x) => setCurrentTag(x.target.value)}
          onKeyDown={handleKeyPress}
          disabled={props.disabled}
        />
        <div className="input-group-append">
          <button className="btn btn-outline-primary" onClick={handleTagAdd}>
            <FaPlus />
          </button>
        </div>
      </div>
    </>
  );
};
