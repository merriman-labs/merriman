import React from 'react';
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
