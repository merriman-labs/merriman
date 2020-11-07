import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import { useAuth } from './hooks/useAuth';
import AuthManager from './managers/AuthManager';

export const Logout = () => {
  const [, set] = useAuth();
  useEffect(() => {
    const effect = async () => {
      await AuthManager.logout();
      set({ initializing: true });
    };
    effect();
  });
  return <Redirect to="/login" />;
};
