import React, { createContext, Dispatch, useEffect, useState } from 'react';
import { Props } from 'reactstrap/lib/Dropdown';
import { UserInfo } from '../../server/models/User/UserInfo';
import UserManager from '../managers/UserManager';
import { CircleLoader } from 'react-spinners';

export const UserContext = createContext<UserInfo | null>(null);
export const UserDispatchContext = createContext<Dispatch<UserInfo | null>>(
  () => null
);

export const AuthProvider = (props: Props<any>) => {
  const [user, dispatch] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const effect = async () => {
      const usr = await UserManager.currentUser();
      if (usr) {
        dispatch(usr);
      }
      setLoading(false);
    };
    effect();
  }, []);

  if (loading) {
    return (
      <div className="d-inline-block mx-auto mt-5">
        <CircleLoader color="#36D7B7" />
      </div>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {props.children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};
