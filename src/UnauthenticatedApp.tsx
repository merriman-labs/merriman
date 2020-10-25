import React from 'react';
import { Switch, Route } from 'react-router';
import { Login } from './Login';
import { SignUp } from './SignUp';

export const UnauthenticatedApp = () => (
  <Switch>
    <Route path="/signup" component={SignUp} exact />
    <Route path="/login" component={Login} exact />
  </Switch>
);
