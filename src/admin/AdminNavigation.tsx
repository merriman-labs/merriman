import * as R from 'ramda';
import React, { useState } from 'react';
import {
  Collapse,
  NavbarToggler,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';

const AdminNavigation = () => {
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen(R.not);
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
            <NavItem>
              <NavLink href="/admin/migrate-media">Migrate Media</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/admin/request-logs">Request Logs</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/admin/users">Users</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default AdminNavigation;
