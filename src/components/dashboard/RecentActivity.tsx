import React from 'react';
import { 
  History, 
  Radio, 
  Share2, 
  UserCheck, 
  Download, 
  Lock
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { ActivityItem } from '../../types';

export const RecentActivity: React.FC = () => {
  const { activities } = useCustomer();

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'card_viewed':
        return <Radio className="w-3.5 h-3.5 text-[#7c3aed]" />;
      case 'vcard_saved':
        return <Download className="w-3.5 h-3.5 text-emerald-600" />;
      case 'link_shared':
        return <Share2 className="w-3.5 h-3.5 text-[#0284c7]" />;
      case 'profile_updated':
        return <UserCheck className="w-3.5 h-3.5 text-amber-600" />;
      case 'card_locked':
        return <Lock className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <History className="w-3.5 h-3.5 text-[#6b6478]" />;
    }
  };

  return (
    <section 
      id="recent-activity-section"
      className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:shadow-[0_25px_50px_-12px_rgba(124,58,237,0.14)] transition-all duration-300"
    >
      <div className="flex items-center justify-between pb-4 border-b border-[#7c3aed]/10">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#7c3aed]" />
          <h3 className="text-base font-extrabold text-[#1f1b2e] tracking-tight">
            Recent Activity
          </h3>
        </div>
        <span className="text-xs text-[#6b6478] font-mono font-semibold">
          Event Log
        </span>
      </div>

      <div className="mt-4">
        {activities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-[#1f1b2e] font-medium">No recent activity yet.</p>
            <p className="text-xs text-[#6b6478] mt-1">Actions on your smart card and profile will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 4).map((item, idx) => (
              <div key={item.id} className="relative flex items-start gap-3 group">
                {/* Timeline connector line */}
                {idx !== Math.min(activities.length, 4) - 1 && (
                  <div className="absolute left-[15px] top-7 bottom-0 w-[1px] bg-[#7c3aed]/15 -z-0" />
                )}

                <div className="relative z-10 p-2 rounded-xl bg-[#f3f1fb] border border-[#7c3aed]/15 group-hover:border-[#7c3aed]/40 group-hover:bg-[#7c3aed]/10 transition-colors shrink-0 shadow-2xs">
                  {getActivityIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#1f1b2e] group-hover:text-[#7c3aed] transition-colors truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-[#6b6478] shrink-0 font-medium">
                      {item.timestamp}
                    </span>
                  </div>
                  {item.detail && (
                    <p className="text-[11px] text-[#6b6478] mt-0.5 leading-relaxed truncate font-medium">
                      {item.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
