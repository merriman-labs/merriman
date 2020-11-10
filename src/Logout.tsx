import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { useAuth1 } from './hooks/useAuth';
import { useUserDispatchContext } from './hooks/useUserDispatchContext';
import AuthManager from './managers/AuthManager';

export const Logout = withRouter((props) => {
  const [, set] = useAuth1();
  const dispatch = useUserDispatchContext();
  useEffect(() => {
    const effect = async () => {
      await AuthManager.logout();
      dispatch({ action: 'LOGOUT' });
      props.history.push('/login');
    };
    effect();
  });
  return <h1>Logging out...</h1>;
});
