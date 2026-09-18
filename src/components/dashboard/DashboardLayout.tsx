import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { ShareModal } from './ShareModal';
import { useCustomer } from '../../context/CustomerContext';
import { Share2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { profile, navigate, setShareModalOpen } = useCustomer();

  return (
    <div className="relative min-h-screen bg-[#faf9fd] text-[#1f1b2e] flex flex-col md:flex-row antialiased overflow-x-hidden selection:bg-[#7c3aed]/20">
      {/* Floating Animated Aurora Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#a78bfa]/35 to-[#7c3aed]/20 blur-[110px] animate-aurora-drift" />
        <div className="absolute top-1/4 -right-24 w-[540px] h-[540px] rounded-full bg-gradient-to-bl from-[#22d3ee]/30 to-[#38bdf8]/15 blur-[120px] animate-aurora-pulse" />
        <div className="absolute -bottom-28 left-1/3 w-[560px] h-[560px] rounded-full bg-gradient-to-tr from-[#f3f1fb] via-[#e9d5ff]/30 to-[#22d3ee]/20 blur-[115px] animate-aurora-float" />
      </div>

      {/* Desktop & Tablet Glass Sidebar */}
      <div className="relative z-30">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Compact Mobile Top Glass Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#7c3aed]/12 px-4 py-3 flex items-center justify-between shadow-xs">
          <div 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#22d3ee] p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center font-extrabold text-[#7c3aed] text-sm">
                N
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[#1f1b2e] text-sm tracking-tight">NEXA</span>
              <span className="text-[9px] font-bold text-white uppercase bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] px-1.5 py-0.5 rounded-full shadow-xs">
                NFC
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2 rounded-xl bg-white/80 text-[#6b6478] hover:text-[#1f1b2e] border border-[#7c3aed]/12 shadow-xs cursor-pointer transition-colors"
              title="Share Card"
            >
              <Share2 className="w-4 h-4 text-[#7c3aed]" />
            </button>
            <div 
              onClick={() => navigate('/dashboard/profile')}
              className="relative cursor-pointer"
            >
              <img
                src={profile.personal.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={profile.personal.full_name}
                className="w-8 h-8 rounded-full object-cover border-2 border-[#7c3aed]/30"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Fixed Navigation */}
      <MobileNavigation />

      {/* Global Share Modal */}
      <ShareModal />
    </div>
  );
};
