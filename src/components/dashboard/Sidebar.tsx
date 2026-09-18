import React from 'react';
import { 
  LayoutDashboard, 
  UserPen, 
  CreditCard, 
  Share2, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const { profile, currentRoute, navigate, logout, session } = useCustomer();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      id: 'profile',
      label: 'Edit Profile',
      icon: UserPen,
      path: '/dashboard/profile',
    },
    {
      id: 'card',
      label: 'My Digital Card',
      icon: CreditCard,
      path: '/dashboard/card',
    },
    {
      id: 'share',
      label: 'Share Card',
      icon: Share2,
      path: '/dashboard/share',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/dashboard/settings',
    },
  ];

  const handleNav = (path: string) => {
    navigate(path);
  };

  return (
    <aside 
      id="desktop-sidebar"
      className="hidden md:flex flex-col w-64 lg:w-72 bg-white/[0.72] backdrop-blur-[16px] border-r border-[#7c3aed]/12 h-screen sticky top-0 z-30 select-none shadow-[4px_0_24px_rgba(124,58,237,0.03)]"
    >
      {/* Brand Header */}
      <div className="p-6 pb-4 border-b border-[#7c3aed]/10">
        <div 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
          id="sidebar-brand-logo"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#22d3ee] p-[2px] shadow-md shadow-[#7c3aed]/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
              <span className="font-extrabold text-[#7c3aed] text-lg tracking-wider">
                N
              </span>
            </div>
            {/* Ambient signal dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-[#1f1b2e] text-base">NEXA</span>
              <span className="text-[10px] font-bold tracking-widest text-white uppercase bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] px-1.5 py-0.5 rounded-full shadow-xs">
                NFC
              </span>
            </div>
            <p className="text-[11px] text-[#6b6478] font-medium tracking-wide">CREATIVES PLATFORM</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#6b6478]">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.path;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 group text-left cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#7c3aed]/12 to-[#22d3ee]/12 text-[#7c3aed] font-bold border border-[#7c3aed]/25 shadow-xs'
                  : 'text-[#6b6478] hover:text-[#1f1b2e] hover:bg-white/80 hover:border hover:border-[#7c3aed]/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-[#7c3aed] text-white shadow-xs' : 'text-[#6b6478] group-hover:text-[#7c3aed] group-hover:bg-[#7c3aed]/10'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>
              {isActive ? (
                <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] shadow-xs"></div>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#6b6478] opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}

        {/* Public Profile quick shortcut */}
        <div className="pt-4">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#6b6478]">
            Public Card
          </div>
          <button
            id="nav-item-view-public-url"
            onClick={() => navigate(`/u/${profile.personal.username}`)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-medium text-xs text-[#6b6478] hover:text-[#1f1b2e] bg-white/70 hover:bg-white border border-[#7c3aed]/12 hover:border-[#7c3aed]/30 shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Radio className="w-3.5 h-3.5 text-[#7c3aed] shrink-0 animate-pulse" />
              <span className="truncate font-semibold">/u/{profile.personal.username}</span>
            </div>
            <ExternalLink className="w-3 h-3 text-[#6b6478] group-hover:text-[#7c3aed] shrink-0" />
          </button>
        </div>

        {/* Admin Link if role is admin */}
        {session.user?.role === 'admin' && (
          <div className="pt-2">
            <button
              id="nav-item-admin-console"
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-amber-700 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 cursor-pointer transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Admin Management</span>
            </button>
          </div>
        )}

        {/* Download Project Source ZIP */}
        <div className="pt-4">
          <a
            id="nav-item-download-zip"
            href="/nexa-dashboard-source.zip"
            download="nexa-dashboard-source.zip"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs text-[#7c3aed] hover:text-white bg-white/80 hover:bg-gradient-to-r hover:from-[#7c3aed] hover:to-[#22d3ee] border border-[#7c3aed]/20 transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Download className="w-3.5 h-3.5 text-[#7c3aed] group-hover:text-white group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">Download Project ZIP</span>
            </div>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-[#7c3aed]/10 group-hover:bg-white/20 text-[#7c3aed] group-hover:text-white">
              .zip
            </span>
          </a>
        </div>
      </div>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-[#7c3aed]/10 bg-[#f3f1fb]/50">
        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/80 transition-colors">
          <div 
            onClick={() => navigate('/dashboard/profile')}
            className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 mr-2"
            title="Edit profile"
          >
            <div className="relative shrink-0">
              <img
                src={profile.personal.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={profile.personal.full_name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#7c3aed]/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#1f1b2e] truncate">{profile.personal.full_name}</p>
              <p className="text-[11px] text-[#6b6478] truncate">@{profile.personal.username}</p>
            </div>
          </div>
          
          <button
            id="sidebar-logout-btn"
            onClick={logout}
            title="Sign out of customer account"
            className="p-2 text-[#6b6478] hover:text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
