// src/providers/AuthProvider.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AUTH_API, } from '../api/supabase';
import { AuthSession, Session } from '@supabase/supabase-js';

export type AuthenticationContext = {
    session: AuthSession | null
    isLoading: boolean,
    error: any | null,
    login: (creds: Credentials) => Promise<void>,
    register: (creds: Credentials) => Promise<void>,
    logout: ()=> Promise<void>,
}

export type Credentials = {
  email: string, 
  password: string
}

const AuthContext = createContext(null as AuthenticationContext | null);

export const AuthProvider = ({ children }: any) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any | null>(null)
 
  async function methodWrapper<T>(func: (obj?: T) => Promise<void>, obj?: T): Promise<void> {  
    setIsLoading(true);
    setError(null);
    try { !!obj ? func(obj) : func(); }
    catch (err) {
      setError(String(err));
      console.error(`${func?.name ?? ''} failed`, err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {    
    AUTH_API.getSession().then(({ data: { session } }) => setSession(session));    
    AUTH_API.onAuthStateChange((_event, session) => setSession(session));
  }, [])

  // Value object to be provided to consumers
  const authContextValue: AuthenticationContext = {
    session,
    isLoading,
    error,
    login: (creds) => methodWrapper(AUTH_API.login, creds),
    register: (creds) => methodWrapper(AUTH_API.register, creds),
    logout: () => methodWrapper(AUTH_API.logout),
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}