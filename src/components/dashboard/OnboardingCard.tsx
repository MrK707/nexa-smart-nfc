import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const OnboardingCard: React.FC = () => {
  const { completion, navigate } = useCustomer();

  // Once profile completion reaches 100%, automatically hide the onboarding card
  if (completion.percentage >= 100) {
    return null;
  }

  return (
    <div 
      id="onboarding-incomplete-card"
      className="relative rounded-3xl p-6 sm:p-7 bg-white/[0.75] backdrop-blur-[16px] border border-[#7c3aed]/20 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.1),0_0_0_1px_rgba(255,255,255,0.8)_inset] overflow-hidden"
    >
      {/* Background ambient flare */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-[#a78bfa]/20 to-[#22d3ee]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7c3aed] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed]">
              Identity Onboarding
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-[#1f1b2e] tracking-tight">
            Let’s finish your digital identity
          </h3>

          <p className="text-xs sm:text-sm text-[#6b6478] leading-relaxed font-medium">
            Complete your profile so customers can easily connect with you via NFC tap and save your details in one click.
          </p>

          {/* Animated progress bar */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex-1 h-2.5 rounded-full bg-[#7c3aed]/10 overflow-hidden max-w-xs">
              <div 
                className="h-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] rounded-full transition-all duration-700 ease-out shadow-xs"
                style={{ width: `${completion.percentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#7c3aed] font-mono">
              {completion.percentage}%
            </span>
          </div>
        </div>

        <button
          id="onboarding-complete-profile-cta"
          onClick={() => navigate('/dashboard/profile')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] hover:from-[#6d28d9] hover:to-[#06b6d4] shadow-[0_10px_24px_rgba(124,58,237,0.25)] hover:shadow-[0_14px_30px_rgba(124,58,237,0.38)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all cursor-pointer shrink-0"
        >
          <span>Complete Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
