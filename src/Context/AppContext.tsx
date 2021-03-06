/*
 * File: AppContext.tsx
 * Project: GU RN Starter Kit
 * File Created: Sunday, 14th July 2019 1:12:15 am
 * Author: Umar Aamer (umaraamer@gmail.com)
 * -----
 * Last Modified: Monday, 13th January 2020 11:55:31 pm
 * -----
 * Copyright 2019 - 2020 WhileGeek, https://umar.tech
 */

import React, {createContext, useState, useEffect} from 'react';
import {
  log,
  storageUpdate,
  storageGet,
  is_android,
  isAndroidEmulator,
  _cloneDeep,
} from '../Lib';
import AsyncStorage from '@react-native-community/async-storage';
import {IAppContext, IUser} from '../Interfaces/AppInterface';
import {setGlobalLogout, setGlobalUser} from '../Services/GlobalService';


export const AppContext = createContext<IAppContext>({});

export const AppProvider: React.FC = props => {
  // ? future use for logged in user
  const [user, setUser] = useState<IUser | null>(null);

  // Update Data in User Context and Storage
  const updateUser = async (newUser: IUser | null) => {
    log('updating new user...', newUser);

    if (newUser) {
      setGlobalUser(newUser);
    }

    setUser(newUser);

    await storageUpdate('user', newUser);

    return newUser;
  };

  // ? CONTEXT LOADING
  const [contextLoading, setContextLoading] = useState(false);
  const updateContextLoading = (l = false) => {
    log('UPDATING context loading ', l);

    setContextLoading(l);
  };


  /**
   * Logout User and clear Storage
   */
  const logout = () => {
    log('LOGGING OUT IN CONTEXT');

    updateContextLoading(true);
    updateUser(null);

    setGlobalUser(null);

    AsyncStorage.clear();

    updateContextLoading(false);
  };

  useEffect(() => {
    setGlobalLogout(logout);
  }, [user]);

  

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,

        logout,

        contextLoading,
        updateContextLoading,
      }}>
      {props.children}
    </AppContext.Provider>
  );
};
