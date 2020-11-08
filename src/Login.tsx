import React, { useState } from 'react';
import { Redirect, useHistory, withRouter } from 'react-router';
import { useAuth, useAuth1 } from './hooks/useAuth';
import AuthManager from './managers/AuthManager';

export const Login = withRouter(props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setUser] = useAuth1();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await AuthManager.login({ username, password });
    setUser({ user: response, action: 'LOGIN' });
    props.history.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username: </label>
      <input
        type="text"
        value={username}
        placeholder="enter a username"
        onChange={({ target }) => setUsername(target.value)}
      />
      <div>
        <label htmlFor="password">password: </label>
        <input
          type="password"
          value={password}
          placeholder="enter a password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
});
