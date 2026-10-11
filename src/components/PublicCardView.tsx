import React from 'react';
import {
  Phone,
  Mail,
  Globe,
  MessageSquare,
  Download,
  MapPin,
  ShieldCheck,
  Radio,
  Instagram,
  Linkedin,
  Facebook,
} from 'lucide-react';
import type { UserProfile } from '../types';
import { getTheme } from '../lib/themes';

export const themeVars = (themeId?: string): React.CSSProperties =>
  getTheme(themeId).vars as unknown as React.CSSProperties;

// Only allow normal web links (blocks javascript: and other unsafe links)
export function safeUrl(value: string): string {
  const url = (value || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return '';
  return `https://${url}`;
}

const CSS = `
.pp-scope{font-family:var(--font);color:var(--text);}
.pp-preview{background:var(--bg);padding:20px;}
.pp-card{position:relative;width:100%;max-width:448px;margin:0 auto;border-radius:32px;padding:32px 24px;background:var(--card);border:1px solid var(--border);box-shadow:var(--shadow);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}
.pp-ring{padding:3px;border-radius:9999px;background:linear-gradient(135deg,var(--accent),var(--accent2));}
.pp-ring-inner{padding:2px;border-radius:9999px;background:var(--solid);}
.pp-avatar{width:92px;height:92px;border-radius:9999px;object-fit:cover;display:flex;align-items:center;justify-content:center;background:var(--chip);color:var(--chipText);font-size:34px;font-weight:800;}
.pp-badge{position:absolute;bottom:0;right:0;padding:6px;border-radius:9999px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:var(--btnText);display:flex;}
.pp-title{color:var(--accent);}
.pp-muted{color:var(--muted);}
.pp-pill{background:var(--chip);color:var(--chipText);border:1px solid var(--border);}
.pp-line{border-top:1px solid var(--border);}
.pp-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:14px 24px;border-radius:18px;font-weight:700;font-size:14px;border:none;cursor:pointer;color:var(--btnText);background:linear-gradient(135deg,var(--accent),var(--accent2));box-shadow:0 12px 28px -8px var(--accent);transition:transform .2s ease,opacity .2s ease;}
.pp-btn:hover{transform:translateY(-1px);}
.pp-btn:disabled{opacity:.7;cursor:default;transform:none;}
.pp-tile{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 8px;border-radius:18px;background:var(--tile);border:1px solid var(--border);color:var(--text);text-decoration:none;font-size:10px;font-weight:600;gap:6px;transition:transform .2s ease;}
.pp-tile:hover{transform:translateY(-3px);}
.pp-tile-icon{padding:8px;border-radius:12px;background:var(--chip);color:var(--chipText);display:flex;}
.pp-social{padding:10px;border-radius:12px;background:var(--tile);border:1px solid var(--border);color:var(--muted);display:flex;transition:transform .2s ease,color .2s ease;}
.pp-social:hover{transform:translateY(-2px);color:var(--accent);}
`;

interface PublicCardViewProps {
  profile: UserProfile;
  themeId?: string;
  onSaveContact?: () => void;
  preview?: boolean;
}

export const PublicCardView: React.FC<PublicCardViewProps> = ({
  profile,
  themeId,
  onSaveContact,
  preview = false,
}) => {
  const { personal, business, contact, social } = profile;
  const website = safeUrl(contact.website);
  const handle = (value: string) => encodeURI(value.trim().replace(/^@/, ''));
  const initial = (personal.full_name || '?').trim().charAt(0).toUpperCase();

  const actions: { key: string; href: string; label: string; icon: React.ReactNode; external?: boolean }[] = [];
  if (contact.phone) actions.push({ key: 'call', href: `tel:${contact.phone}`, label: 'Call', icon: <Phone className="w-4 h-4" /> });
  if (contact.whatsapp)
    actions.push({
      key: 'chat',
      href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`,
      label: 'Chat',
      icon: <MessageSquare className="w-4 h-4" />,
      external: true,
    });
  if (contact.email) actions.push({ key: 'email', href: `mailto:${contact.email}`, label: 'Email', icon: <Mail className="w-4 h-4" /> });
  if (website) actions.push({ key: 'web', href: website, label: 'Web', icon: <Globe className="w-4 h-4" />, external: true });

  const hasSocial = Boolean(social.linkedin || social.instagram || social.facebook);

  return (
    <div className={preview ? 'pp-scope pp-preview' : 'pp-scope'} style={themeVars(themeId)}>
      <style>{CSS}</style>
      <div className="pp-card">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="pp-ring">
              <div className="pp-ring-inner">
                {personal.profile_photo ? (
                  <img src={personal.profile_photo} alt={personal.full_name} className="pp-avatar" />
                ) : (
                  <div className="pp-avatar">{initial}</div>
                )}
              </div>
            </div>
            <span className="pp-badge">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {personal.full_name || 'Your Name'}
          </h1>

          {personal.job_title && <p className="pp-title text-sm font-semibold mt-1">{personal.job_title}</p>}
          {business.company_name && <p className="pp-muted text-xs font-medium mt-1">{business.company_name}</p>}

          {contact.address && (
            <div className="pp-pill inline-flex items-center gap-1.5 text-xs mt-2 px-3 py-1 rounded-full">
              <MapPin className="w-3 h-3" />
              <span>{contact.address}</span>
            </div>
          )}

          {business.bio && (
            <p className="pp-muted pp-line text-xs sm:text-sm leading-relaxed mt-4 pt-4 text-center w-full">
              {business.bio}
            </p>
          )}
        </div>

        {/* Save contact */}
        <div className="mt-6">
          <button type="button" className="pp-btn" onClick={onSaveContact} disabled={!onSaveContact}>
            <Download className="w-4 h-4" />
            <span>Save Contact to Phone</span>
          </button>
        </div>

        {/* Contact actions */}
        {actions.length > 0 && (
          <div className="flex gap-2.5 mt-5">
            {actions.map((a) => (
              <a
                key={a.key}
                href={a.href}
                className="pp-tile"
                {...(a.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <span className="pp-tile-icon">{a.icon}</span>
                <span>{a.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* Services */}
        {business.services && business.services.length > 0 && (
          <div className="pp-line mt-6 pt-5">
            <h4 className="pp-muted text-[11px] uppercase tracking-wider font-bold mb-2.5">Services</h4>
            <div className="flex flex-wrap gap-1.5">
              {business.services.map((svc, i) => (
                <span key={i} className="pp-pill px-3 py-1 rounded-xl text-xs font-semibold">
                  {svc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social */}
        {hasSocial && (
          <div className="pp-line mt-6 pt-5 flex items-center justify-center gap-3">
            {social.linkedin && (
              <a
                className="pp-social"
                href={`https://linkedin.com/in/${handle(social.linkedin)}`}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {social.instagram && (
              <a
                className="pp-social"
                href={`https://instagram.com/${handle(social.instagram)}`}
                target="_blank"
                rel="noreferrer"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {social.facebook && (
              <a
                className="pp-social"
                href={`https://facebook.com/${handle(social.facebook)}`}
                target="_blank"
                rel="noreferrer"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pp-line mt-7 text-center pt-4">
          <div className="pp-muted inline-flex items-center gap-1.5 text-[11px] font-medium">
            <Radio className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Powered by</span>
            <span className="font-bold" style={{ color: 'var(--text)' }}>NEXA CREATIVES</span>
          </div>
        </div>
      </div>
    </div>
  );
};
