import * as R from 'ramda';
import React, { Component, useState } from 'react';
import {
  Collapse,
  NavbarToggler,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { useUserContext } from './hooks/useUserContext';
import { isAdmin } from './util/isAdmin';

type NavigationProps = {};
type NavigationState = { open: boolean };

const Navigation = () => {
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
              <NavLink href="/media/new">New</NavLink>
            </NavItem>
            {isAdmin(user) ? (
              <NavItem>
                <NavLink href="/admin">Admin</NavLink>
              </NavItem>
            ) : null}

            <NavItem>
              <NavLink href="/random">Random</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/logout">Logout</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
