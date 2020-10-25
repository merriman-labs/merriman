import { createContext } from 'react';
import { UserInfo } from '../server/models/User/UserInfo';

const context = createContext<UserInfo | null>(null);

export default context;
