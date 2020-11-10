import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export function useUserContext() {
  const ctx = useContext(UserContext);
  return ctx;
}
