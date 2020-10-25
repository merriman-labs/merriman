import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import UserManager from './managers/UserManager';

export const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setUser] = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // send the username and password to the server
    const response = await UserManager.create({ username, password });
    setUser({ user: response, initializing: false });
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
