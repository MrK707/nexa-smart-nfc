import React from 'react';
import { UserPen, Eye, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const ProfileHero: React.FC = () => {
  const { profile, navigate } = useCustomer();
  const { personal, business, card } = profile;

  const isCardActive = card.card_status === 'active';

  return (
    <section 
      id="profile-hero-card"
      className="group relative rounded-3xl p-6 sm:p-8 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.1),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:-translate-y-1 hover:shadow-[0_28px_55px_-12px_rgba(124,58,237,0.18)] transition-all duration-300 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#a78bfa]/20 via-[#22d3ee]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#e9d5ff]/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
        {/* Left Side: Avatar with subtle animated ring + Name & Bio */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          {/* Avatar with signature gradient ring */}
          <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] shadow-[0_10px_25px_rgba(124,58,237,0.22)]">
              <div className="w-full h-full rounded-full p-[2px] bg-white">
                <img
                  src={personal.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={personal.full_name}
                  className="w-full h-full rounded-full object-cover bg-violet-50"
                />
              </div>
            </div>
            {/* Active smart badge icon */}
            <div 
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#22d3ee] text-white shadow-md" 
              title="Verified NFC Identity"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5 min-w-0">
            {/* Active Status Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                isCardActive 
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCardActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                {isCardActive ? 'Digital Card Active' : 'Digital Card Inactive'}
              </span>

              <span className="text-xs text-[#6b6478] font-mono">
                @{personal.username}
              </span>
            </div>

            {/* Name */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1f1b2e] tracking-tight">
              {personal.full_name || 'Your Full Name'}
            </h2>

            {/* Title & Company */}
            <div className="flex flex-wrap items-center gap-x-2 text-sm text-[#6b6478] font-medium">
              <span className="text-[#7c3aed] font-bold">{personal.job_title || 'Position Title'}</span>
              {business.company_name && (
                <>
                  <span className="text-[#7c3aed]/40">•</span>
                  <span className="inline-flex items-center gap-1 text-[#1f1b2e]">
                    <Building2 className="w-3.5 h-3.5 text-[#7c3aed]" />
                    {business.company_name}
                  </span>
                </>
              )}
            </div>

            {/* Bio snippet if available */}
            {business.bio && (
              <p className="text-xs sm:text-sm text-[#6b6478] line-clamp-2 max-w-xl pt-1">
                {business.bio}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto shrink-0">
          <button
            id="profile-hero-edit-btn"
            onClick={() => navigate('/dashboard/profile')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] hover:from-[#6d28d9] hover:to-[#06b6d4] shadow-[0_10px_24px_rgba(124,58,237,0.25)] hover:shadow-[0_14px_30px_rgba(124,58,237,0.38)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <UserPen className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <button
            id="profile-hero-view-card-btn"
            onClick={() => navigate(`/u/${personal.username}`)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-[#1f1b2e] bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 shadow-xs hover:shadow-md transition-all cursor-pointer"
            title="Preview how visitors see your card"
          >
            <Eye className="w-4 h-4 text-[#7c3aed]" />
            <span>Preview Card</span>
          </button>
        </div>
      </div>
    </section>
  );
};
