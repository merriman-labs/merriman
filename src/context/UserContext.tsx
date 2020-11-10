import React, { createContext, Dispatch, useReducer } from 'react';
import { Props } from 'reactstrap/lib/Dropdown';
import { UserInfo } from '../../server/models/User/UserInfo';

export const UserContext = createContext<UserInfo | null>(null);
export const UserDispatchContext = createContext<
  Dispatch<LoginMessage | LogoutMessage>
>(() => null);

const userTxt = localStorage.getItem('user-info');
const initialUser = userTxt ? (JSON.parse(userTxt) as UserInfo) : null;

type LoginMessage = { user: UserInfo; action: 'LOGIN' };
type LogoutMessage = { action: 'LOGOUT' };

export const AuthReducer = (
  initialState: UserInfo | null,
  action: LoginMessage | LogoutMessage
) => {
  switch (action.action) {
    case 'LOGIN':
      localStorage.setItem('user-info', JSON.stringify(action.user))
      return action.user;
    case 'LOGOUT':
      localStorage.removeItem('user-info')
      return null;
  }
};

export const AuthProvider = (props: Props<any>) => {
  const [user, dispatch] = useReducer(AuthReducer, initialUser);
  console.log(user);
  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {props.children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};
