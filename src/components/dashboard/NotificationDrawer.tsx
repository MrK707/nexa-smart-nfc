import React from 'react';
import { Bell, CheckCheck, Shield, CreditCard, Sparkles, X } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsRead, unreadNotificationCount } = useCustomer();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-4 h-4 text-[#7c3aed]" />;
      case 'security':
        return <Shield className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#0284c7]" />;
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div 
        id="notifications-panel"
        className="fixed top-16 right-4 sm:right-8 w-80 sm:w-96 max-w-[calc(100vw-2rem)] z-50 bg-white/[0.92] backdrop-blur-[20px] border border-[#7c3aed]/20 rounded-3xl shadow-[0_20px_50px_-10px_rgba(124,58,237,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#7c3aed]/10 bg-white/60">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#7c3aed]" />
            <span className="font-extrabold text-sm text-[#1f1b2e]">Notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white shadow-xs">
                {unreadNotificationCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadNotificationCount > 0 && (
              <button
                onClick={markNotificationsRead}
                title="Mark all as read"
                className="text-[11px] text-[#7c3aed] hover:text-[#6d28d9] font-bold flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-[#6b6478] hover:text-[#1f1b2e] hover:bg-violet-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-[#7c3aed]/10">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#6b6478] text-xs font-medium">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((item) => (
              <div 
                key={item.id}
                className={`p-3.5 flex items-start gap-3 transition-colors ${
                  item.read ? 'bg-transparent' : 'bg-[#7c3aed]/5'
                }`}
              >
                <div className="p-2 rounded-xl bg-[#f3f1fb] border border-[#7c3aed]/15 shrink-0 mt-0.5 shadow-2xs">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className={`text-xs font-bold truncate ${item.read ? 'text-[#1f1b2e]' : 'text-[#7c3aed]'}`}>
                      {item.title}
                    </p>
                    <span className="text-[10px] text-[#6b6478] shrink-0 font-medium">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#6b6478] leading-relaxed font-normal">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
