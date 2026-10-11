import React, { useEffect, useState } from 'react';
import { Share2, ArrowLeft, Radio } from 'lucide-react';
import { useCustomer } from '../context/CustomerContext';
import { downloadVCard } from '../lib/vcard';
import { loadPublicProfile } from '../lib/profileApi';
import { getTheme } from '../lib/themes';
import { PublicCardView, themeVars } from '../components/PublicCardView';
import type { UserProfile } from '../types';

type LoadState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'error'; message: string }
  | { status: 'ready'; profile: UserProfile };

export const PublicProfilePage: React.FC = () => {
  const { session, navigate, currentRoute } = useCustomer();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [shareNote, setShareNote] = useState('');

  const rawName = currentRoute.split('?')[0].split('#')[0].split('/')[2] || '';
  let username = rawName;
  try {
    username = decodeURIComponent(rawName);
  } catch {
    username = rawName;
  }
  username = username.toLowerCase();

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    loadPublicProfile(username).then(({ profile, error }) => {
      if (cancelled) return;
      if (error) setState({ status: 'error', message: error });
      else if (!profile) setState({ status: 'missing' });
      else setState({ status: 'ready', profile });
    });
    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    if (state.status === 'ready') {
      document.title = `${state.profile.personal.full_name || 'Digital Card'} | Nexa Smart NFC`;
    }
  }, [state]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = state.status === 'ready' ? state.profile.personal.full_name : 'Digital Card';
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareNote('Link copied!');
        setTimeout(() => setShareNote(''), 2000);
      }
    } catch {
      /* share dismissed */
    }
  };

  // Loading / not found / error screens
  if (state.status !== 'ready') {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 text-center"
        style={{ ...themeVars('aurora-glass'), background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font)' }}
      >
        {state.status === 'loading' && <p className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Loading card...</p>}
        {state.status === 'missing' && (
          <div>
            <h1 className="text-2xl font-extrabold">Card not found</h1>
            <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
              This digital card does not exist or is not public.
            </p>
            <a href="/" className="inline-block mt-5 px-5 py-2.5 rounded-2xl text-sm font-bold text-white" style={{ background: 'var(--accent)' }}>
              Go to Nexa Creatives
            </a>
          </div>
        )}
        {state.status === 'error' && (
          <div>
            <h1 className="text-2xl font-extrabold">Something went wrong</h1>
            <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Please refresh the page and try again.</p>
          </div>
        )}
      </div>
    );
  }

  const { profile } = state;
  const theme = getTheme(profile.card.card_color_theme);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 antialiased overflow-hidden"
      style={{ ...themeVars(theme.id), background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font)' }}
    >
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-[90px]" style={{ background: 'var(--orb1)' }} />
        <div className="absolute top-1/3 -right-28 w-[460px] h-[460px] rounded-full blur-[100px]" style={{ background: 'var(--orb2)' }} />
      </div>

      {/* Top bar */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between mb-5">
        {session.isAuthenticated ? (
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
            style={{ background: 'var(--tile)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Dashboard</span>
          </button>
        ) : (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase"
            style={{ background: 'var(--tile)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            <Radio className="w-3 h-3" style={{ color: 'var(--accent)' }} />
            <span>Nexa Smart ID</span>
          </div>
        )}

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
          style={{ background: 'var(--tile)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          <Share2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <span>{shareNote || 'Share'}</span>
        </button>
      </div>

      <div className="relative z-10 w-full">
        <PublicCardView
          profile={profile}
          themeId={theme.id}
          onSaveContact={() => downloadVCard(profile)}
        />
      </div>
    </div>
  );
};
