import React, { useState } from 'react';
import { Bell, Sparkles, ExternalLink } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { NotificationDrawer } from './NotificationDrawer';

export const DashboardHeader: React.FC = () => {
  const { profile, unreadNotificationCount, navigate } = useCustomer();
  const [showNotifications, setShowNotifications] = useState(false);

  const firstName = profile.personal.full_name?.split(' ')[0] || 'Customer';

  return (
    <header 
      id="dashboard-header" 
      className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 pt-2 border-b border-[#7c3aed]/12 transition-all"
    >
      {/* Left Greeting & Heading */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed]">
            Welcome back
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 shadow-xs">
            <Sparkles className="w-2.5 h-2.5" />
            NFC Smart Card Connected
          </span>
        </div>
        
        <h1 
          id="dashboard-user-greeting"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1f1b2e] tracking-tight flex items-center gap-2"
        >
          <span>Hello, {firstName}</span>
          <span className="inline-block animate-wave origin-bottom-right">👋</span>
        </h1>
        
        <p className="text-sm text-[#6b6478] font-normal">
          Manage your digital business identity from one place.
        </p>
      </div>

      {/* Right Controls: Notification & Profile with online indicator */}
      <div className="flex items-center gap-3 self-end md:self-center">
        {/* Quick NFC view pill */}
        <button
          onClick={() => navigate(`/u/${profile.personal.username}`)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-[#1f1b2e] bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 shadow-xs hover:shadow-md transition-all cursor-pointer"
          title="Open live public profile"
        >
          <span>View Public Card</span>
          <ExternalLink className="w-3 h-3 text-[#7c3aed]" />
        </button>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            id="header-notification-button"
            onClick={() => setShowNotifications(prev => !prev)}
            aria-label="View notifications"
            className="relative p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 text-[#6b6478] hover:text-[#1f1b2e] shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4 text-[#7c3aed]" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7c3aed] ring-2 ring-white animate-ping" />
            )}
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7c3aed] ring-2 ring-white" />
            )}
          </button>

          <NotificationDrawer 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        </div>

        {/* Profile Avatar with small online/active indicator */}
        <div 
          onClick={() => navigate('/dashboard/profile')}
          className="relative cursor-pointer group p-0.5 rounded-full"
          title="Edit your profile"
        >
          <div className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#7c3aed] to-[#22d3ee] shadow-sm group-hover:scale-105 transition-transform duration-200">
            <img
              src={profile.personal.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={profile.personal.full_name}
              className="w-full h-full rounded-full object-cover bg-violet-50"
            />
          </div>
          {/* Active online pulse indicator */}
          <span 
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" 
            title="Digital Card Online"
          />
        </div>
      </div>
    </header>
  );
};
