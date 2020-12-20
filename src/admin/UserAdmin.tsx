import React, { useEffect, useState } from 'react';
import { UserRole } from '../constant/UserRole';
import { UserInfo } from '../../server/models/User/UserInfo';
import UserManager from '../managers/UserManager';
import { c } from '../util/classList';
import moment from 'moment';

export const UserAdmin = () => {
  const [users, setUsers] = useState<Array<UserInfo>>([]);

  const fetchUsers = () => UserManager.list().then(setUsers);
  const toggleIsActive = async (user: UserInfo) => {
    await UserManager.setIsActive(user._id.toString(), !user.isActive);
    fetchUsers();
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Roles</th>
                <th scope="col">Created</th>
                <th scope="col">Updated</th>
                <th scope="col">Last Login</th>
                <th scope="col">Is Active?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr>
                  <td>{user.username}</td>
                  <td>{user.roles.map((role) => UserRole[role]).join(', ')}</td>
                  <td>{moment(user.createdAt).format('MM/DD/YYYY HH:mm')}</td>
                  <td>{moment(user.updatedAt).format('MM/DD/YYYY HH:mm')}</td>
                  <td>{moment(user.lastLoginAt).format('MM/DD/YYYY HH:mm')}</td>
                  <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button
                      onClick={() => toggleIsActive(user)}
                      className={c({
                        btn: true,
                        'btn-outline-danger': user.isActive,
                        'btn-outline-success': !user.isActive
                      })}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
