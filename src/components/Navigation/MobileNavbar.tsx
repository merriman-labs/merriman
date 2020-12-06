import React, { useEffect, useState } from 'react';
import {
  FaHome,
  FaFolderOpen,
  FaAsterisk,
  FaFileUpload,
  FaDiceFive,
  FaSignOutAlt
} from 'react-icons/fa';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler } from 'reactstrap';
import { SearchBox } from './SearchBox';

export const MobileNavbar = () => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [history.location]);
  return (
    <Navbar
      color="dark"
      expand="lg"
      dark
      className="d-md-none"
    >
      <a className="navbar-brand" href="/">
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
        <div className="dropdown-divider"></div>
        <Link to="/logout" className="dropdown-item"><FaSignOutAlt /> Log out</Link>
      </Collapse>
    </Navbar>
  );
};
