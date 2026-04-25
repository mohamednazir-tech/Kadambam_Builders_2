import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

// Rate limiting using localStorage (basic protection)
const RATE_LIMIT_KEY = 'auth_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const checkRateLimit = (): boolean => {
  const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
  const now = Date.now();
  
  // Clean old attempts
  const validAttempts = attempts.filter((timestamp: number) => now - timestamp < LOCKOUT_DURATION);
  
  if (validAttempts.length >= MAX_ATTEMPTS) {
    return false; // Rate limited
  }
  
  // Add current attempt
  validAttempts.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(validAttempts));
  return true;
};

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 254); // Limit length
};

export const signIn = async (email: string, password: string) => {
  try {
    if (!checkRateLimit()) {
      throw new Error('Too many attempts. Please try again later.');
    }

    const sanitizedEmail = sanitizeInput(email);
    
    if (!sanitizedEmail.includes('@') || sanitizedEmail.length < 5) {
      throw new Error('Invalid email format');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password,
    });
    
    if (error) {
      // Don't expose specific auth errors
      throw new Error('Invalid email or password');
    }
    
    return data;
  } catch (error: any) {
    // Log detailed error for debugging, but expose generic message
    console.error('Sign in error:', error);
    throw error.message === 'Too many attempts. Please try again later.' 
      ? error 
      : new Error('Authentication failed');
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    if (!checkRateLimit()) {
      throw new Error('Too many attempts. Please try again later.');
    }

    const sanitizedEmail = sanitizeInput(email);
    
    if (!sanitizedEmail.includes('@') || sanitizedEmail.length < 5) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
    });
    
    if (error) {
      // Don't expose specific auth errors
      throw new Error('Registration failed');
    }
    
    // Note: Admin creation is now restricted to existing admins only
    // This function is kept for compatibility but won't work with new policies
    return data;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw error.message === 'Too many attempts. Please try again later.' 
      ? error 
      : new Error('Registration failed');
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const isAdmin = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('is_admin');
    
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
