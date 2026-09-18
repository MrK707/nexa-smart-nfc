import React from 'react';
import { 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Download, 
  MapPin, 
  Share2, 
  Radio, 
  ShieldCheck, 
  Instagram, 
  Linkedin, 
  Facebook,
  ExternalLink,
  Lock,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useCustomer } from '../context/CustomerContext';
import { downloadVCard } from '../lib/vcard';

export const PublicProfilePage: React.FC = () => {
  const { profile, session, navigate, recordCustomActivity, setShareModalOpen } = useCustomer();
  const { personal, business, contact, social, card } = profile;

  const isCardActive = card.card_status === 'active';

  const handleSaveContact = () => {
    downloadVCard(profile);
    recordCustomActivity('vcard_saved', 'Visitor saved contact from public profile', personal.full_name);
  };

  return (
    <div className="relative min-h-screen bg-[#faf9fd] text-[#1f1b2e] flex flex-col items-center justify-center p-4 sm:p-6 antialiased selection:bg-[#7c3aed]/20 overflow-hidden font-sans">
      {/* Aurora Glass Animated Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Violet Aurora Orb */}
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#a78bfa]/45 to-[#7c3aed]/25 blur-[90px] animate-aurora-drift" />
        {/* Cyan Aurora Orb */}
        <div className="absolute top-1/3 -right-28 w-[460px] h-[460px] rounded-full bg-gradient-to-bl from-[#22d3ee]/40 to-[#38bdf8]/20 blur-[100px] animate-aurora-pulse" />
        {/* Soft Lavender Bottom Orb */}
        <div className="absolute -bottom-24 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#f3f1fb] via-[#e9d5ff]/35 to-[#22d3ee]/20 blur-[95px] animate-aurora-float" />
      </div>

      {/* Top Bar Navigation */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between mb-5 animate-in fade-in slide-in-from-top-3 duration-500">
        {session.isAuthenticated ? (
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-[#7c3aed]/15 text-xs font-semibold text-[#1f1b2e] shadow-[0_4px_12px_rgba(124,58,237,0.06)] hover:shadow-[0_6px_16px_rgba(124,58,237,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span>Dashboard</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-[#7c3aed]/12 text-xs font-medium text-[#6b6478]">
            <Radio className="w-3 h-3 text-[#7c3aed] animate-pulse" />
            <span className="font-mono text-[11px] tracking-wider uppercase">NEXA SMART ID</span>
          </div>
        )}

        <button
          onClick={() => setShareModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-[#7c3aed]/15 text-xs font-semibold text-[#1f1b2e] shadow-[0_4px_12px_rgba(124,58,237,0.06)] hover:shadow-[0_6px_16px_rgba(124,58,237,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-[#7c3aed]" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Aurora Glass Smartphone Card */}
      <div 
        id="aurora-glass-card"
        className="relative z-10 w-full max-w-md bg-white/[0.72] backdrop-blur-[16px] rounded-[32px] border border-[#7c3aed]/15 shadow-[0_20px_50px_-12px_rgba(124,58,237,0.12),0_0_0_1px_rgba(255,255,255,0.8)_inset] p-6 sm:p-8 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(124,58,237,0.2),0_0_0_1px_rgba(255,255,255,0.9)_inset] transition-all duration-300 group"
      >
        {/* Subtle internal gradient accent line */}
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent" />

        {/* If card is locked */}
        {!isCardActive && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs flex items-center gap-3 animate-in fade-in duration-300">
            <Lock className="w-5 h-5 shrink-0 text-rose-500" />
            <div>
              <p className="font-bold">Card Temporarily Locked</p>
              <p className="text-[11px] text-rose-600">The cardholder has placed this smart card on security hold.</p>
            </div>
          </div>
        )}

        {/* Header Profile Section */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar with Signature Gradient Thread (linear-gradient(135deg, #7c3aed, #22d3ee)) */}
          <div className="relative mb-5 group-hover:scale-105 transition-transform duration-300">
            <div className="relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] shadow-[0_10px_25px_rgba(124,58,237,0.25)]">
              <div className="w-full h-full rounded-full p-[2px] bg-white">
                <img
                  src={personal.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={personal.full_name}
                  className="w-full h-full rounded-full object-cover bg-violet-50"
                />
              </div>
            </div>
            {/* Verified badge with signature gradient */}
            <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#22d3ee] text-white shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f1b2e] tracking-tight">
            {personal.full_name || 'Customer Name'}
          </h1>
          
          <p className="text-sm font-semibold text-[#7c3aed] mt-1 flex items-center justify-center gap-1.5">
            <span>{personal.job_title}</span>
          </p>

          {business.company_name && (
            <p className="text-xs font-medium text-[#6b6478] mt-1">
              {business.company_name}
            </p>
          )}

          {contact.address && (
            <div className="inline-flex items-center gap-1.5 text-xs text-[#6b6478] mt-2 px-3 py-1 rounded-full bg-[#f3f1fb]/80 border border-[#7c3aed]/10">
              <MapPin className="w-3 h-3 text-[#7c3aed]" />
              <span>{contact.address}</span>
            </div>
          )}

          {business.bio && (
            <p className="text-xs sm:text-sm text-[#6b6478] leading-relaxed mt-4 pt-4 border-t border-[#7c3aed]/10 text-center">
              {business.bio}
            </p>
          )}
        </div>

        {/* Primary Action Button: Signature Gradient Thread (linear-gradient(135deg, #7c3aed, #22d3ee)) */}
        <div className="mt-6">
          <button
            id="public-save-contact-btn"
            onClick={handleSaveContact}
            className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] hover:from-[#6d28d9] hover:to-[#06b6d4] shadow-[0_12px_28px_rgba(124,58,237,0.28)] hover:shadow-[0_16px_36px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Save Contact to Phone</span>
          </button>
        </div>

        {/* Contact Action Grid: Glass Surfaces */}
        <div className="grid grid-cols-4 gap-2.5 mt-5">
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#7c3aed]/12 shadow-[0_4px_12px_rgba(124,58,237,0.04)] hover:shadow-[0_8px_20px_rgba(124,58,237,0.12)] hover:-translate-y-1 transition-all duration-300 group"
              title="Call"
            >
              <div className="p-2 rounded-xl bg-[#7c3aed]/10 text-[#7c3aed] group-hover:scale-110 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-[#6b6478] mt-1.5 font-medium group-hover:text-[#1f1b2e]">Call</span>
            </a>
          )}

          {contact.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#7c3aed]/12 shadow-[0_4px_12px_rgba(124,58,237,0.04)] hover:shadow-[0_8px_20px_rgba(124,58,237,0.12)] hover:-translate-y-1 transition-all duration-300 group"
              title="WhatsApp"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-[#6b6478] mt-1.5 font-medium group-hover:text-[#1f1b2e]">Chat</span>
            </a>
          )}

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#7c3aed]/12 shadow-[0_4px_12px_rgba(124,58,237,0.04)] hover:shadow-[0_8px_20px_rgba(124,58,237,0.12)] hover:-translate-y-1 transition-all duration-300 group"
              title="Email"
            >
              <div className="p-2 rounded-xl bg-[#22d3ee]/15 text-[#0284c7] group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-[#6b6478] mt-1.5 font-medium group-hover:text-[#1f1b2e]">Email</span>
            </a>
          )}

          {contact.website && (
            <a
              href={contact.website}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#7c3aed]/12 shadow-[0_4px_12px_rgba(124,58,237,0.04)] hover:shadow-[0_8px_20px_rgba(124,58,237,0.12)] hover:-translate-y-1 transition-all duration-300 group"
              title="Website"
            >
              <div className="p-2 rounded-xl bg-[#7c3aed]/10 text-[#7c3aed] group-hover:scale-110 transition-transform">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-[#6b6478] mt-1.5 font-medium group-hover:text-[#1f1b2e]">Web</span>
            </a>
          )}
        </div>

        {/* Offerings & Services */}
        {business.services && business.services.length > 0 && (
          <div className="mt-6 pt-5 border-t border-[#7c3aed]/10">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-[#6b6478] mb-2.5">
              Capabilities & Offerings
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {business.services.map((svc, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#f3f1fb] text-[#7c3aed] border border-[#7c3aed]/15 shadow-xs"
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links Row */}
        <div className="mt-6 pt-5 border-t border-[#7c3aed]/10 flex items-center justify-center gap-3 text-[#6b6478]">
          {social.linkedin && (
            <a 
              href={`https://linkedin.com/in/${social.linkedin}`} 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/80 hover:bg-white border border-[#7c3aed]/12 text-[#6b6478] hover:text-[#0077b5] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}

          {social.instagram && (
            <a 
              href={`https://instagram.com/${social.instagram.replace('@', '')}`} 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/80 hover:bg-white border border-[#7c3aed]/12 text-[#6b6478] hover:text-[#e1306c] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}

          {social.facebook && (
            <a 
              href={`https://facebook.com/${social.facebook}`} 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/80 hover:bg-white border border-[#7c3aed]/12 text-[#6b6478] hover:text-[#1877f2] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Signature Gradient Footer Tag */}
        <div className="mt-7 text-center pt-4 border-t border-[#7c3aed]/10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#6b6478]">
            <Radio className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span>Powered by </span>
            <span className="font-bold text-[#1f1b2e]">NEXA CREATIVES</span>
            <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-sm">
              Smart NFC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
