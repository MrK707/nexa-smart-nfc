import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  User, 
  LogOut, 
  Check, 
  Radio, 
  Download
} from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useCustomer } from '../context/CustomerContext';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, session, logout, recordCustomActivity } = useCustomer();
  const { card } = profile;

  const isCardActive = card.card_status === 'active';
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [hidePhoneOnPublic, setHidePhoneOnPublic] = useState(false);
  const [allowInstantVcard, setAllowInstantVcard] = useState(true);

  const toggleCardLock = () => {
    const nextStatus = isCardActive ? 'locked' : 'active';
    updateProfile({
      card: {
        ...card,
        card_status: nextStatus,
      },
    });
    recordCustomActivity(
      nextStatus === 'locked' ? 'card_locked' : 'profile_updated',
      nextStatus === 'locked' ? 'NFC Card locked by user' : 'NFC Card unlocked & active',
      'Hardware lock state updated'
    );
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7c3aed]/12">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f1b2e] tracking-tight flex items-center gap-3">
              <span>Account & Hardware Settings</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6b6478] mt-1 font-medium">
              Control smart card hardware pairing, privacy preferences, and authentication security.
            </p>
          </div>

          {showSavedFeedback && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Preferences saved</span>
            </div>
          )}
        </div>

        {/* Section 1: Smart Card Hardware Security (Lock/Unlock) */}
        <div className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#7c3aed]" />
            <h3 className="text-base font-extrabold text-[#1f1b2e] tracking-tight">
              Smart NFC Card Security
            </h3>
          </div>
          <p className="text-xs text-[#6b6478] font-medium">
            If you ever misplace your physical card, instantly lock it here to prevent anyone from tapping it.
          </p>

          <div className="p-4 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className={`p-2.5 rounded-2xl border shrink-0 ${
                isCardActive 
                  ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25' 
                  : 'bg-rose-500/15 text-rose-700 border-rose-500/25'
              }`}>
                {isCardActive ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-bold text-[#1f1b2e]">
                  Card Broadcasting Status: {isCardActive ? 'Active & Discoverable' : 'Locked & Silent'}
                </p>
                <p className="text-xs text-[#6b6478] mt-0.5 font-medium">
                  UID: <span className="font-mono font-bold text-[#7c3aed]">{card.nfc_uid || '04:A2:8F:2B:6C:91'}</span>
                </p>
              </div>
            </div>

            <button
              id="settings-toggle-card-lock-btn"
              onClick={toggleCardLock}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isCardActive
                  ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 border border-rose-500/30'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-800 border border-emerald-500/30'
              }`}
            >
              {isCardActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>{isCardActive ? 'Lock Smart Card' : 'Unlock Smart Card'}</span>
            </button>
          </div>
        </div>

        {/* Section 2: Privacy Controls */}
        <div className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-extrabold text-[#1f1b2e] tracking-tight">
              Privacy & Tap Permissions
            </h3>
          </div>

          <div className="divide-y divide-[#7c3aed]/10">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#1f1b2e]">Allow 1-Tap Direct vCard Download</p>
                <p className="text-[11px] sm:text-xs text-[#6b6478] mt-0.5 font-medium">
                  Allows viewers of your public card to add you to their iPhone/Android contacts with one click.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowInstantVcard}
                onChange={(e) => setAllowInstantVcard(e.target.checked)}
                className="w-4 h-4 accent-[#7c3aed] rounded cursor-pointer"
              />
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#1f1b2e]">Hide Phone Number on Public Web Profile</p>
                <p className="text-[11px] sm:text-xs text-[#6b6478] mt-0.5 font-medium">
                  Only show email and WhatsApp to public viewers.
                </p>
              </div>
              <input
                type="checkbox"
                checked={hidePhoneOnPublic}
                onChange={(e) => setHidePhoneOnPublic(e.target.checked)}
                className="w-4 h-4 accent-[#7c3aed] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Session & Account Information */}
        <div className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#7c3aed]" />
            <h3 className="text-base font-extrabold text-[#1f1b2e] tracking-tight">
              Authenticated Session
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#6b6478]">Logged in as:</p>
              <p className="text-sm font-extrabold text-[#1f1b2e] mt-0.5">{session.user?.email || 'john@nexacreatives.com'}</p>
              <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed] font-bold">
                Role: {session.user?.role || 'customer'}
              </span>
            </div>

            <button
              id="settings-logout-btn"
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 border border-rose-200 transition-colors cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Section 4: Export Source Code & Assets */}
        <div className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/20 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#7c3aed]" />
              <h3 className="text-base font-extrabold text-[#1f1b2e] tracking-tight">
                Export Project Source Code
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20">
              ZIP Package
            </span>
          </div>

          <p className="text-xs text-[#6b6478] font-medium">
            Download the complete production-ready source code bundle of the Nexa Creatives Smart NFC Dashboard, components, design system, and pages.
          </p>

          <div className="pt-2">
            <a
              id="settings-download-source-zip-btn"
              href="/nexa-dashboard-source.zip"
              download="nexa-dashboard-source.zip"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] hover:from-[#6d28d9] hover:to-[#06b6d4] shadow-[0_10px_24px_rgba(124,58,237,0.25)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download nexa-dashboard-source.zip (91 KB)</span>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
