import React from 'react';
import { Redirect, RouterProps } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthenticatedApp } from './AuthenticatedApp';
import { useAuth } from './hooks/useAuth';
import { UnauthenticatedApp } from './UnauthenticatedApp';

const App = () => {
  const [user] = useAuth();

  return user.initializing ? (
    <UnauthenticatedApp />
  ) : (
    <AuthenticatedApp user={user.user} />
  );
};

export default App;
