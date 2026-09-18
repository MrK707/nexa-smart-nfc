import React from 'react';
import { UserPen, CreditCard, Share2, Settings, ArrowUpRight } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const QuickActions: React.FC = () => {
  const { navigate, setShareModalOpen } = useCustomer();

  const actions = [
    {
      id: 'action-edit-profile',
      title: 'Edit Profile',
      description: 'Update your personal and business information.',
      icon: UserPen,
      iconColor: 'text-[#7c3aed]',
      iconBg: 'bg-[#7c3aed]/10 group-hover:bg-[#7c3aed]/20 border-[#7c3aed]/20',
      onClick: () => navigate('/dashboard/profile'),
    },
    {
      id: 'action-my-card',
      title: 'My Digital Card',
      description: 'Preview your live NFC business card.',
      icon: CreditCard,
      iconColor: 'text-[#0284c7]',
      iconBg: 'bg-[#22d3ee]/15 group-hover:bg-[#22d3ee]/25 border-[#22d3ee]/30',
      onClick: () => navigate('/dashboard/card'),
    },
    {
      id: 'action-share-card',
      title: 'Share Card',
      description: 'Share your card using QR, link, WhatsApp or native sharing.',
      icon: Share2,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20 border-emerald-500/20',
      onClick: () => setShareModalOpen(true),
    },
    {
      id: 'action-settings',
      title: 'Settings',
      description: 'Manage account preferences and security.',
      icon: Settings,
      iconColor: 'text-[#6b6478]',
      iconBg: 'bg-violet-500/5 group-hover:bg-violet-500/15 border-[#7c3aed]/15',
      onClick: () => navigate('/dashboard/settings'),
    },
  ];

  return (
    <section id="quick-actions-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-[#1f1b2e] tracking-tight">
          Quick Actions
        </h3>
        <span className="text-xs text-[#6b6478] font-semibold">
          Instant Shortcuts
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              id={act.id}
              onClick={act.onClick}
              className="group relative text-left p-5 sm:p-6 rounded-3xl bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/12 hover:border-[#7c3aed]/30 shadow-[0_10px_30px_-10px_rgba(124,58,237,0.06),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-12px_rgba(124,58,237,0.16)] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Subtle top corner ambient glow on hover */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#a78bfa]/20 to-[#22d3ee]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-2xl border transition-all duration-300 group-hover:scale-110 shadow-xs ${act.iconBg}`}>
                    <Icon className={`w-5 h-5 transition-colors ${act.iconColor}`} />
                  </div>
                  <div className="p-1 rounded-lg text-[#6b6478] group-hover:text-[#7c3aed] transition-colors">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <h4 className="text-sm font-extrabold text-[#1f1b2e] tracking-tight group-hover:text-[#7c3aed] transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-[#6b6478] mt-1.5 leading-relaxed font-medium">
                  {act.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#7c3aed]/10 flex items-center gap-1.5 text-[11px] font-bold text-[#7c3aed] group-hover:translate-x-0.5 transition-transform">
                <span>Open module</span>
                <span className="text-xs">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
