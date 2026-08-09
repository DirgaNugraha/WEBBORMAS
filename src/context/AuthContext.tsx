import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface ProfileUpdate {
  email?: string;
  full_name?: string;
  avatar_url?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: ProfileUpdate) => Promise<{ error: string | null }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Email atau password salah.' };
      }
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: ProfileUpdate) => {
    const payload: {
      email?: string;
      password?: string;
      data?: { full_name?: string; avatar_url?: string };
    } = {};

    if (updates.email) payload.email = updates.email;
    if (updates.password) payload.password = updates.password;

    const metadata: { full_name?: string; avatar_url?: string } = {};
    if (updates.full_name !== undefined) metadata.full_name = updates.full_name;
    if (updates.avatar_url !== undefined) metadata.avatar_url = updates.avatar_url;
    if (Object.keys(metadata).length > 0) payload.data = metadata;

    const { error } = await supabase.auth.updateUser(payload);
    if (error) {
      console.error('Gagal memperbarui profil:', error.message);
      return { error: error.message };
    }

    // Perbarui state user lokal agar UI ter-update
    const { data: { user: updatedUser } } = await supabase.auth.getUser();
    setUser(updatedUser);
    return { error: null };
  };

  const refreshUser = async () => {
    const { data: { user: current } } = await supabase.auth.getUser();
    setUser(current);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signOut, updateProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
}