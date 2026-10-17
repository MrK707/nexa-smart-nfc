import React, { useEffect, useMemo, useRef } from 'react';
import type { UserProfile } from '../types';
import { safeUrl } from './PublicCardView';

export type FramedLayout = 'aqua' | 'purple';

const SOURCES: Record<FramedLayout, string> = {
  aqua: '/cards/aqua.html',
  purple: '/cards/purple.html',
};

// Turns a customer profile into the plain data the card pages need.
// Every link is checked here, so a card can only open safe links.
export function buildCardData(profile: UserProfile) {
  const personal = profile.personal;
  const business = profile.business;
  const contact = profile.contact;
  const social = profile.social;

  const clean = (v?: string) => (v || '').trim();
  const handle = (v?: string) => encodeURI(clean(v).replace(/^@/, ''));
  const phone = clean(contact.phone);
  const phoneDigits = phone.replace(/[^\d+]/g, '');
  const whatsappDigits = clean(contact.whatsapp).replace(/\D/g, '');
  const email = clean(contact.email).replace(/[\s<>"]/g, '');
  const webHref = safeUrl(contact.website);
  const address = clean(contact.address);
  const photo = /^https?:\/\//i.test(clean(personal.profile_photo)) ? clean(personal.profile_photo) : '';

  return {
    name: clean(personal.full_name),
    title: clean(personal.job_title),
    company: clean(business.company_name),
    bio: clean(business.bio),
    photo,
    services: (business.services || []).map((s) => clean(s)).filter(Boolean).slice(0, 12),
    phone,
    phoneHref: phoneDigits ? `tel:${phoneDigits}` : '',
    chatHref: whatsappDigits ? `https://wa.me/${whatsappDigits}` : '',
    email,
    emailHref: email ? `mailto:${email}` : '',
    web: webHref.replace(/^https?:\/\//i, '').replace(/\/$/, ''),
    webHref,
    address,
    mapHref: address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : '',
    linkedin: clean(social.linkedin) ? `https://linkedin.com/in/${handle(social.linkedin)}` : '',
    instagram: clean(social.instagram) ? `https://instagram.com/${handle(social.instagram)}` : '',
    facebook: clean(social.facebook) ? `https://facebook.com/${handle(social.facebook)}` : '',
  };
}

interface FramedCardProps {
  profile: UserProfile;
  layout: FramedLayout;
  fixed?: boolean; // true = fills the whole screen (public page)
  height?: string; // used for the small preview
  onSave?: () => void;
  onShare?: () => void;
}

export const FramedCard: React.FC<FramedCardProps> = ({
  profile,
  layout,
  fixed = false,
  height = '600px',
  onSave,
  onShare,
}) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const data = useMemo(() => buildCardData(profile), [profile]);
  const dataRef = useRef(data);
  dataRef.current = data;
  const handlers = useRef({ onSave, onShare });
  handlers.current = { onSave, onShare };

  const sendData = () => {
    frameRef.current?.contentWindow?.postMessage({ nexa: 'init', data: dataRef.current }, '*');
  };

  // send fresh data whenever the profile changes (live preview)
  useEffect(() => {
    sendData();
  }, [data]);

  // listen to the card page (it only runs in a locked sandbox)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const frame = frameRef.current;
      if (!frame || e.source !== frame.contentWindow) return;
      const msg = e.data;
      if (!msg || msg.nexa !== true) return;
      if (msg.action === 'ready') sendData();
      else if (msg.action === 'save') handlers.current.onSave?.();
      else if (msg.action === 'share') handlers.current.onShare?.();
      else if (msg.action === 'copy' && typeof msg.text === 'string') {
        navigator.clipboard?.writeText(msg.text.slice(0, 500)).catch(() => {});
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <iframe
      key={layout}
      ref={frameRef}
      src={SOURCES[layout]}
      title={`${data.name || 'Digital'} business card`}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      onLoad={sendData}
      style={
        fixed
          ? { position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, display: 'block' }
          : { width: '100%', height, border: 0, display: 'block' }
      }
    />
  );
};
