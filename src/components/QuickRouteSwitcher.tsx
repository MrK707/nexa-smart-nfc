import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  LogIn, 
  UserPen, 
  CreditCard, 
  Share2, 
  Settings, 
  ExternalLink, 
  ShieldCheck, 
  Compass,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { useCustomer } from '../context/CustomerContext';

export const QuickRouteSwitcher: React.FC = () => {
  const { currentRoute, navigate, session, login, logout } = useCustomer();
  const [isExpanded, setIsExpanded] = useState(false);

  const routes = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/login', label: 'Login Page', icon: LogIn },
    { path: '/dashboard/profile', label: 'Edit Profile', icon: UserPen },
    { path: '/dashboard/card', label: 'My Digital Card', icon: CreditCard },
    { path: '/dashboard/share', label: 'Share Card', icon: Share2 },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
    { path: '/u/johnperera', label: 'Public NFC Profile', icon: ExternalLink },
    { path: '/admin', label: 'Admin Fleet', icon: ShieldCheck },
  ];

  const handleSelectRoute = (path: string) => {
    if (path === '/login') {
      logout();
    } else {
      if (!session.isAuthenticated) {
        login('john@nexacreatives.com', path === '/admin' ? 'admin' : 'customer');
      }
      navigate(path);
    }
  };

  return (
    <div 
      id="nexa-quick-route-switcher"
      className="fixed bottom-18 md:bottom-5 right-4 z-50 flex flex-col items-end pointer-events-auto"
    >
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mb-2 w-64 bg-white/[0.88] backdrop-blur-[20px] border border-[#7c3aed]/20 rounded-3xl p-2.5 shadow-[0_25px_60px_-15px_rgba(124,58,237,0.25)] animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-1.5 border-b border-[#7c3aed]/10 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#7c3aed]">
              Direct Route Switcher
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] font-bold font-mono">
              Live Preview
            </span>
          </div>

          <div className="py-1 space-y-0.5 max-h-72 overflow-y-auto">
            {routes.map((r) => {
              const Icon = r.icon;
              const isActive = currentRoute === r.path;
              return (
                <button
                  key={r.path}
                  onClick={() => {
                    handleSelectRoute(r.path);
                    setIsExpanded(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7c3aed]/15 to-[#22d3ee]/15 text-[#7c3aed] border border-[#7c3aed]/25'
                      : 'text-[#6b6478] hover:text-[#1f1b2e] hover:bg-violet-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                    <span className="truncate">{r.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6b6478]">{r.path}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-1.5 border-t border-[#7c3aed]/10">
            <a
              href="/nexa-dashboard-source.zip"
              download="nexa-dashboard-source.zip"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-xs font-bold shadow-md shadow-[#7c3aed]/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project ZIP</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        id="quick-route-switcher-toggle"
        onClick={() => setIsExpanded(prev => !prev)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.88] backdrop-blur-[16px] hover:bg-white border border-[#7c3aed]/25 text-[#1f1b2e] text-xs font-bold shadow-[0_10px_25px_rgba(124,58,237,0.15)] hover:shadow-[0_14px_30px_rgba(124,58,237,0.25)] transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        <Compass className="w-4 h-4 text-[#7c3aed] animate-spin-slow" />
        <span>Pages: <span className="text-[#7c3aed] font-mono">{currentRoute}</span></span>
        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-[#6b6478]" /> : <ChevronUp className="w-3.5 h-3.5 text-[#6b6478]" />}
      </button>
    </div>
  );
};
