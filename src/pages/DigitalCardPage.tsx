import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Radio, 
  RotateCw, 
  Download, 
  Share2, 
  ExternalLink, 
  ShieldCheck, 
  Check,
  Zap
} from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useCustomer } from '../context/CustomerContext';
import { downloadVCard } from '../lib/vcard';

export const DigitalCardPage: React.FC = () => {
  const { profile, navigate, setShareModalOpen, recordCustomActivity } = useCustomer();
  const { personal, business, card } = profile;

  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('aurora-glass');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isNfcTapping, setIsNfcTapping] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);

  const publicUrl = `https://tap.nexacreatives.site/u/${personal.username}`;

  useEffect(() => {
    QRCode.toDataURL(publicUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#1f1b2e',
        light: '#00000000',
      },
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
  }, [publicUrl]);

  const themes = [
    {
      id: 'aurora-glass',
      label: 'Aurora Glass (Light)',
      gradient: 'from-[#ffffff] via-[#f3f1fb] to-[#ede9fe]',
      border: 'border-[#7c3aed]/30',
      accent: 'text-[#7c3aed]',
      text: 'text-[#1f1b2e]',
      muted: 'text-[#6b6478]',
      accentBg: 'bg-gradient-to-r from-[#7c3aed] to-[#22d3ee]',
      isLight: true,
    },
    {
      id: 'obsidian-purple',
      label: 'Obsidian Purple',
      gradient: 'from-[#1a1429] via-[#0f0c18] to-[#07060a]',
      border: 'border-purple-500/30',
      accent: 'text-purple-400',
      text: 'text-white',
      muted: 'text-zinc-400',
      accentBg: 'bg-purple-600',
      isLight: false,
    },
    {
      id: 'titanium-noir',
      label: 'Titanium Noir',
      gradient: 'from-[#1e1e24] via-[#121216] to-[#08080a]',
      border: 'border-zinc-500/30',
      accent: 'text-zinc-300',
      text: 'text-white',
      muted: 'text-zinc-400',
      accentBg: 'bg-zinc-700',
      isLight: false,
    },
    {
      id: 'aurora-violet',
      label: 'Aurora Violet',
      gradient: 'from-[#2e1065] via-[#1e113a] to-[#0a0614]',
      border: 'border-indigo-400/40',
      accent: 'text-indigo-300',
      text: 'text-white',
      muted: 'text-zinc-400',
      accentBg: 'bg-indigo-600',
      isLight: false,
    },
    {
      id: 'cyber-emerald',
      label: 'Cyber Emerald',
      gradient: 'from-[#062c26] via-[#091b18] to-[#040d0c]',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-400',
      text: 'text-white',
      muted: 'text-zinc-400',
      accentBg: 'bg-emerald-600',
      isLight: false,
    },
  ];

  const currentThemeObj = themes.find(t => t.id === selectedTheme) || themes[0];

  const handleDownloadContact = () => {
    downloadVCard(profile);
    recordCustomActivity('vcard_saved', 'Downloaded vCard contact file', `${personal.full_name}.vcf`);
  };

  const handleSimulateNfcTap = () => {
    setIsNfcTapping(true);
    setNfcSuccess(false);

    setTimeout(() => {
      setIsNfcTapping(false);
      setNfcSuccess(true);
      recordCustomActivity('card_viewed', 'NFC Hardware Tap simulated', 'Transmitted NTAG424 DNA signature');
      setTimeout(() => setNfcSuccess(false), 4000);
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7c3aed]/12">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f1b2e] tracking-tight flex items-center gap-3">
              <span>My Smart NFC Digital Card</span>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/25 font-bold">
                Hardware Paired
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6b6478] mt-1 font-medium">
              Interactive 3D preview of the card paired with your physical NFC chip.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShareModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-[#1f1b2e] bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 shadow-xs transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#7c3aed]" />
              <span>Share Card</span>
            </button>

            <button
              onClick={handleDownloadContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] hover:from-[#6d28d9] hover:to-[#06b6d4] shadow-[0_10px_24px_rgba(124,58,237,0.25)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Save vCard (.vcf)</span>
            </button>
          </div>
        </div>

        {/* Card Stage / Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Card Presentation Area */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center p-6 sm:p-12 rounded-3xl bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] relative overflow-hidden min-h-[460px]">
            {/* Ambient Background lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#a78bfa]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Tap simulation ripple effect */}
            {isNfcTapping && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <span className="animate-ping absolute w-48 h-48 rounded-full bg-[#7c3aed]/30" />
                <span className="animate-ping delay-150 absolute w-72 h-72 rounded-full bg-[#22d3ee]/20" />
                <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#7c3aed]/30 text-[#7c3aed] text-xs font-mono font-bold flex items-center gap-2 shadow-2xl">
                  <Radio className="w-4 h-4 animate-spin text-[#7c3aed]" />
                  <span>Scanning NFC chip signature...</span>
                </div>
              </div>
            )}

            {nfcSuccess && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>NFC Handshake Successful! Contact broadcast ready.</span>
              </div>
            )}

            {/* The 3D NFC Card Container */}
            <div className="relative w-full max-w-[420px] aspect-[1.586/1] perspective-1000 group">
              <div 
                className={`relative w-full h-full rounded-3xl p-6 sm:p-7 bg-gradient-to-br ${currentThemeObj.gradient} border ${currentThemeObj.border} shadow-[0_20px_45px_-10px_rgba(124,58,237,0.2)] transition-all duration-700 transform-style-3d cursor-pointer hover:-translate-y-1 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={() => setIsFlipped(prev => !prev)}
                title="Click card to flip"
              >
                {/* FRONT FACE */}
                <div className={`absolute inset-0 p-6 sm:p-7 flex flex-col justify-between backface-hidden ${isFlipped ? 'hidden' : 'flex'}`}>
                  {/* Top header row */}
                  <div className="flex items-center justify-between">
                    {/* Metallic Smart NFC Chip Icon */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded-md bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 p-[1px] shadow-xs">
                        <div className="w-full h-full bg-slate-900 rounded-[5px] flex items-center justify-center">
                          <div className="w-5 h-3 border border-amber-300/40 rounded-[2px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-85">
                        <Radio className={`w-4 h-4 ${currentThemeObj.accent}`} />
                        <span className={`text-[10px] font-mono tracking-widest ${currentThemeObj.accent} font-bold uppercase`}>
                          NFC
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-right">
                      <span className={`text-xs font-extrabold tracking-wider ${currentThemeObj.text}`}>NEXA</span>
                      <span className="text-[9px] font-bold text-white uppercase bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] px-1.5 py-0.5 rounded-full shadow-2xs">
                        SMART
                      </span>
                    </div>
                  </div>

                  {/* Middle User Info */}
                  <div className="flex items-center gap-4 my-auto">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-[#7c3aed] to-[#22d3ee] shrink-0 shadow-md">
                      <img
                        src={personal.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={personal.full_name}
                        className="w-full h-full rounded-[14px] object-cover bg-violet-50"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight truncate ${currentThemeObj.text}`}>
                        {personal.full_name}
                      </h3>
                      <p className={`text-xs font-bold truncate ${currentThemeObj.accent}`}>
                        {personal.job_title}
                      </p>
                      <p className={`text-[11px] truncate font-medium ${currentThemeObj.muted}`}>
                        {business.company_name}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Footer Row */}
                  <div className="flex items-end justify-between pt-2 border-t border-[#7c3aed]/15">
                    <div>
                      <span className={`text-[10px] uppercase font-mono block font-bold ${currentThemeObj.muted}`}>
                        Chip Identification
                      </span>
                      <span className={`text-xs font-mono font-bold ${currentThemeObj.text}`}>
                        {card.nfc_uid || '04:A2:8F:2B:6C:91'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 text-[11px] font-mono font-bold ${currentThemeObj.accent}`}>
                      <span>TAP TO CONNECT</span>
                    </div>
                  </div>
                </div>

                {/* BACK FACE */}
                <div className={`absolute inset-0 p-6 sm:p-7 flex flex-col justify-between backface-hidden [transform:rotateY(180deg)] ${isFlipped ? 'flex' : 'hidden'}`}>
                  {/* Magnetic Strip Illusion */}
                  <div className="-mx-6 sm:-mx-7 -mt-6 sm:-mt-7 h-10 bg-slate-900/90 border-b border-[#7c3aed]/20" />

                  {/* QR & Tap Instructions */}
                  <div className="flex items-center justify-between gap-4 py-2">
                    <div className="space-y-1">
                      <span className={`text-[10px] uppercase font-mono tracking-wider font-bold ${currentThemeObj.accent}`}>
                        Scan or Tap
                      </span>
                      <h4 className={`text-sm font-extrabold ${currentThemeObj.text}`}>
                        Digital Profile Link
                      </h4>
                      <p className={`text-[11px] font-mono truncate max-w-[200px] font-medium ${currentThemeObj.muted}`}>
                        tap.nexacreatives.site/u/{personal.username}
                      </p>
                    </div>

                    {qrCodeUrl && (
                      <div className="p-2 rounded-2xl bg-white shadow-md border border-[#7c3aed]/15 shrink-0">
                        <img src={qrCodeUrl} alt="QR" className="w-16 h-16 object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Card Security Signature */}
                  <div className="pt-2 border-t border-[#7c3aed]/15 flex items-center justify-between text-[10px] font-mono text-[#6b6478] font-bold">
                    <span>NEXA SMART ID • CRYPTO VERIFIED</span>
                    <span className="text-[#7c3aed]">FLIP BACK ↺</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Controls Bar */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                id="card-flip-btn"
                onClick={() => setIsFlipped(prev => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#1f1b2e] bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 shadow-xs transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#7c3aed]" />
                <span>Flip Card (Front / Back)</span>
              </button>

              <button
                id="card-simulate-tap-btn"
                onClick={handleSimulateNfcTap}
                disabled={isNfcTapping}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#7c3aed] bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 border border-[#7c3aed]/20 shadow-xs transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#7c3aed]" />
                <span>Simulate NFC Tap</span>
              </button>

              <button
                onClick={() => navigate(`/u/${personal.username}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#6b6478] hover:text-[#1f1b2e] transition-colors cursor-pointer"
              >
                <span>Live Web View</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#7c3aed]" />
              </button>
            </div>
          </div>

          {/* Right Column: Customization & Technical Specs */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Card Finish / Material Theme */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-4">
              <h3 className="text-sm font-extrabold text-[#1f1b2e] tracking-tight">
                Card Finish & Style
              </h3>
              <p className="text-xs text-[#6b6478] font-medium">
                Choose the digital texture matching your physical Nexa metal or PVC smart card.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {themes.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setSelectedTheme(th.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedTheme === th.id
                        ? 'bg-[#7c3aed]/10 border-[#7c3aed] text-[#7c3aed] font-bold shadow-xs'
                        : 'bg-white/80 border-[#7c3aed]/10 text-[#6b6478] hover:text-[#1f1b2e] hover:bg-white'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${th.accentBg}`} />
                    <span className="text-xs font-bold">{th.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart NFC Chip Technical Data */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-[#1f1b2e] tracking-tight">
                  Hardware Specifications
                </h3>
              </div>

              <div className="divide-y divide-[#7c3aed]/10 text-xs font-mono">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#6b6478] font-sans font-medium">Chip Type</span>
                  <span className="text-[#1f1b2e] font-bold">NXP NTAG424 DNA</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#6b6478] font-sans font-medium">NFC Frequency</span>
                  <span className="text-[#1f1b2e] font-bold">13.56 MHz (ISO 14443A)</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#6b6478] font-sans font-medium">Public Encoding</span>
                  <span className="text-[#7c3aed] truncate max-w-[170px] font-bold">tap.nexacreatives.site</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#6b6478] font-sans font-medium">Status</span>
                  <span className="text-emerald-600 font-bold">● Active & Paired</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
