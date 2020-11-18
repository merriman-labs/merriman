import React, { createContext } from 'react';
import { UserInfo } from '../server/models/User/UserInfo';

const context = createContext<UserInfo | null>(null);

export const UserContext = context;
export const Provider = context.Provider;

export default context;
