import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const ProfileCompletion: React.FC = () => {
  const { completion, navigate } = useCustomer();
  const [animatedValue, setAnimatedValue] = useState(0);

  // Smooth entrance animation from 0 to actual percentage
  useEffect(() => {
    const target = completion.percentage;
    const duration = 800; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(easeOut * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [completion.percentage]);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div 
      id="profile-completion-card"
      className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:shadow-[0_25px_50px_-12px_rgba(124,58,237,0.14)] transition-all duration-300 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed]">
            Card Readiness
          </span>
          <h3 className="text-lg font-extrabold text-[#1f1b2e] tracking-tight mt-0.5">
            Profile Completion
          </h3>
          <p className="text-xs text-[#6b6478] mt-1 font-medium">
            {completion.percentage === 100
              ? 'Your NFC business card has all contact and identity fields filled!'
              : `${completion.missingFields.length} field${completion.missingFields.length > 1 ? 's' : ''} left for optimal tap conversion.`}
          </p>
        </div>

        {/* Circular Animated Progress Indicator with Signature Gradient */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
            {/* Background ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="rgba(124, 58, 237, 0.1)"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated progress ring with Signature Aurora gradient */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="url(#auroraProgressGrad)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.4s ease' }}
            />
            <defs>
              <linearGradient id="auroraProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-extrabold text-[#1f1b2e] tracking-tight">
              {animatedValue}%
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#6b6478] font-bold">
              Done
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Status / Missing fields info */}
      <div className="mt-5 pt-4 border-t border-[#7c3aed]/10 flex items-center justify-between gap-3">
        {completion.percentage === 100 ? (
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>Profile 100% complete</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium truncate">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span className="truncate font-semibold">
              Missing: {completion.missingFields.slice(0, 2).join(', ')}
              {completion.missingFields.length > 2 && ` +${completion.missingFields.length - 2} more`}
            </span>
          </div>
        )}

        <button
          id="profile-completion-cta"
          onClick={() => navigate('/dashboard/profile')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7c3aed] hover:text-[#6d28d9] transition-colors group cursor-pointer shrink-0"
        >
          <span>Complete</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
