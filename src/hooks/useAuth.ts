import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UserInfo } from '../../server/models/User/UserInfo';

type useAuthState =
  | {
      user?: UserInfo;
      initializing: true;
    }
  | {
      user: UserInfo;
      initializing: false;
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
