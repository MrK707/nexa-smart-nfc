import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { UserProfile, ActivityItem, NotificationItem, AuthSession, UserRole } from '../types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredActivities,
  logActivity as recordActivity,
  getStoredNotifications,
  markNotificationsAsRead,
  getStoredSession,
  setStoredSession,
  clearStoredSession,
  calculateProfileCompletion,
  ProfileCompletionResult,
} from '../lib/store';

interface CustomerContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateNestedProfile: (section: keyof UserProfile, fields: Record<string, any>) => void;
  activities: ActivityItem[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsRead: () => void;
  session: AuthSession;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  completion: ProfileCompletionResult;
  currentRoute: string;
  navigate: (route: string) => void;
  isShareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  recordCustomActivity: (type: ActivityItem['type'], title: string, detail?: string) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile);
  const [activities, setActivities] = useState<ActivityItem[]>(getStoredActivities);
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);
  const [session, setSession] = useState<AuthSession>(getStoredSession);
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

  // Authentication guards
  useEffect(() => {
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
  }, [session, currentRoute, navigate]);

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

  const login = useCallback((email: string, role: UserRole = 'customer') => {
    const newSession: AuthSession = {
      isAuthenticated: true,
      user: {
        id: role === 'admin' ? 'usr_admin_001' : 'usr_nexa_0921',
        email,
        role,
        name: role === 'admin' ? 'Nexa System Admin' : profile.personal.full_name || 'John Perera',
      },
    };
    setStoredSession(newSession);
    setSession(newSession);
    recordCustomActivity('profile_updated', 'Session Authenticated', `Logged in via ${email}`);

    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  }, [navigate, profile.personal.full_name, recordCustomActivity]);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession({
      isAuthenticated: false,
      user: null,
    });
    navigate('/login');
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
        login,
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
