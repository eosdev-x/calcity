import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthContextType, AuthUser, UserProfile } from '../types/auth';

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from Supabase
  async function fetchUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Check if Supabase credentials are available
  const hasSupabaseCredentials = Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  // Initialize auth state
  useEffect(() => {
    // Set loading state
    setIsLoading(true);
    
    // Track auth subscription
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    // Get current session
    const getInitialSession = async () => {
      if (!hasSupabaseCredentials) {
        console.warn('Skipping authentication initialization - Supabase credentials not configured');
        setIsLoading(false);
        return;
      }
      
      try {
        const { data } = await supabase.auth.getSession();
        const currentSession = data.session;

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user as AuthUser);

          // Fetch user profile
          const userProfile = await fetchUserProfile(currentSession.user.id);
          setProfile(userProfile);
        }
      } catch (error: any) {
        console.error('Error getting session:', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
      
      // Listen for auth changes
      if (hasSupabaseCredentials) {
        const { data } = supabase.auth.onAuthStateChange(
          async (_event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user as AuthUser || null);
            
            if (currentSession?.user) {
              const userProfile = await fetchUserProfile(currentSession.user.id);
              setProfile(userProfile);
            } else {
              setProfile(null);
            }
          }
        );
        
        authSubscription = data.subscription;
      }
    };

    getInitialSession();
    
    // Cleanup subscription on unmount
    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [hasSupabaseCredentials]);

  // Sign up with email and password
  async function signUp(email: string, password: string) {
    try {
      setError(null);
      if (!hasSupabaseCredentials) {
        setError('Supabase credentials not configured');
        return { error: new Error('Supabase credentials not configured') };
      }
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
      return { error: authError };
    }
  }

  // Sign in with email and password
  async function signIn(email: string, password: string) {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
      return { error: authError };
    }
  }

  // Sign in with Google
  async function signInWithGoogle() {
    try {
      setError(null);
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
    }
  }

  // Sign in with Apple
  async function signInWithApple() {
    try {
      setError(null);
      await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
    }
  }

  // Sign out
  async function signOut() {
    try {
      setError(null);
      await supabase.auth.signOut();
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
    }
  }

  // Reset password
  async function resetPassword(email: string) {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
      return { error: authError };
    }
  }

  // Update user profile
  async function updateProfile(data: Partial<UserProfile>) {
    try {
      setError(null);
      
      if (!user) {
        setError('User not authenticated');
        return { error: new Error('User not authenticated') };
      }
      
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      // Refresh the profile data
      const updatedProfile = await fetchUserProfile(user.id);
      setProfile(updatedProfile);
      
      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error };
    }
  }

  // Context value
  const value = {
    user,
    profile,
    session,
    isLoading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
