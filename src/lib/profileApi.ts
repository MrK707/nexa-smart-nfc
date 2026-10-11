import { supabase } from './supabase';
import type { UserProfile } from '../types';

// Blank profile used while loading or when logged out (no demo data)
export const EMPTY_PROFILE: UserProfile = {
  id: '',
  personal: { profile_photo: '', full_name: '', username: '', job_title: '' },
  business: { company_name: '', bio: '', services: [] },
  contact: { phone: '', whatsapp: '', email: '', website: '', address: '' },
  social: { instagram: '', facebook: '', linkedin: '', tiktok: '', twitter: '', github: '' },
  card: {
    card_status: 'active',
    public_profile_url: '',
    card_color_theme: 'aurora-glass',
  },
};

export const cleanUsername = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '');

const publicUrl = (username: string) => `${window.location.origin}/u/${username}`;

// database row -> app profile
function rowToProfile(row: any, authEmail: string): UserProfile {
  const username: string = row.username ?? '';
  return {
    id: row.id,
    personal: {
      profile_photo: row.profile_photo ?? '',
      full_name: row.full_name ?? '',
      username,
      job_title: row.job_title ?? '',
    },
    business: {
      company_name: row.company ?? '',
      bio: row.bio ?? '',
      services: row.services ?? [],
    },
    contact: {
      ...EMPTY_PROFILE.contact,
      ...(row.contact ?? {}),
      email: (row.contact && row.contact.email) || authEmail,
    },
    social: {
      ...EMPTY_PROFILE.social,
      ...(row.social ?? {}),
    },
    card: {
      card_status: 'active',
      public_profile_url: publicUrl(username),
      card_color_theme: row.theme_id ?? 'aurora-glass',
    },
  };
}

// app profile -> database row
function profileToRow(profile: UserProfile) {
  return {
    full_name: profile.personal.full_name,
    job_title: profile.personal.job_title,
    profile_photo: profile.personal.profile_photo,
    company: profile.business.company_name,
    bio: profile.business.bio,
    services: profile.business.services,
    contact: profile.contact,
    social: profile.social,
    theme_id: profile.card.card_color_theme ?? 'aurora-glass',
    updated_at: new Date().toISOString(),
  };
}

export async function loadProfile(
  userId: string,
  email: string,
  name: string
): Promise<{ profile: UserProfile | null; error: string | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) return { profile: null, error: error.message };
  if (data) return { profile: rowToProfile(data, email), error: null };

  // No row yet (older account): create one
  const username = (cleanUsername(email.split('@')[0]) || 'user') + '_' + userId.slice(0, 4);
  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({ id: userId, username, full_name: name })
    .select('*')
    .single();

  if (insertError) return { profile: null, error: insertError.message };
  return { profile: rowToProfile(created, email), error: null };
}

// returns an error message, or null when saved
export async function saveProfile(userId: string, profile: UserProfile): Promise<string | null> {
  const row: Record<string, unknown> = profileToRow(profile);

  // only save the username when it is valid (3+ characters)
  const username = cleanUsername(profile.personal.username);
  if (username.length >= 3) row.username = username;

  const { error } = await supabase.from('profiles').update(row).eq('id', userId);
  if (error) {
    return error.code === '23505' ? 'That username is already taken' : error.message;
  }
  return null;
}
