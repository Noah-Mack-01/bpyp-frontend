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
  const [isLoading, setIsLoading] = useState(false); // Start with false
  const [error, setError] = useState<any | null>(null);

  const login = async (creds: Credentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await AUTH_API.login(creds);
    } catch (err) {
      setError(String(err));
      console.error('login failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (creds: Credentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await AUTH_API.register(creds);
    } catch (err) {
      setError(String(err));
      console.error('register failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await AUTH_API.logout();
    } catch (err) {
      setError(String(err));
      console.error('logout failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {    
    AUTH_API.getSession().then(({ data: { session } }) => {
      setSession(session);
    });    
    
    const { data: { subscription } } = AUTH_API.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const authContextValue: AuthenticationContext = {
    session,
    isLoading,
    error,
    login,
    register,
    logout,
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