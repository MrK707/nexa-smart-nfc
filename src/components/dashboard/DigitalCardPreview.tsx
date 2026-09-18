import React from 'react';
import { 
  Radio, 
  ExternalLink, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Share2, 
  ShieldCheck
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const DigitalCardPreview: React.FC = () => {
  const { profile, navigate, setShareModalOpen } = useCustomer();
  const { personal, business, contact, social } = profile;

  return (
    <div 
      id="digital-card-preview-section"
      className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:shadow-[0_25px_50px_-12px_rgba(124,58,237,0.14)] transition-all duration-300"
    >
      {/* Top Header with LIVE PREVIEW badge */}
      <div className="flex items-center justify-between pb-5 border-b border-[#7c3aed]/10">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-extrabold tracking-wider text-emerald-700 uppercase bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
            LIVE PREVIEW
          </span>
          <span className="text-xs text-[#6b6478] font-medium hidden sm:inline">
            Smart NFC Digital Business Card
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShareModalOpen(true)}
            className="p-2 rounded-xl text-[#6b6478] hover:text-[#1f1b2e] hover:bg-white border border-[#7c3aed]/10 transition-colors cursor-pointer"
            title="Quick Share Card"
          >
            <Share2 className="w-4 h-4 text-[#7c3aed]" />
          </button>
          <button
            id="preview-view-public-profile-btn"
            onClick={() => navigate(`/u/${personal.username}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-[#7c3aed] hover:text-white bg-[#7c3aed]/10 hover:bg-gradient-to-r hover:from-[#7c3aed] hover:to-[#22d3ee] border border-[#7c3aed]/20 transition-all cursor-pointer shadow-xs"
          >
            <span>View Public Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Realistic Smart Card Shell (Aurora Glass) */}
      <div className="mt-6 flex justify-center">
        <div 
          id="nfc-card-card-canvas"
          className="relative w-full max-w-md rounded-3xl p-6 sm:p-7 bg-white/[0.85] backdrop-blur-[16px] border border-[#7c3aed]/20 shadow-[0_16px_36px_-10px_rgba(124,58,237,0.15)] overflow-hidden group hover:-translate-y-1 transition-all duration-300"
        >
          {/* Top Filament Accent */}
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent" />

          {/* Subtle NFC waves watermark */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-80">
            <Radio className="w-4 h-4 text-[#7c3aed] animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-[#7c3aed] font-bold uppercase">
              NFC
            </span>
          </div>

          {/* Profile Identity Top */}
          <div className="relative z-10 flex items-start gap-4">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl p-[2px] bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] shrink-0 shadow-md shadow-[#7c3aed]/20">
              <img
                src={personal.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={personal.full_name}
                className="w-full h-full rounded-[14px] object-cover bg-violet-50"
              />
            </div>

            <div className="min-w-0 flex-1 pr-6">
              <h4 className="text-lg sm:text-xl font-extrabold text-[#1f1b2e] tracking-tight truncate">
                {personal.full_name || 'Customer Name'}
              </h4>
              <p className="text-xs font-bold text-[#7c3aed] truncate">
                {personal.job_title || 'Position Title'}
              </p>
              <p className="text-xs text-[#6b6478] font-medium truncate">
                {business.company_name || 'Nexa Creatives'}
              </p>
            </div>
          </div>

          {/* Bio snippet */}
          {business.bio && (
            <p className="relative z-10 text-xs text-[#6b6478] leading-relaxed mt-4 pt-3 border-t border-[#7c3aed]/10 line-clamp-2 font-normal">
              {business.bio}
            </p>
          )}

          {/* Contact Pills Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-2 mt-4 pt-2">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f3f1fb] hover:bg-white border border-[#7c3aed]/10 text-[#1f1b2e] text-xs font-medium transition-all shadow-2xs truncate"
              >
                <Phone className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                <span className="truncate">{contact.phone}</span>
              </a>
            )}

            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-white border border-emerald-500/20 text-emerald-800 text-xs font-medium transition-all shadow-2xs truncate"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </a>
            )}

            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f3f1fb] hover:bg-white border border-[#7c3aed]/10 text-[#1f1b2e] text-xs font-medium transition-all shadow-2xs truncate"
              >
                <Mail className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                <span className="truncate">{contact.email}</span>
              </a>
            )}

            {contact.website && (
              <a
                href={contact.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f3f1fb] hover:bg-white border border-[#7c3aed]/10 text-[#1f1b2e] text-xs font-medium transition-all shadow-2xs truncate"
              >
                <Globe className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                <span className="truncate">{contact.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>

          {/* Social Row */}
          <div className="relative z-10 flex items-center justify-between mt-5 pt-3 border-t border-[#7c3aed]/10">
            <div className="flex items-center gap-3 text-[#6b6478]">
              {social.instagram && (
                <span className="hover:text-[#e1306c] transition-colors cursor-pointer" title={`@${social.instagram}`}>
                  <Instagram className="w-4 h-4" />
                </span>
              )}
              {social.linkedin && (
                <span className="hover:text-[#0077b5] transition-colors cursor-pointer" title={social.linkedin}>
                  <Linkedin className="w-4 h-4" />
                </span>
              )}
              {social.facebook && (
                <span className="hover:text-[#1877f2] transition-colors cursor-pointer" title={social.facebook}>
                  <Facebook className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#6b6478]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span>NEXA SMART ID</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
