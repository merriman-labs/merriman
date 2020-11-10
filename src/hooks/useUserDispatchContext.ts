import { useContext } from 'react';
import { UserDispatchContext } from '../context/UserContext';

export function useUserDispatchContext() {
  const ctx = useContext(UserDispatchContext);
  return ctx;
}
