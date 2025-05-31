// src/api/auth.js
import axios from 'axios';
import { CONFIG } from './config';
import { AuthChangeEvent, createClient, Session, Subscription } from '@supabase/supabase-js'
import AsyncStorage, { AsyncStorageStatic } from '@react-native-async-storage/async-storage'
import { Alert, AppState, Platform } from 'react-native';
  
import { AuthSession } from "@supabase/supabase-js"

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

class SupabaseStorage {
  
  storage?: AsyncStorageStatic | Storage;
  constructor() {
    let isWeb = Platform.OS == "web";
    if (isWeb && typeof localStorage == "undefined") this.storage = undefined;
    else this.storage = (isWeb) ? localStorage : AsyncStorage;
  }

  async getItem(key: string) {
    return this.storage?.getItem(key) ?? null;
  }
  async removeItem(key: string) {
    this.storage?.removeItem(key) ?? null;
  }

  async setItem(key: string, value: string) {
    this.storage?.setItem(key, value) ?? null;
  }
}

const supabase = createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: new SupabaseStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    }
  }
)

AppState.addEventListener('change', (state) => {  
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh() 
});

export const AUTH_API = {
  login: async (credentials?: Credentials) => {
    if (!credentials) {
      Alert.alert('Login failed', 'Credentials were null')
    }
    else {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })
      if (!!error) Alert.alert('Login failed', error.message)
    }
  },
  
  register: async (credentials?: Credentials) => {
    if (!credentials) Alert.alert('Login failed', 'Credentials were null')
    else {
      const { error, data: { session } } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password
      })
      if (!!error) Alert.alert('Registration failed', error.message); 
      if (!session) Alert.alert('Please check your inbox for email verification!')
    }
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (!!error) Alert.alert('Logout failed', error.message);
  },
 
  
  getSession: async () => {
    const session  = await supabase.auth.getSession()
    return session
  },

  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void | Promise<void>) => {
    return supabase.auth.onAuthStateChange(callback)
  }
  // Other auth-related API calls
};

export const EXERCISE_API = {
  getSummary: async () => {
    //@ts-ignore
      const query = supabase.from("exercises")
      .select("id, exercise:exercise_name, summary, type, attributes")
      .order("created_ts", {ascending: false})
      const { data } = await query;
      return data;
  },
  postMessage: async(messages: string | string[]) => {
    console.log("Message received!", messages);
    const messageArray = Array.isArray(messages) ? messages : [messages];
      const query = supabase.from("jobs")
      .upsert(messageArray.map(m => ({ data: { message: m}}))).select();
      const { data, error } = await query;
      if (!!error) throw error
      return data;
  }
}

export type Job = {
  id: string
  status: string,
  data: { message: string },
  error: any,
  created_at: Date,
  updated_at: Date,
  retry_count: number,
  user_id: string
}

export const JOB_API = {
  getPendingJobs: async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const query = supabase.from("jobs")
      .select("id, status, data, error, created_at, updated_at, retry_count, user_id")
      .gte("updated_at", fiveMinutesAgo).neq("status","completed").neq("status","failed");
    const { data, error } = await query;
    if (!!error) throw error;
    return data as Job[];
  },
  timeoutJob: async (jobID: string) => {
    const query = supabase.from("jobs")
      .update({ 
        status: "failed", 
        error: "Timed Out",
        updated_at: new Date().toISOString()
      })
      .eq("id", jobID)
      .select()
      .single();
    const { data, error } = await query;
    if (!!error) throw error;
    return data as Job;
  }
}