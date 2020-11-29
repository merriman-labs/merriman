import * as R from 'ramda';
import React, { useState } from 'react';
import { Collapse, NavbarToggler, Navbar, Nav } from 'reactstrap';
import { SearchBox } from './SearchBox';
import { UserMenu } from './UserMenu';

const Navigation = () => {
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen(R.not);

  return (
    <Navbar color="dark" expand="md" dark>
      <a className="navbar-brand d-inline-block d-md-none" href="/">
        Merriman
      </a>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="d-sm-flex justify-content-between flex-fill">
          <a className="navbar-brand d-none d-md-flex" href="/">
            Merriman
          </a>
          <SearchBox />
          <div className="nav-item dropdown">
            <UserMenu />
          </div>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Navigation;
