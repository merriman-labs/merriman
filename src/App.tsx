import React from 'react';
import { withRouter } from 'react-router';
import './App.css';
import { AuthenticatedApp } from './AuthenticatedApp';
import { useUserContext } from './hooks/useUserContext';
import { UnauthenticatedApp } from './UnauthenticatedApp';

const App = withRouter(() => {
  const user = useUserContext();

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
});

export default App;
