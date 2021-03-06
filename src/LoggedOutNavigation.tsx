import React, { Component } from 'react';
import {
  Collapse,
  NavbarToggler,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';

type NavigationProps = {};
type NavigationState = { open: boolean };

class LoggedOutNavigation extends Component<NavigationProps, NavigationState> {
  constructor(props: NavigationProps) {
    super(props);
    this.state = { open: false };
  }
  toggle = () => {
    this.setState(({ open }) => ({ open: !open }));
  };
  render() {
    return (
      <div>
        <Navbar color="dark" expand="md" dark>
          <NavbarBrand href="/">Merriman</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.open} className="ml-auto" navbar>
            <Nav>
              <NavItem>
                <NavLink href="/login">Log In</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/signup">Sign Up</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default LoggedOutNavigation;
