import React, { useState } from 'react';
import {
  FaHome,
  FaFolderOpen,
  FaAsterisk,
  FaFileUpload,
  FaDiceFive
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Collapse, NavbarToggler } from 'reactstrap';
import { SearchBox } from './SearchBox';

export const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-md-none">
      <a className="navbar-brand" href="#">
        Merriman
      </a>
      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />

      <Collapse navbar isOpen={isOpen}>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <FaHome className="mr-3" />
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/libraries" className="nav-link">
              <FaFolderOpen className="mr-3" />
              <span>Libraries</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/media/recent" className="nav-link">
              <FaAsterisk className="mr-3" />
              <span>Recent</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/media/upload" className="nav-link">
              <FaFileUpload className="mr-3" />
              <span>Upload</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/random" className="nav-link">
              <FaDiceFive className="mr-3" />
              <span>Random</span>
            </Link>
          </li>
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <SearchBox />
        </form>
      </Collapse>
    </nav>
  );
};
