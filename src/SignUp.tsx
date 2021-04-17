import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { useUserDispatchContext } from './hooks/useUserDispatchContext';
import UserManager from './managers/UserManager';

export const SignUp = () => {
  const dispatch = useUserDispatchContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    UserManager.create({ username, password })
      .then((user) => {
        dispatch(user);
        history.push('/');
      })
      .catch((error) => {
        error.errors.forEach((err: string) => toast(err));
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="card-title">Create User</div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    value={username}
                    placeholder="enter your username"
                    className="form-control"
                    onChange={({ target }) => setUsername(target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    value={password}
                    placeholder="enter your password"
                    className="form-control"
                    onChange={({ target }) => setPassword(target.value)}
                  />
                </div>
                <button className="btn btn-outline-primary" type="submit">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
