import {
  Dispatch,
  SetStateAction,
  useEffect,
  useReducer,
  useState
} from 'react';
import { UserInfo } from '../../server/models/User/UserInfo';
import AuthManager from '../managers/AuthManager';

type useAuthState =
  | {
      user?: UserInfo;
      initializing: true;
    }
  | {
      user: UserInfo;
      initializing: false;
    };

type Credentials = { username: string; password: string };
type LoginMessage = { user: UserInfo; action: 'LOGIN' };
type LogoutMessage = { action: 'LOGOUT' };

export const useAuth1 = (): [
  UserInfo | undefined,
  Dispatch<LoginMessage | LogoutMessage>
] => {
  const savedUser = localStorage.getItem('user-info');
  const user = savedUser ? (JSON.parse(savedUser) as UserInfo) : undefined;
  const [state, setState] = useReducer<
    UserInfo | undefined,
    LoginMessage | LogoutMessage
  >((state, update) => {
    switch (update.action) {
      case 'LOGIN':
        localStorage.setItem('user-info', JSON.stringify(update.user));
        return update.user;
      case 'LOGOUT':
        localStorage.removeItem('user-info');
        return;
    }
  }, user);

  return [state, setState];
};

export const useAuth = (): [
  useAuthState,
  Dispatch<SetStateAction<useAuthState>>
] => {
  const [state, setState] = useState<useAuthState>(() => {
    const data = localStorage.getItem('user-info');

    const user: useAuthState =
      data === null ? { initializing: true } : JSON.parse(data);
    return user;
  });

  useEffect(
    () => {
      const user = JSON.stringify(state);
      localStorage.setItem('user-info', user);
    },
    [state]
  );

  return [state, setState];
};
