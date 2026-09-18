export type UserRole = 'customer' | 'admin';

export interface UserPersonal {
  profile_photo: string;
  full_name: string;
  username: string;
  job_title: string;
}

export interface UserBusiness {
  company_name: string;
  bio: string;
  services: string[];
}

export interface UserContact {
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
}

export interface UserSocial {
  instagram: string;
  facebook: string;
  linkedin: string;
  tiktok: string;
  twitter?: string;
  github?: string;
}

export interface UserCard {
  card_status: 'active' | 'locked' | 'inactive';
  public_profile_url: string;
  card_color_theme?: string;
  nfc_uid?: string;
  issued_at?: string;
}

export interface UserProfile {
  id: string;
  personal: UserPersonal;
  business: UserBusiness;
  contact: UserContact;
  social: UserSocial;
  card: UserCard;
}

export interface ActivityItem {
  id: string;
  type: 'profile_updated' | 'card_viewed' | 'link_shared' | 'qr_scanned' | 'vcard_saved' | 'card_locked';
  title: string;
  timestamp: string;
  detail?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'system' | 'card' | 'security';
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  } | null;
  isAuthenticated: boolean;
}
