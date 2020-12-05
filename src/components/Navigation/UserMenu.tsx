import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../hooks/useUserContext';
import { c } from '../../util/classList';
import { isAdmin } from '../../util/isAdmin';

export const UserMenu = () => {
  const user = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span
        className="nav-link dropdown-toggle"
        data-toggle="dropdown"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user?.username}
      </span>
      <div
        className={c({
          'dropdown-menu dropdown-menu-right': true,
          show: isOpen
        })}
      >
        {isAdmin(user) ? (
          <Link to="/admin" className="dropdown-item" href="#">
            Admin
          </Link>
        ) : null}
        <div className="dropdown-divider"></div>
        <Link to="/logout" className="dropdown-item" href="#">
          Log out
        </Link>
      </div>
    </>
  );
};
