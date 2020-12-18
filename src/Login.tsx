import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useUserDispatchContext } from './hooks/useUserDispatchContext';
import AuthManager from './managers/AuthManager';

export const Login = withRouter(props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useUserDispatchContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await AuthManager.login({ username, password });
    dispatch(response);
    props.history.push('/');
  };

  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="card-title">Please log in</div>
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
});
