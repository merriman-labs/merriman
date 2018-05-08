import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">node media server</NavbarBrand>
        <Nav>
          <NavItem>
            <Link to="/videos">Video Libraries</Link>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
};

export default Navigation;
