import React from 'react';
import { FaEyeSlash, FaGlobe, FaLock } from 'react-icons/fa';
import { ItemVisibility } from '../constant/ItemVisibility';

const VisibilityIcon = (prop: { visibility: ItemVisibility }) => {
  switch (prop.visibility) {
    case ItemVisibility.private:
      return <FaLock />;
    case ItemVisibility.public:
      return <FaGlobe />;
    case ItemVisibility.unlisted:
      return <FaEyeSlash />;
  }
};

export const ItemVisibilityLabel = (props: {
  visibility: ItemVisibility;
  includeIcon?: boolean;
}) => {
  return (
    <>
      {props.includeIcon ? (
        <VisibilityIcon visibility={props.visibility} />
      ) : null}
      <span className="ml-1">{ItemVisibility[props.visibility]}</span>
    </>
  );
};
