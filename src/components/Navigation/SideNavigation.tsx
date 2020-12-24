import React, { useState } from 'react';
import { FaAsterisk, FaBars, FaDiceFive, FaFileUpload, FaFolderOpen, FaHome, FaTags } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { c } from '../../util/classList';

export const SideNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={c({
        'side-nav list-group list-group-flush d-none d-md-block': true,
        open: isOpen
      })}
    >
      <div className="list-group-item toggle" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>
      <Link to="/" className="list-group-item">
        <FaHome className="mr-3" /><span>Home</span>
      </Link>
      <Link to="/libraries" className="list-group-item">
        <FaFolderOpen className="mr-3" /><span>Libraries</span>
      </Link>
      <Link to="/media/tags" className="list-group-item">
        <FaTags className="mr-3" /><span>Tags</span>
      </Link>
      <Link to="/media/recent" className="list-group-item">
        <FaAsterisk className="mr-3" /><span>Recent</span>
      </Link>
      <Link to="/media/upload" className="list-group-item">
        <FaFileUpload className="mr-3" /><span>Upload</span>
      </Link>
      <Link to="/random" className="list-group-item">
        <FaDiceFive className="mr-3" /><span>Random</span>
      </Link>
    </div>
  );
};
