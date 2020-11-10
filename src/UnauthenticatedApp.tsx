import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { AuthProvider } from './context/UserContext';
import LoggedOutNavigation from './LoggedOutNavigation';
import { Login } from './Login';
import { SignUp } from './SignUp';

export const UnauthenticatedApp = () => (
  <>
    <LoggedOutNavigation />
    <Switch>
      <Route path="/signup" component={SignUp} exact />
      <Route path="/login" component={Login} exact />
      <Route path="/">
        <Redirect to="/login" />
      </Route>
    </Switch>
  </>
);
