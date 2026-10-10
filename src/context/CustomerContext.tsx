import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile, ActivityItem, NotificationItem, AuthSession, UserRole } from '../types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredActivities,
  logActivity as recordActivity,
  getStoredNotifications,
  markNotificationsAsRead,
  clearStoredSession,
  calculateProfileCompletion,
  ProfileCompletionResult,
} from '../lib/store';

interface AuthResult {
  error: string | null;
}

interface SignUpResult {
  error: string | null;
  needsConfirmation: boolean;
}

interface CustomerContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateNestedProfile: (section: keyof UserProfile, fields: Record<string, any>) => void;
  activities: ActivityItem[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsRead: () => void;
  session: AuthSession;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, fullName?: string) => Promise<SignUpResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  logout: () => void;
  completion: ProfileCompletionResult;
  currentRoute: string;
  navigate: (route: string) => void;
  isShareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  recordCustomActivity: (type: ActivityItem['type'], title: string, detail?: string) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

const SIGNED_OUT: AuthSession = { isAuthenticated: false, user: null };

// Convert a Supabase user into the session shape the app already uses.
// Admin role comes from app_metadata, which users cannot edit themselves.
const toSession = (user: User | null): AuthSession => {
  if (!user) return SIGNED_OUT;
  const role: UserRole = user.app_metadata?.role === 'admin' ? 'admin' : 'customer';
  return {
    isAuthenticated: true,
    user: {
      id: user.id,
      email: user.email ?? '',
      role,
      name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'Member',
    },
  };
};

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile);
  const [activities, setActivities] = useState<ActivityItem[]>(getStoredActivities);
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);
  const [session, setSession] = useState<AuthSession>(SIGNED_OUT);
  const [authLoading, setAuthLoading] = useState(true);
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  // Simple client-side pushState / hash routing listener
  const getInitialRoute = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path && path !== '/') return path;
      const hash = window.location.hash.replace('#', '');
      if (hash) return hash;
    }
    return '/dashboard';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname !== '/' ? window.location.pathname : window.location.hash.replace('#', '') || '/dashboard';
      setCurrentRoute(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((route: string) => {
    setCurrentRoute(route);
    try {
      window.history.pushState({}, '', route);
    } catch {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Real authentication: load the saved Supabase session and listen for changes
  useEffect(() => {
    // remove the old fake demo session if it is still stored in this browser
    clearStoredSession();

    supabase.auth.getSession().then(({ data }) => {
      setSession(toSession(data.session?.user ?? null));
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(toSession(newSession?.user ?? null));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Authentication guards (wait until the saved session has been checked)
  useEffect(() => {
    if (authLoading) return;
    if (!session.isAuthenticated && currentRoute.startsWith('/dashboard')) {
      navigate('/login');
    } else if (session.isAuthenticated && session.user?.role === 'admin' && currentRoute.startsWith('/dashboard')) {
      navigate('/admin');
    } else if (session.isAuthenticated && currentRoute === '/login') {
      if (session.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [session, authLoading, currentRoute, navigate]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const merged: UserProfile = {
        ...prev,
        ...updates,
      };
      saveStoredProfile(merged);
      const acts = recordActivity('profile_updated', 'Profile updated', 'Personal details and credentials saved');
      setActivities(acts);
      return merged;
    });
  }, []);

  const updateNestedProfile = useCallback((section: keyof UserProfile, fields: Record<string, any>) => {
    setProfile(prev => {
      const updatedSection = {
        ...(prev[section] as Record<string, any>),
        ...fields,
      };
      const merged: UserProfile = {
        ...prev,
        [section]: updatedSection,
      };
      saveStoredProfile(merged);
      const acts = recordActivity('profile_updated', `${String(section).toUpperCase()} information updated`);
      setActivities(acts);
      return merged;
    });
  }, []);

  const recordCustomActivity = useCallback((type: ActivityItem['type'], title: string, detail?: string) => {
    const acts = recordActivity(type, title, detail);
    setActivities(acts);
  }, []);

  const markNotificationsRead = useCallback(() => {
    const updated = markNotificationsAsRead();
    setNotifications(updated);
  }, []);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const completion = useMemo(() => {
    return calculateProfileCompletion(profile);
  }, [profile]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { error: error ? error.message : null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string): Promise<SignUpResult> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName || '' },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    return {
      error: error ? error.message : null,
      needsConfirmation: !error && !data.session,
    };
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    return { error: error ? error.message : null };
  }, []);

  const logout = useCallback(() => {
    supabase.auth.signOut().finally(() => {
      setSession(SIGNED_OUT);
      navigate('/login');
    });
  }, [navigate]);

  return (
    <CustomerContext.Provider
      value={{
        profile,
        updateProfile,
        updateNestedProfile,
        activities,
        notifications,
        unreadNotificationCount,
        markNotificationsRead,
        session,
        authLoading,
        login,
        signUp,
        resetPassword,
        logout,
        completion,
        currentRoute,
        navigate,
        isShareModalOpen,
        setShareModalOpen,
        recordCustomActivity,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
