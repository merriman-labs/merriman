import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { useAuth1 } from './hooks/useAuth';
import AuthManager from './managers/AuthManager';

export const Logout = withRouter((props) => {
  const [, set] = useAuth1();
  useEffect(() => {
    const effect = async () => {
      await AuthManager.logout();
      set({ action: 'LOGOUT' });
      props.history.push('/login');
    };
    effect();
  });
  return <h1>Logging out...</h1>;
});
