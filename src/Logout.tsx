import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { useUserDispatchContext } from './hooks/useUserDispatchContext';
import AuthManager from './managers/AuthManager';

export const Logout = withRouter((props) => {
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
