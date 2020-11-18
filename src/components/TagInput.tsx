import React, { useState } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

type TagInputProps = {
  tags?: Array<string>;
  updateTags: (tags: Array<string>) => void;
};

export const TagInput = (props: TagInputProps) => {
  const [currentTag, setCurrentTag] = useState('');
  const [tagList, setTags] = useState<Array<string>>(props.tags || []);
  const handleTagAdd = async (tag: string) => {
    const tags = tagList ? tagList.concat(tag) : [tag];
    setTags(tags);
    props.updateTags(tags);
    setCurrentTag('');
  };

  const handleTagRemove = async (tag: string) => {
    const tags = tagList.filter((t) => t !== tag);
    setTags(tags);
    props.updateTags(tags);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.persist();
    if (event.key === 'Enter') {
      handleTagAdd(currentTag);
    }
  };
  return (
    <>
      {tagList.map((tag) => (
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
        />
      </div>
    </>
  );
};
