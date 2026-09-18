import { UserProfile, ActivityItem, NotificationItem, AuthSession, UserRole } from '../types';

const INITIAL_PROFILE: UserProfile = {
  id: 'usr_nexa_0921',
  personal: {
    profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    full_name: 'John Perera',
    username: 'johnperera',
    job_title: 'Founder & CEO',
  },
  business: {
    company_name: 'Nexa Solutions',
    bio: 'Pioneering next-generation NFC digital identities, smart hardware credentials, and contactless corporate networking.',
    services: ['NFC Digital Identity', 'Executive Branding', 'Enterprise NFC Cards'],
  },
  contact: {
    phone: '+1 (555) 234-5678',
    whatsapp: '+15552345678',
    email: 'john@nexacreatives.com',
    website: 'https://nexacreatives.site',
    address: 'One Market Plaza, San Francisco, CA',
  },
  social: {
    instagram: 'john.nexa',
    linkedin: 'john-perera-nexa',
    facebook: 'johnperera.official',
    tiktok: 'john_perera',
    twitter: 'john_nexa',
  },
  card: {
    card_status: 'active',
    public_profile_url: 'https://tap.nexacreatives.site/u/johnperera',
    card_color_theme: 'obsidian-purple',
    nfc_uid: '04:A2:8F:2B:6C:91:80',
    issued_at: '2026-01-15',
  },
};

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_1',
    type: 'card_viewed',
    title: 'NFC Card tapped & viewed',
    timestamp: '2 hours ago',
    detail: 'Tapped via iPhone 16 Pro in San Francisco',
  },
  {
    id: 'act_2',
    type: 'vcard_saved',
    title: 'vCard downloaded to contacts',
    timestamp: '5 hours ago',
    detail: 'Direct contact card added',
  },
  {
    id: 'act_3',
    type: 'link_shared',
    title: 'Profile link shared via WhatsApp',
    timestamp: 'Yesterday at 4:15 PM',
    detail: 'tap.nexacreatives.site/u/johnperera',
  },
  {
    id: 'act_4',
    type: 'profile_updated',
    title: 'Profile details updated',
    timestamp: '3 days ago',
    detail: 'Bio and executive services refreshed',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Smart Card Active',
    message: 'Your NFC card 04:A2:8F:2B is registered and broadcasting live.',
    timestamp: '10 min ago',
    read: false,
    type: 'card',
  },
  {
    id: 'notif_2',
    title: 'New Contact Saved',
    message: 'Someone added your contact details to their smartphone address book.',
    timestamp: '4 hours ago',
    read: false,
    type: 'system',
  },
  {
    id: 'notif_3',
    title: 'Security Verified',
    message: 'Your NFC identity chip signature was verified on the Nexa mesh.',
    timestamp: '2 days ago',
    read: true,
    type: 'security',
  },
];

const STORAGE_KEYS = {
  PROFILE: 'nexa_customer_profile',
  ACTIVITIES: 'nexa_customer_activities',
  NOTIFICATIONS: 'nexa_customer_notifications',
  SESSION: 'nexa_auth_session',
};

export function getStoredProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load profile from storage', e);
  }
  return INITIAL_PROFILE;
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    // Keep public_profile_url updated with username
    profile.card.public_profile_url = `https://tap.nexacreatives.site/u/${profile.personal.username}`;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredActivities(): ActivityItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load activities', e);
  }
  return INITIAL_ACTIVITIES;
}

export function logActivity(type: ActivityItem['type'], title: string, detail?: string): ActivityItem[] {
  const current = getStoredActivities();
  const newActivity: ActivityItem = {
    id: `act_${Date.now()}`,
    type,
    title,
    timestamp: 'Just now',
    detail,
  };
  const updated = [newActivity, ...current].slice(0, 20);
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save activity', e);
  }
  return updated;
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load notifications', e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function markNotificationsAsRead(): NotificationItem[] {
  const current = getStoredNotifications().map(n => ({ ...n, read: true }));
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
  return current;
}

export function getStoredSession(): AuthSession {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load session', e);
  }
  // Default logged in as John Perera customer for frictionless exploration
  return {
    isAuthenticated: true,
    user: {
      id: 'usr_nexa_0921',
      email: 'john@nexacreatives.com',
      role: 'customer',
      name: 'John Perera',
    },
  };
}

export function setStoredSession(session: AuthSession): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to set session', e);
  }
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}

export interface ProfileCompletionResult {
  percentage: number;
  completedCount: number;
  totalCount: number;
  missingFields: string[];
}

export function calculateProfileCompletion(profile: UserProfile): ProfileCompletionResult {
  const checklist = [
    { name: 'Profile Photo', done: Boolean(profile.personal.profile_photo?.trim()) },
    { name: 'Full Name', done: Boolean(profile.personal.full_name?.trim()) },
    { name: 'Job Title', done: Boolean(profile.personal.job_title?.trim()) },
    { name: 'Company Name', done: Boolean(profile.business.company_name?.trim()) },
    { name: 'Bio / About', done: Boolean(profile.business.bio?.trim() && profile.business.bio.length > 10) },
    { name: 'Phone Number', done: Boolean(profile.contact.phone?.trim()) },
    { name: 'WhatsApp', done: Boolean(profile.contact.whatsapp?.trim()) },
    { name: 'Email Address', done: Boolean(profile.contact.email?.trim()) },
    { name: 'Website', done: Boolean(profile.contact.website?.trim()) },
    {
      name: 'Social Links',
      done: Boolean(
        profile.social.instagram?.trim() ||
        profile.social.linkedin?.trim() ||
        profile.social.facebook?.trim() ||
        profile.social.tiktok?.trim() ||
        profile.social.twitter?.trim()
      ),
    },
  ];

  const totalCount = checklist.length;
  const completedCount = checklist.filter(item => item.done).length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const missingFields = checklist.filter(item => !item.done).map(item => item.name);

  return {
    percentage,
    completedCount,
    totalCount,
    missingFields,
  };
}
