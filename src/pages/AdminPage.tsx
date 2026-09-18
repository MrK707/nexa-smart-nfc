import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  ArrowLeft, 
  LogOut
} from 'lucide-react';
import { useCustomer } from '../context/CustomerContext';

export const AdminPage: React.FC = () => {
  const { logout, navigate, profile } = useCustomer();
  const [searchQuery, setSearchQuery] = useState('');

  const registeredCards = [
    {
      id: 'CARD-9021',
      owner: profile.personal.full_name,
      username: profile.personal.username,
      uid: profile.card.nfc_uid || '04:A2:8F:2B:6C:91',
      status: profile.card.card_status,
      issued: '2026-01-15',
      taps: 142,
    },
    {
      id: 'CARD-8812',
      owner: 'Elena Rostova',
      username: 'elena_r',
      uid: '04:C8:11:9A:34:F1',
      status: 'active',
      issued: '2026-02-02',
      taps: 389,
    },
    {
      id: 'CARD-7643',
      owner: 'Marcus Vance',
      username: 'mvance',
      uid: '04:77:E3:42:09:88',
      status: 'locked',
      issued: '2026-02-19',
      taps: 85,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#faf9fd] text-[#1f1b2e] p-4 sm:p-8 antialiased overflow-hidden selection:bg-[#7c3aed]/20">
      {/* Floating Animated Aurora Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#a78bfa]/30 to-[#7c3aed]/15 blur-[110px] animate-aurora-drift" />
        <div className="absolute top-1/3 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-[#22d3ee]/25 to-[#38bdf8]/15 blur-[120px] animate-aurora-pulse" />
        <div className="absolute -bottom-28 left-1/3 w-[560px] h-[560px] rounded-full bg-gradient-to-tr from-[#f3f1fb] via-[#e9d5ff]/30 to-[#22d3ee]/20 blur-[115px] animate-aurora-float" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7c3aed]/12">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#22d3ee] text-white shadow-md shadow-[#7c3aed]/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f1b2e] tracking-tight">
                  Nexa Fleet Administrator
                </h1>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 border border-amber-500/25">
                  Role: Admin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6b6478] mt-1 font-medium">
                Global NFC Smart Card Provisioning, Mesh Security & Tenant Diagnostics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#1f1b2e] bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span>Switch to Customer Dashboard</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 border border-rose-200 shadow-2xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Global Hardware Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset]">
            <span className="text-xs text-[#6b6478] font-bold">Provisioned NFC Cards</span>
            <p className="text-2xl font-extrabold text-[#1f1b2e] mt-1">1,248</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">● 99.4% Operational</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset]">
            <span className="text-xs text-[#6b6478] font-bold">Monthly Tap Interactions</span>
            <p className="text-2xl font-extrabold text-[#7c3aed] mt-1">48,920</p>
            <span className="text-[11px] text-[#6b6478] font-medium mt-1 inline-block">Real NFC handshakes</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset]">
            <span className="text-xs text-[#6b6478] font-bold">Active Tenants</span>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">842</p>
            <span className="text-[11px] text-[#7c3aed] font-bold mt-1 inline-block">Corporate + Pro</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset]">
            <span className="text-xs text-[#6b6478] font-bold">Crypto Mesh Integrity</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">100%</p>
            <span className="text-[11px] text-[#6b6478] font-medium mt-1 inline-block">Zero revoked keys</span>
          </div>
        </div>

        {/* Card Management Table */}
        <div className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#7c3aed]/10">
            <div>
              <h3 className="text-base font-extrabold text-[#1f1b2e]">NFC Hardware Registry</h3>
              <p className="text-xs text-[#6b6478] font-medium">View real-time status of client smart cards.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6478]" />
                <input
                  type="text"
                  placeholder="Search card ID, owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 text-xs text-[#1f1b2e] font-medium placeholder-[#6b6478] focus:outline-hidden focus:border-[#7c3aed] shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#7c3aed]/10 text-[#6b6478] uppercase tracking-wider font-mono text-[10px]">
                  <th className="pb-3 font-bold">Card ID</th>
                  <th className="pb-3 font-bold">Cardholder</th>
                  <th className="pb-3 font-bold">NFC Chip UID</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Issued Date</th>
                  <th className="pb-3 font-bold text-right">Taps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7c3aed]/10 font-medium">
                {registeredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-violet-50/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#1f1b2e]">{card.id}</td>
                    <td className="py-3 text-[#1f1b2e]">
                      <div>
                        <span className="font-bold">{card.owner}</span>
                        <span className="text-[10px] text-[#6b6478] block">@{card.username}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono font-bold text-[#7c3aed]">{card.uid}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        card.status === 'active' 
                          ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/25' 
                          : 'bg-rose-500/15 text-rose-800 border border-rose-500/25'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${card.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {card.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#6b6478] font-medium">{card.issued}</td>
                    <td className="py-3 text-right font-mono font-bold text-[#1f1b2e]">{card.taps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
