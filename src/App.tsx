import React from 'react';
import { useHistory } from 'react-router';
import './App.css';
import { AuthenticatedApp } from './AuthenticatedApp';
import { useAuth, useAuth1 } from './hooks/useAuth';
import { UnauthenticatedApp } from './UnauthenticatedApp';

const App = () => {
  const [user] = useAuth1();

  return user ? (
    <AuthenticatedApp user={user} />
  ) : (
    <UnauthenticatedApp />
  );
};

export default App;
