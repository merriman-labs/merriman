import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from './hooks/useAuth';
import { useUserDispatchContext } from './hooks/useUserDispatchContext';
import UserManager from './managers/UserManager';

export const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useUserDispatchContext();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // send the username and password to the server
    await UserManager.create({ username, password });
    history.push('/signin');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label htmlFor="username">Username: </label>
      <input
        type="text"
        value={username}
        placeholder="enter a username"
        onChange={({ target }) => setUsername(target.value)}
      />
      <div>
        <label htmlFor="password">Password: </label>
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
};
