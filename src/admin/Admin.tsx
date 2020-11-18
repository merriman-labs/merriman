import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import Navigation from '../Navigation';

export const Admin = (props: RouteComponentProps) => {
  const path = props.match.path;
  console.log(path);
  return (
    <>
      <Navigation />
      <Switch>
        <Route path={`${path}/select`} component={() => <h1>select</h1>} />
      </Switch>
    </>
  );
};
