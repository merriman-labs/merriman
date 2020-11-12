import * as R from 'ramda';
import React, { Component, useState } from 'react';
import {
  Collapse,
  NavbarToggler,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { useUserContext } from '../hooks/useUserContext';
import { isAdmin } from '../util/isAdmin';

type NavigationProps = {};
type NavigationState = { open: boolean };

const AdminNavigation = () => {
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen(R.not);
  const user = useUserContext();

  return (
    <div>
      <Navbar color="dark" expand="md" dark>
        <NavbarBrand href="/">Merriman</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} className="ml-auto" navbar>
          <Nav>
            <NavItem>
              <NavLink href="/admin">Admin</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/admin/register-media">Register Media</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default AdminNavigation;
