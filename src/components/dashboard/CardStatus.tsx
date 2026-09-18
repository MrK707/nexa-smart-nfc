import React from 'react';
import { Radio, Eye, ShieldCheck } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const CardStatus: React.FC = () => {
  const { profile, navigate } = useCustomer();
  const { card } = profile;

  const isActive = card.card_status === 'active';

  return (
    <div 
      id="smart-card-status-card"
      className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:shadow-[0_25px_50px_-12px_rgba(124,58,237,0.14)] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#7c3aed] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed]">
              Hardware Link
            </span>
          </div>

          {/* Active status pill */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
            isActive 
              ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/25' 
              : 'bg-rose-500/10 text-rose-700 border border-rose-500/25'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`}></span>
            {isActive ? '● Active' : '● Locked'}
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-[#1f1b2e] tracking-tight mt-2">
          Smart Card Status
        </h3>

        <p className="text-xs text-[#6b6478] mt-1 leading-relaxed font-medium">
          {isActive
            ? 'Your NFC digital card is connected and broadcasting contact data.'
            : 'Your card is currently locked. Taps will not broadcast contact data.'}
        </p>

        {card.nfc_uid && (
          <div className="mt-3 py-2 px-3 rounded-xl bg-[#f3f1fb] border border-[#7c3aed]/10 flex items-center justify-between text-[11px] font-mono text-[#6b6478]">
            <span className="font-sans font-semibold">Chip UID:</span>
            <span className="text-[#7c3aed] font-bold">{card.nfc_uid}</span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-[#7c3aed]/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-[#6b6478] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Tag</span>
        </div>

        <button
          id="card-status-view-card-btn"
          onClick={() => navigate('/dashboard/card')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-[#1f1b2e] bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#7c3aed]" />
          <span>View Card</span>
        </button>
      </div>
    </div>
  );
};
