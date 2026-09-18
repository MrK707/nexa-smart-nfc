import React, { useState } from 'react';
import { Eye, EyeOff, User as UserIcon } from 'lucide-react';
import { useCustomer } from '../context/CustomerContext';

export const LoginPage: React.FC = () => {
  const { login, session, navigate } = useCustomer();
  const [email, setEmail] = useState('john@nexacreatives.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect
  React.useEffect(() => {
    if (session.isAuthenticated) {
      if (session.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [session, navigate]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (email.toLowerCase().includes('admin')) {
      login(email, 'admin');
    } else {
      login(email, 'customer');
    }
  };

  const handleQuickDemo = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@nexacreatives.com');
      login('admin@nexacreatives.com', 'admin');
    } else {
      setEmail('john@nexacreatives.com');
      login('john@nexacreatives.com', 'customer');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#faf9fd] flex flex-col items-center justify-center p-4 sm:p-6 antialiased overflow-hidden selection:bg-[#7c3aed]/20">
      {/* Floating Animated Aurora Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#a78bfa]/35 to-[#7c3aed]/20 blur-[110px] animate-aurora-drift" />
        <div className="absolute top-1/4 -right-24 w-[540px] h-[540px] rounded-full bg-gradient-to-bl from-[#22d3ee]/30 to-[#38bdf8]/15 blur-[120px] animate-aurora-pulse" />
        <div className="absolute -bottom-28 left-1/3 w-[560px] h-[560px] rounded-full bg-gradient-to-tr from-[#f3f1fb] via-[#e9d5ff]/30 to-[#22d3ee]/20 blur-[115px] animate-aurora-float" />
      </div>

      {/* Floating Aurora Glass Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white/[0.80] backdrop-blur-[20px] rounded-3xl shadow-[0_25px_60px_-15px_rgba(124,58,237,0.18),0_0_0_1px_rgba(255,255,255,0.9)_inset] overflow-hidden flex flex-col md:flex-row border border-[#7c3aed]/15">
        
        {/* LEFT PANEL: Deep Aurora Twilight with Cyber Mascot */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#1b142f] via-[#28174a] to-[#12233c] flex flex-col items-center justify-center p-8 sm:p-12 relative min-h-[300px] md:min-h-[580px] overflow-hidden">
          {/* Ambient luminous orbs inside left panel */}
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#7c3aed]/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#22d3ee]/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-12 w-48 h-8 bg-black/50 rounded-full blur-xl pointer-events-none" />

          {/* Cyber Visor / Mascot Icon SVG */}
          <div className="relative z-10 flex flex-col items-center">
            <svg 
              className="w-36 h-36 sm:w-44 sm:h-44 text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]" 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Antenna on left top */}
              <line x1="45" y1="40" x2="65" y2="70" stroke="white" strokeWidth="6" strokeLinecap="round" />
              <circle cx="43" cy="38" r="5" fill="#22d3ee" />
              
              {/* Left ear latch */}
              <rect x="18" y="85" width="10" height="28" rx="4" fill="white" />
              {/* Right ear latch */}
              <rect x="172" y="85" width="10" height="28" rx="4" fill="white" />

              {/* Main Outer Geometric Head Shield */}
              <path 
                d="M48 68 L152 68 L170 100 L152 136 L48 136 L30 100 Z" 
                stroke="white" 
                strokeWidth="8" 
                strokeLinejoin="round" 
                fill="#181329"
              />

              {/* Inner Screen Visor Panel */}
              <path 
                d="M58 78 L142 78 L156 100 L142 124 L58 124 L44 100 Z" 
                fill="#251a3e" 
              />

              {/* Left Screen Mask - Cross eye "X" */}
              <path 
                d="M62 84 H102 C104 84 106 86 106 88 V114 C106 116 104 118 102 118 H62 C60 118 58 116 58 114 V88 C58 86 60 84 62 84 Z" 
                fill="#ede9fe" 
              />
              <path 
                d="M74 94 L86 106 M86 94 L74 106" 
                stroke="#181329" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />

              {/* Right Screen sensor square */}
              <rect x="122" y="96" width="10" height="10" rx="2" fill="#22d3ee" />
            </svg>
            
            {/* Ground reflection gradient */}
            <div className="w-24 h-4 bg-[#7c3aed]/30 rounded-full blur-md mt-2" />
          </div>

          {/* Subtext */}
          <div className="absolute bottom-6 text-center">
            <span className="text-[11px] font-mono tracking-widest text-[#a78bfa] uppercase font-bold">
              NEXA CREATIVES IDENTITY ENGINE
            </span>
          </div>
        </div>

        {/* RIGHT PANEL: Clean Aurora Glass Form */}
        <div className="md:w-1/2 bg-white/70 backdrop-blur-md text-[#1f1b2e] p-8 sm:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Top avatar icon with signature gradient ring */}
            <div className="flex justify-center">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#22d3ee] p-[2px] shadow-md shadow-[#7c3aed]/20">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-[#7c3aed]">
                  <UserIcon className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1f1b2e] tracking-tight">
                Welcome back!
              </h2>
              <p className="text-xs sm:text-sm text-[#6b6478] font-medium">
                Enter your login details
              </p>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1f1b2e]">
                  Email
                </label>
                <input
                  type="email"
                  id="login-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:bg-white focus:outline-hidden text-sm text-[#1f1b2e] font-medium transition-all shadow-2xs"
                />
              </div>

              {/* Password Field with Eye toggle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1f1b2e]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:bg-white focus:outline-hidden text-sm text-[#1f1b2e] font-medium transition-all shadow-2xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6478] hover:text-[#1f1b2e] cursor-pointer p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#7c3aed]" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#6b6478] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#7c3aed] rounded cursor-pointer"
                  />
                  <span className="font-semibold text-[#1f1b2e]">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to registered email.')}
                  className="text-[#7c3aed] hover:text-[#6d28d9] font-bold transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Log In Signature Gradient Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="login-submit-btn"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] hover:from-[#6d28d9] hover:to-[#06b6d4] text-white text-sm font-bold shadow-[0_10px_25px_rgba(124,58,237,0.3)] hover:shadow-[0_14px_30px_rgba(124,58,237,0.4)] active:scale-[0.99] transition-all cursor-pointer"
                >
                  Log in
                </button>
              </div>
            </form>

            {/* Divider Or */}
            <div className="relative flex items-center justify-center my-3">
              <div className="w-full border-t border-[#7c3aed]/15" />
              <span className="absolute px-3 bg-white/90 text-xs text-[#6b6478] font-semibold">
                Or
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-white border border-[#7c3aed]/15 hover:bg-violet-50 text-xs font-bold text-[#1f1b2e] shadow-2xs transition-colors cursor-pointer"
              >
                <span className="font-bold text-red-500">G</span>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-white border border-[#7c3aed]/15 hover:bg-violet-50 text-xs font-bold text-[#1f1b2e] shadow-2xs transition-colors cursor-pointer"
              >
                <span></span>
                <span>Apple</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-white border border-[#7c3aed]/15 hover:bg-violet-50 text-xs font-bold text-[#1f1b2e] shadow-2xs transition-colors cursor-pointer"
              >
                <span className="font-bold font-mono">𝕏</span>
                <span>Twitter</span>
              </button>
            </div>

            {/* Quick 1-Click Access for Seamless Testing */}
            <div className="pt-1 text-center">
              <span className="text-[11px] text-[#6b6478] font-bold block mb-1.5">Instant Demo Switch:</span>
              <div className="inline-flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('customer')}
                  className="px-3 py-1 rounded-xl bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 text-[11px] font-bold hover:bg-[#7c3aed]/20 transition-colors cursor-pointer"
                >
                  Customer (John) →
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/25 text-[11px] font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  Admin Mode →
                </button>
              </div>
            </div>
          </div>

          {/* Footer Signup Link */}
          <div className="pt-6 text-center text-xs text-[#6b6478]">
            <span>Don't have an account? </span>
            <button
              onClick={() => handleQuickDemo('customer')}
              className="font-bold text-[#7c3aed] hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
