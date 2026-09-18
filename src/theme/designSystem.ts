/**
 * Centralized Nexa Creatives Design System
 * Defines colors, typography tokens, glassmorphism classes, and interaction tokens.
 * Changes here seamlessly cascade throughout the dashboard, public profile, and modules.
 */

export const NEXA_THEME = {
  colors: {
    brand: {
      primary: '#9333ea',    // Vivid Nexa Purple
      accent: '#a855f7',     // Soft Glow Purple
      light: '#c084fc',      // Bright Highlight Purple
      dark: '#6b21a8',       // Deep Brand Purple
      deepest: '#3b0764',    // Dark Void Purple
    },
    canvas: {
      background: '#09090b', // Deep rich zinc/black
      surface: '#121118',    // Elevated card surface with subtle violet tint
      surfaceHover: '#181722',
      border: 'rgba(255, 255, 255, 0.08)',
      borderHover: 'rgba(168, 85, 247, 0.35)',
    },
    status: {
      active: '#10b981',     // Emerald active indicator
      warning: '#f59e0b',
      locked: '#ef4444',
    }
  },
  classes: {
    // Glassmorphism container
    glassCard: 'bg-[#121118]/80 backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/25 transition-all duration-300 rounded-2xl shadow-xl shadow-black/40',
    glassCardStatic: 'bg-[#121118]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl shadow-black/40',
    glassCardFlat: 'bg-white/[0.02] border border-white/[0.06] rounded-xl',
    
    // Buttons
    buttonPrimary: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
    buttonSecondary: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-zinc-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-purple-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer',
    buttonGhost: 'inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150 cursor-pointer',
    
    // Glows and gradients
    purpleGradientText: 'bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-200 to-indigo-200',
    ambientGlow: 'pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/20 via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm',
  }
};
