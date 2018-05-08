import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';

const Navigation = ({ children }) => {
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">node media server</NavbarBrand>
        <Nav>
          <NavItem>{children}</NavItem>
        </Nav>
      </Navbar>
    </div>
  );
};

export default Navigation;
