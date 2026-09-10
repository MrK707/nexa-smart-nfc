import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  LayoutDashboard, User, Palette, Link2, Briefcase, BarChart3, Settings as SettingsIcon,
  HelpCircle, LogOut, Bell, ChevronDown, Camera, Copy, ExternalLink, QrCode, Share2,
  Edit3, Check, X, Plus, Trash2, GripVertical, Eye, EyeOff,
  Phone, Mail, Globe, MapPin, MessageCircle, Menu,
  Loader2, AlertTriangle, ShieldCheck, KeyRound, CheckCircle2, Sparkles, ArrowUpRight,
  ImagePlus, Download, Lock
} from "lucide-react";
import {
  FaInstagram as Instagram,
  FaLinkedin as Linkedin,
  FaFacebook as Facebook,
  FaXTwitter as Twitter,
  FaYoutube as Youtube
} from "react-icons/fa6";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

/* ============================================================
   NEXA SMART NFC — Customer Dashboard (UI-level prototype)
   All data below is local mock state. Swap the `useProfileStore`
   hook for real API/Supabase calls when a backend is connected —
   every other component only talks to the store, never to
   localStorage or hardcoded data directly.
   ============================================================ */

const BRAND = {
  name: "Nexa Creatives",
  product: "Nexa Smart NFC",
  baseUrl: (typeof window !== "undefined" && window.__NEXA_BASE_URL__) || "tap.nexacreatives.site",
};

const COLORS = {
  primary: "#7C3AED",
  bright: "#A855F7",
  soft: "#C084FC",
  bgDeep: "#050509",
  bgDash: "#09090F",
  card: "#11111A",
  cardSoft: "#151522",
  border: "#272333",
  text: "#F5F3FF",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  success: "#22C55E",
  error: "#EF4444",
};

const NAV_ITEMS = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "My Profile", icon: User },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "links", label: "Links", icon: Link2 },
  { key: "portfolio", label: "Portfolio", icon: Briefcase },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

const SOCIAL_FIELDS = [
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "instagram.com/username" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "linkedin.com/in/username" },
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "facebook.com/username" },
  { key: "twitter", label: "X / Twitter", icon: Twitter, placeholder: "x.com/username" },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "youtube.com/@channel" },
];

const APPEARANCE_PRESETS = [
  { key: "nexa-dark", name: "Nexa Dark", swatch: ["#050509", "#7C3AED", "#F5F3FF"] },
  { key: "midnight", name: "Midnight", swatch: ["#0B0B14", "#4C1D95", "#E9E6FF"] },
  { key: "minimal", name: "Minimal", swatch: ["#111111", "#8B5CF6", "#FFFFFF"] },
  { key: "professional", name: "Professional", swatch: ["#0D0D12", "#6D28D9", "#F3F1FF"] },
];

const ACCENT_OPTIONS = ["#7C3AED", "#A855F7", "#8B5CF6", "#22C55E", "#38BDF8"];
const BUTTON_STYLES = ["Solid", "Outline", "Soft"];
const BACKGROUND_STYLES = ["Glow", "Grid", "Plain"];

const uid = () => Math.random().toString(36).slice(2, 10);

/* ---------- mock initial data ---------- */

const initialProfile = {
  id: "nc001",
  profileCode: "NC001",
  name: "Alex Morgan",
  title: "Founder & Creative Director",
  company: "Morgan Studio",
  bio: "Building brands that feel alive — based in Colombo, working with clients worldwide.",
  photo: null,
  phone: "+94 77 123 4567",
  whatsapp: "+94 77 123 4567",
  email: "alex@morganstudio.com",
  website: "morganstudio.com",
  location: "Colombo, Sri Lanka",
  social: {
    instagram: "instagram.com/alexmorgan",
    linkedin: "linkedin.com/in/alexmorgan",
    facebook: "",
    twitter: "",
    youtube: "",
  },
};

const initialLinks = [
  { id: uid(), label: "Book a call", url: "cal.com/alexmorgan", enabled: true },
  { id: uid(), label: "Portfolio site", url: "morganstudio.com/work", enabled: true },
  { id: uid(), label: "WhatsApp", url: "wa.me/94771234567", enabled: true },
];

const initialPortfolio = [
  { id: uid(), title: "Aurora Rebrand", category: "Branding", description: "Full identity system for a fintech startup.", url: "morganstudio.com/aurora", image: null },
  { id: uid(), title: "Solace App", category: "Product Design", description: "Mobile wellness app design and prototyping.", url: "morganstudio.com/solace", image: null },
];

const initialAppearance = {
  preset: "nexa-dark",
  accent: "#7C3AED",
  buttonStyle: "Solid",
  backgroundStyle: "Glow",
};

const demoAnalytics = {
  totals: { views: 1284, taps: 412, scans: 96, linkClicks: 358, whatsapp: 74, phone: 41, email: 63 },
  series: [
    { day: "Mon", views: 120, taps: 40 },
    { day: "Tue", views: 180, taps: 55 },
    { day: "Wed", views: 150, taps: 48 },
    { day: "Thu", views: 210, taps: 70 },
    { day: "Fri", views: 260, taps: 88 },
    { day: "Sat", views: 190, taps: 60 },
    { day: "Sun", views: 174, taps: 51 },
  ],
  channels: [
    { name: "WhatsApp", value: 74 },
    { name: "Phone", value: 41 },
    { name: "Email", value: 63 },
    { name: "Website", value: 112 },
    { name: "Social", value: 68 },
  ],
};

/* ============================================================
   Global style injection — brand tokens, keyframes, utilities.
   Plain CSS is used for exact brand colors / motion since the
   Tailwind runtime here only exposes precompiled core utilities.
   ============================================================ */

function GlobalStyles() {
  return (
    <style>{`
      .nexa-root {
        --primary: ${COLORS.primary};
        --bright: ${COLORS.bright};
        --soft: ${COLORS.soft};
        --bg-deep: ${COLORS.bgDeep};
        --bg-dash: ${COLORS.bgDash};
        --card: ${COLORS.card};
        --card-soft: ${COLORS.cardSoft};
        --border: ${COLORS.border};
        --text: ${COLORS.text};
        --text-secondary: ${COLORS.textSecondary};
        --text-muted: ${COLORS.textMuted};
        --success: ${COLORS.success};
        --error: ${COLORS.error};
        font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
        color: var(--text);
        background: var(--bg-dash);
        min-height: 100vh;
        position: relative;
      }
      .nexa-root * { box-sizing: border-box; }
      .nexa-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
      .nexa-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 8px; }

      @keyframes nexaGlowDrift {
        0%   { transform: translate(-6%, -4%) scale(1); opacity: 0.55; }
        50%  { transform: translate(4%, 3%) scale(1.08); opacity: 0.75; }
        100% { transform: translate(-6%, -4%) scale(1); opacity: 0.55; }
      }
      @keyframes nexaFloat {
        0%   { transform: translateY(0px); opacity: 0.35; }
        50%  { transform: translateY(-14px); opacity: 0.7; }
        100% { transform: translateY(0px); opacity: 0.35; }
      }
      @keyframes nexaFadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes nexaFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes nexaScaleIn {
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes nexaToastIn {
        from { opacity: 0; transform: translate(-50%, 12px); }
        to   { opacity: 1; transform: translate(-50%, 0); }
      }
      @keyframes nexaShimmer {
        0% { background-position: -300px 0; }
        100% { background-position: 300px 0; }
      }
      @keyframes nexaSpin {
        to { transform: rotate(360deg); }
      }
      @keyframes nexaFillBar {
        from { width: 0%; }
      }

      @media (prefers-reduced-motion: reduce) {
        .nexa-root *, .nexa-root *::before, .nexa-root *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }

      .glow-orb {
        position: absolute;
        border-radius: 999px;
        filter: blur(90px);
        pointer-events: none;
        background: radial-gradient(circle, rgba(124,58,237,0.55) 0%, rgba(124,58,237,0) 70%);
        animation: nexaGlowDrift 18s ease-in-out infinite;
      }
      .grain {
        position: absolute; inset: 0; pointer-events: none; opacity: 0.035; mix-blend-mode: overlay;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }
      .particle {
        position: absolute; width: 3px; height: 3px; border-radius: 999px;
        background: var(--soft); animation: nexaFloat 7s ease-in-out infinite;
      }

      .fade-up { animation: nexaFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
      .fade-in { animation: nexaFadeIn 0.4s ease both; }
      .scale-in { animation: nexaScaleIn 0.22s cubic-bezier(0.16,1,0.3,1) both; }

      .nexa-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
      }
      .nexa-card:hover { border-color: rgba(124,58,237,0.4); }
      .nexa-card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px -14px rgba(124,58,237,0.35);
      }

      .nexa-input {
        background: var(--card-soft);
        border: 1px solid var(--border);
        color: var(--text);
        border-radius: 10px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .nexa-input::placeholder { color: var(--text-muted); }
      .nexa-input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(124,58,237,0.25);
      }

      .nexa-btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--bright));
        color: #fff;
        border: none;
        border-radius: 10px;
        transition: filter 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        box-shadow: 0 8px 20px -8px rgba(124,58,237,0.55);
      }
      .nexa-btn-primary:hover { filter: brightness(1.08); }
      .nexa-btn-primary:active { transform: scale(0.98); }
      .nexa-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

      .nexa-btn-secondary {
        background: var(--card-soft);
        border: 1px solid var(--border);
        color: var(--text);
        border-radius: 10px;
        transition: border-color 0.2s ease, background 0.2s ease, transform 0.15s ease;
      }
      .nexa-btn-secondary:hover { border-color: rgba(124,58,237,0.45); background: #1a1a29; }
      .nexa-btn-secondary:active { transform: scale(0.98); }

      .nexa-nav-item {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 12px; border-radius: 10px;
        color: var(--text-secondary);
        transition: background 0.25s ease, color 0.25s ease;
        position: relative;
      }
      .nexa-nav-item:hover { background: rgba(124,58,237,0.08); color: var(--text); }
      .nexa-nav-item.active {
        background: rgba(124,58,237,0.14);
        color: var(--text);
        box-shadow: inset 0 0 0 1px rgba(124,58,237,0.35), 0 0 22px -8px rgba(124,58,237,0.55);
      }
      .nexa-nav-item.active::before {
        content: "";
        position: absolute; left: -12px; top: 50%; transform: translateY(-50%);
        width: 3px; height: 60%; border-radius: 4px;
        background: linear-gradient(180deg, var(--primary), var(--bright));
      }

      .progress-track { background: var(--card-soft); border-radius: 999px; overflow: hidden; height: 8px; }
      .progress-fill {
        height: 100%; border-radius: 999px;
        background: linear-gradient(90deg, var(--primary), var(--bright));
        animation: nexaFillBar 1s cubic-bezier(0.16,1,0.3,1) both;
      }

      .skeleton {
        background: linear-gradient(90deg, var(--card-soft) 25%, #1d1d2c 37%, var(--card-soft) 63%);
        background-size: 400px 100%;
        animation: nexaShimmer 1.4s ease infinite;
        border-radius: 8px;
      }

      .spin { animation: nexaSpin 0.8s linear infinite; }

      .toast-pop {
        position: fixed; bottom: 24px; left: 50%;
        animation: nexaToastIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
      }

      input[type="range"].nexa-range {
        -webkit-appearance: none; height: 6px; border-radius: 999px;
        background: var(--card-soft); outline: none;
      }
      input[type="range"].nexa-range::-webkit-slider-thumb {
        -webkit-appearance: none; width: 16px; height: 16px; border-radius: 999px;
        background: var(--primary); cursor: pointer; box-shadow: 0 0 0 4px rgba(124,58,237,0.2);
      }

      /* ---- signature layer ---- */
      .cursor-glow {
        position: fixed; top: 0; left: 0; width: 380px; height: 380px; border-radius: 999px;
        background: radial-gradient(circle, rgba(168,85,247,0.16) 0%, rgba(124,58,237,0) 70%);
        pointer-events: none; z-index: 30; transform: translate(-50%, -50%);
        transition: transform 0.12s ease-out;
        mix-blend-mode: screen;
      }
      @media (hover: none) { .cursor-glow { display: none; } }

      .boot-splash {
        position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center;
        background: var(--bg-deep); animation: nexaFadeIn 0.3s ease both;
      }
      .boot-splash.leaving { animation: nexaBootOut 0.6s cubic-bezier(0.7,0,0.3,1) both; }
      @keyframes nexaBootOut { to { opacity: 0; transform: scale(1.04); } }
      .boot-mark { display: flex; flex-direction: column; align-items: center; gap: 16px; }
      .boot-logo {
        width: 56px; height: 56px; border-radius: 16px;
        background: linear-gradient(135deg, var(--primary), var(--bright));
        display: flex; align-items: center; justify-content: center;
        animation: nexaScaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both, nexaBootPulse 1.8s ease-in-out 0.5s infinite;
        box-shadow: 0 0 40px -6px rgba(124,58,237,0.8);
      }
      @keyframes nexaBootPulse {
        0%, 100% { box-shadow: 0 0 40px -6px rgba(124,58,237,0.8); }
        50% { box-shadow: 0 0 60px -4px rgba(168,85,247,0.95); }
      }
      .boot-word { font-size: 12px; letter-spacing: 0.35em; color: var(--text-muted); animation: nexaFadeUp 0.6s ease 0.2s both; }
      .boot-line { width: 120px; height: 2px; border-radius: 999px; background: var(--border); overflow: hidden; position: relative; }
      .boot-line::after {
        content: ""; position: absolute; inset: 0; width: 40%;
        background: linear-gradient(90deg, transparent, var(--bright), transparent);
        animation: nexaBootLine 1.1s ease-in-out infinite;
      }
      @keyframes nexaBootLine { 0% { transform: translateX(-120%); } 100% { transform: translateX(340%); } }

      .top-progress {
        position: fixed; top: 0; left: 0; height: 2px; z-index: 60;
        background: linear-gradient(90deg, var(--primary), var(--bright));
        box-shadow: 0 0 10px 1px rgba(168,85,247,0.7);
        transition: width 0.25s ease, opacity 0.35s ease;
      }

      .tilt-wrap { transform-style: preserve-3d; transition: transform 0.15s ease-out; will-change: transform; }

      .nexa-btn-primary { position: relative; overflow: hidden; }
      .nexa-btn-primary::before {
        content: ""; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
        background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
        transform: skewX(-20deg); transition: left 0.6s ease;
      }
      .nexa-btn-primary:hover::before { left: 130%; }

      .aurora-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }

      .reveal {
        opacity: 0; transform: translateY(18px);
        transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
      }
      .reveal.in { opacity: 1; transform: translateY(0); }

      @media (prefers-reduced-motion: reduce) {
        .cursor-glow { display: none; }
        .reveal { opacity: 1; transform: none; transition: none; }
        .boot-logo { animation: nexaScaleIn 0.3s ease both; }
      }
    `}</style>
  );
}

/* ---------- signature motion layer ---------- */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

function CursorGlow() {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const move = (e) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduced]);
  if (reduced) return null;
  return <div ref={ref} className="cursor-glow" />;
}

function BootSplash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 950);
    const t2 = setTimeout(() => onDone(), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div className={`boot-splash ${leaving ? "leaving" : ""}`}>
      <div className="boot-mark">
        <div className="boot-logo"><Sparkles size={24} color="#fff" /></div>
        <div className="boot-word">NEXA CREATIVES</div>
        <div className="boot-line" />
      </div>
    </div>
  );
}

function TopProgressBar({ active }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!active) return;
    setWidth(15);
    const t1 = setTimeout(() => setWidth(75), 30);
    const t2 = setTimeout(() => setWidth(100), 280);
    const t3 = setTimeout(() => setWidth(0), 560);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active]);
  if (width === 0) return null;
  return <div className="top-progress" style={{ width: `${width}%`, opacity: width === 0 ? 0 : 1 }} />;
}

function TiltCard({ children, max = 8, className = "", style }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(700px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
  };
  return (
    <div ref={ref} className={`tilt-wrap ${className}`} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

function CountUp({ value, duration = 900, format }) {
  const [display, setDisplay] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) { setDisplay(value); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);
  return <>{format ? format(display) : display.toLocaleString()}</>;
}

function Reveal({ children, delay = 0, className = "", ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) { setInView(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);
  return (
    <div ref={ref} className={`reveal ${inView ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </div>
  );
}

function AuroraBackground() {
  return (
    <div className="aurora-bg">
      <div className="glow-orb" style={{ width: 480, height: 480, top: "-14%", left: "-10%" }} />
      <div className="glow-orb" style={{ width: 380, height: 380, bottom: "-16%", right: "-8%", animationDelay: "5s" }} />
      <div className="grain" />
    </div>
  );
}

/* ---------- small reusable UI atoms ---------- */

function Field({ label, hint, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm mb-1.5" style={{ color: COLORS.textSecondary }}>{label}</span>
      {children}
      {hint && <span className="block text-xs mt-1" style={{ color: COLORS.textMuted }}>{hint}</span>}
    </label>
  );
}

function TextInput(props) {
  const { icon: Icon, ...rest } = props;
  return (
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.textMuted }} />}
      <input
        {...rest}
        className={`nexa-input w-full text-sm py-2.5 ${Icon ? "pl-9 pr-3" : "px-3"}`}
      />
    </div>
  );
}

function TextArea(props) {
  return <textarea {...props} className="nexa-input w-full text-sm px-3 py-2.5 resize-none" />;
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-sm"
      style={{ color: COLORS.textSecondary }}
    >
      <span
        className="relative inline-block rounded-full transition-colors"
        style={{ width: 36, height: 20, background: checked ? COLORS.primary : COLORS.border, transition: "background 0.2s ease" }}
      >
        <span
          className="absolute rounded-full bg-white transition-transform"
          style={{ width: 16, height: 16, top: 2, left: 2, transform: checked ? "translateX(16px)" : "translateX(0)", transition: "transform 0.2s ease" }}
        />
      </span>
      {label}
    </button>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div className="toast-pop z-50">
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm shadow-2xl"
        style={{ background: COLORS.card, border: `1px solid ${isError ? COLORS.error : COLORS.success}55` }}
      >
        {isError ? <AlertTriangle size={16} color={COLORS.error} /> : <CheckCircle2 size={16} color={COLORS.success} />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children, footer, width = 420 }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in"
      style={{ background: "rgba(5,5,9,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="nexa-card scale-in w-full p-6"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-white/5">
            <X size={16} color={COLORS.textMuted} />
          </button>
        </div>
        <div className="text-sm" style={{ color: COLORS.textSecondary }}>{children}</div>
        {footer && <div className="flex justify-end gap-2 mt-5">{footer}</div>}
      </div>
    </div>
  );
}

function Avatar({ photo, name, size = 44 }) {
  const initials = (name || "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return photo ? (
    <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />
  ) : (
    <div
      className="flex items-center justify-center font-semibold"
      style={{
        width: size, height: size, borderRadius: "50%",
        background: "linear-gradient(135deg, var(--primary), var(--bright))",
        color: "#fff", fontSize: size * 0.36,
      }}
    >
      {initials || "?"}
    </div>
  );
}

/* ---------- image compression helper ---------- */

function compressImage(file, maxSize = 640, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ============================================================
   Login Page
   ============================================================ */

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    // UI-level auth stand-in. Real auth (Supabase/Auth provider) plugs in here.
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: COLORS.bgDeep }}>
      <div className="glow-orb" style={{ width: 520, height: 520, top: "-10%", left: "-8%" }} />
      <div className="glow-orb" style={{ width: 420, height: 420, bottom: "-14%", right: "-6%", animationDelay: "4s" }} />
      <div className="grain" />

      <div className="relative z-10 w-full max-w-5xl mx-4 grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden nexa-card fade-up" style={{ minHeight: 560 }}>
        {/* Left brand panel */}
        <div className="hidden md:flex flex-col justify-between p-10 relative" style={{ background: "linear-gradient(160deg, #0c0c16 0%, #120c1f 100%)", borderRight: `1px solid ${COLORS.border}` }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--bright))" }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">NEXA</div>
                <div className="text-[10px] tracking-wide" style={{ color: COLORS.textMuted }}>CREATIVES</div>
              </div>
            </div>
            <div className="text-xs mt-1" style={{ color: COLORS.textMuted, letterSpacing: "0.08em" }}>SMART NFC</div>
          </div>

          <div>
            <h1 className="text-3xl font-semibold leading-tight mb-3">
              Your identity,<br />tap and shared.
            </h1>
            <p className="text-sm max-w-xs" style={{ color: COLORS.textSecondary }}>
              Manage the profile behind your Nexa Smart NFC card from one place — update once, and every tap shows the latest you.
            </p>
          </div>

          {/* Abstract NFC card visual */}
          <div className="relative h-40">
            {[0, 1, 2].map((i) => (
              <span key={i} className="particle" style={{ left: `${20 + i * 22}%`, top: `${10 + i * 18}%`, animationDelay: `${i * 1.4}s` }} />
            ))}
            <TiltCard max={10} className="absolute bottom-0 left-0" style={{ width: 208 }}>
              <div
                className="w-52 h-32 rounded-2xl p-4 flex flex-col justify-between"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(21,21,34,0.9))",
                  border: "1px solid rgba(168,85,247,0.35)",
                  boxShadow: "0 20px 50px -20px rgba(124,58,237,0.6)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-6 h-4 rounded-sm" style={{ background: "rgba(255,255,255,0.25)" }} />
                  <Sparkles size={14} color={COLORS.soft} />
                </div>
                <div>
                  <div className="text-[11px]" style={{ color: COLORS.textSecondary }}>tap.nexacreatives.site/p/NC001</div>
                  <div className="text-sm font-medium mt-0.5">Alex Morgan</div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Right login form */}
        <div className="flex flex-col justify-center p-8 md:p-12" style={{ background: COLORS.bgDash }}>
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--bright))" }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <div className="text-sm font-semibold">NEXA CREATIVES</div>
          </div>

          <h2 className="text-2xl font-semibold mb-1">Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: COLORS.textSecondary }}>Manage your digital business card</p>

          <form onSubmit={submit}>
            <Field label="Email">
              <TextInput icon={Mail} type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password">
              <div className="relative">
                <TextInput icon={Lock} type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff size={16} color={COLORS.textMuted} /> : <Eye size={16} color={COLORS.textMuted} />}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between mb-6 text-sm">
              <Toggle checked={remember} onChange={setRemember} label="Remember me" />
              <button type="button" className="hover:underline" style={{ color: COLORS.soft }}>Forgot password?</button>
            </div>

            <button type="submit" disabled={loading} className="nexa-btn-primary w-full py-2.5 text-sm font-medium flex items-center justify-center gap-2">
              {loading ? (<><Loader2 size={16} className="spin" /> Signing in…</>) : "Sign In"}
            </button>
          </form>

          <div className="mt-10 text-center text-xs" style={{ color: COLORS.textMuted }}>
            Powered by Nexa Creatives
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Sidebar & Topbar
   ============================================================ */

function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile, onLogout, profile }) {
  const content = (
    <div className="h-full flex flex-col p-5" style={{ background: COLORS.bgDash }}>
      <div className="flex items-center gap-2 mb-8 px-1">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--primary), var(--bright))" }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">NEXA</div>
          <div className="text-[10px] tracking-wide" style={{ color: COLORS.textMuted }}>CREATIVES</div>
        </div>
      </div>
      <div className="text-[10px] mb-3 px-2" style={{ color: COLORS.textMuted, letterSpacing: "0.1em" }}>SMART NFC</div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => { onNavigate(item.key); onCloseMobile && onCloseMobile(); }}
            className={`nexa-nav-item text-sm text-left ${current === item.key ? "active" : ""}`}
          >
            <item.icon size={17} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t pt-3 mt-3" style={{ borderColor: COLORS.border }}>
        <button className="nexa-nav-item text-sm w-full text-left mb-1">
          <HelpCircle size={17} /> Help & Support
        </button>
        <div className="flex items-center gap-2 px-2 py-2 mt-1">
          <Avatar photo={profile.photo} name={profile.name} size={32} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{profile.name}</div>
            <div className="text-[11px] truncate" style={{ color: COLORS.textMuted }}>{profile.email}</div>
          </div>
          <button onClick={onLogout} title="Logout" className="p-1.5 rounded-md hover:bg-white/5">
            <LogOut size={15} color={COLORS.textMuted} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block w-64 flex-shrink-0 border-r" style={{ borderColor: COLORS.border }}>
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 fade-in" style={{ background: "rgba(5,5,9,0.7)" }} onClick={onCloseMobile}>
          <div className="w-72 h-full scale-in" style={{ transformOrigin: "left" }} onClick={(e) => e.stopPropagation()}>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

function Topbar({ title, greeting, onOpenMobileNav, profile }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b sticky top-0 z-20" style={{ borderColor: COLORS.border, background: "rgba(9,9,15,0.85)", backdropFilter: "blur(10px)" }}>
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onOpenMobileNav} className="md:hidden p-1.5 rounded-md hover:bg-white/5">
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-semibold truncate">{title}</h1>
          {greeting && <div className="text-xs" style={{ color: COLORS.textMuted }}>{greeting}</div>}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="relative p-2 rounded-lg hover:bg-white/5">
          <Bell size={17} color={COLORS.textSecondary} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: COLORS.primary }} />
        </button>
        <div className="relative">
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/5">
            <Avatar photo={profile.photo} name={profile.name} size={30} />
            <span className="hidden sm:block text-sm">{profile.name.split(" ")[0]}</span>
            <ChevronDown size={14} color={COLORS.textMuted} />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 nexa-card scale-in p-1.5 text-sm" onMouseLeave={() => setOpen(false)}>
              <button className="nexa-nav-item w-full text-left"><User size={15} /> Profile</button>
              <button className="nexa-nav-item w-full text-left"><SettingsIcon size={15} /> Settings</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   Profile preview card (used on dashboard + editor live preview)
   ============================================================ */

function ProfilePreviewCard({ profile, appearance, compact }) {
  const socials = Object.entries(profile.social || {}).filter(([, v]) => v);
  const iconMap = { instagram: Instagram, linkedin: Linkedin, facebook: Facebook, twitter: Twitter, youtube: Youtube };
  return (
    <div
      className="nexa-card p-6 relative overflow-hidden"
      style={{ background: "linear-gradient(165deg, #12101c 0%, #0c0c14 100%)" }}
    >
      <div className="glow-orb" style={{ width: 200, height: 200, top: -60, right: -60, opacity: 0.4 }} />
      <div className="relative flex flex-col items-center text-center">
        <Avatar photo={profile.photo} name={profile.name} size={compact ? 64 : 80} />
        <h3 className="mt-3 font-semibold" style={{ fontSize: compact ? 16 : 18 }}>{profile.name}</h3>
        <div className="text-sm" style={{ color: COLORS.soft }}>{profile.title}</div>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>{profile.company}</div>
        {profile.bio && <p className="text-xs mt-3 max-w-xs" style={{ color: COLORS.textSecondary }}>{profile.bio}</p>}

        {socials.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            {socials.map(([key]) => {
              const Icon = iconMap[key] || Globe;
              return (
                <span key={key} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: COLORS.cardSoft, border: `1px solid ${COLORS.border}` }}>
                  <Icon size={14} color={COLORS.soft} />
                </span>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 w-full">
          {profile.phone && (
            <a className="nexa-btn-secondary flex-1 flex items-center justify-center gap-1.5 py-2 text-xs" href={`tel:${profile.phone}`}>
              <Phone size={13} /> Call
            </a>
          )}
          {profile.email && (
            <a className="nexa-btn-secondary flex-1 flex items-center justify-center gap-1.5 py-2 text-xs" href={`mailto:${profile.email}`}>
              <Mail size={13} /> Email
            </a>
          )}
        </div>

        <div className="w-full border-t mt-5 pt-3 flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <span className="text-[11px]" style={{ color: COLORS.textMuted }}>{BRAND.baseUrl}/p/{profile.profileCode}</span>
          <span className="text-[11px] flex items-center gap-1 font-medium" style={{ color: COLORS.soft }}>
            View <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Profile completion widget
   ============================================================ */

function computeCompletion(profile) {
  const checks = [
    { key: "photo", label: "Profile photo", done: !!profile.photo },
    { key: "name", label: "Name", done: !!profile.name },
    { key: "title", label: "Job title", done: !!profile.title },
    { key: "phone", label: "Phone", done: !!profile.phone },
    { key: "email", label: "Email", done: !!profile.email },
    { key: "website", label: "Website", done: !!profile.website },
  ];
  const done = checks.filter((c) => c.done).length;
  return { checks, percent: Math.round((done / checks.length) * 100) };
}

function ProfileCompletionCard({ profile, onNavigate }) {
  const { checks, percent } = computeCompletion(profile);
  return (
    <div className="nexa-card p-6">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Profile strength</span>
        <span className="text-sm font-semibold" style={{ color: COLORS.soft }}><CountUp value={percent} duration={800} format={(v) => `${v}%`} /></span>
      </div>
      <div className="progress-track mb-4">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-y-2 mb-4">
        {checks.map((c) => (
          <div key={c.key} className="flex items-center gap-1.5 text-xs" style={{ color: c.done ? COLORS.textSecondary : COLORS.textMuted }}>
            {c.done ? <Check size={13} color={COLORS.success} /> : <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ border: `1px solid ${COLORS.border}` }} />}
            {c.label}
          </div>
        ))}
      </div>
      {percent < 100 && (
        <button onClick={() => onNavigate("profile")} className="nexa-btn-secondary text-xs px-3 py-2 w-full">Complete Profile</button>
      )}
    </div>
  );
}

/* ============================================================
   Quick action cards
   ============================================================ */

function QuickActionCard({ icon: Icon, title, description, onClick }) {
  return (
    <button onClick={onClick} className="nexa-card nexa-card-hover p-5 text-left w-full">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "rgba(124,58,237,0.12)" }}>
        <Icon size={17} color={COLORS.soft} />
      </div>
      <div className="text-sm font-medium mb-1">{title}</div>
      <div className="text-xs" style={{ color: COLORS.textMuted }}>{description}</div>
    </button>
  );
}

/* ============================================================
   Dashboard home
   ============================================================ */

function DashboardHome({ profile, appearance, onNavigate, notify, openPublicPreview }) {
  const firstName = profile.name.split(" ")[0];

  const copyLink = () => {
    const url = `https://${BRAND.baseUrl}/p/${profile.profileCode}`;
    navigator.clipboard?.writeText(url).then(
      () => notify(`Link copied — ${url}`),
      () => notify("Couldn't copy the link", "error")
    );
  };

  const downloadQr = () => {
    const url = `https://${BRAND.baseUrl}/p/${profile.profileCode}`;
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=124-58-237&bgcolor=9-9-15&data=${encodeURIComponent(url)}`;
    const a = document.createElement("a");
    a.href = qrSrc;
    a.download = `nexa-${profile.profileCode}-qr.png`;
    a.target = "_blank";
    a.rel = "noopener";
    a.click();
    notify("Opening your QR code…");
  };

  const actions = [
    { icon: Edit3, title: "Edit Profile", description: "Update your personal information.", onClick: () => onNavigate("profile") },
    { icon: Share2, title: "Share Profile", description: "Copy your NFC profile link.", onClick: copyLink },
    { icon: ExternalLink, title: "View Profile", description: "See your public profile.", onClick: openPublicPreview },
    { icon: QrCode, title: "Download QR", description: "Generate your profile QR code.", onClick: downloadQr },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto relative">
      <Reveal>
        <div className="mb-8">
          <div className="text-sm mb-1" style={{ color: COLORS.textMuted }}>Good morning, {firstName} 👋</div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Your digital identity is ready.</h2>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>Manage your NFC profile and keep your contact information up to date.</p>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {actions.map((a, i) => (
            <Reveal key={a.title} delay={i * 70}>
              <TiltCard max={4}>
                <QuickActionCard icon={a.icon} title={a.title} description={a.description} onClick={a.onClick} />
              </TiltCard>
            </Reveal>
          ))}
          <Reveal delay={actions.length * 70} className="sm:col-span-2">
            <ProfileCompletionCard profile={profile} onNavigate={onNavigate} />
          </Reveal>
        </div>

        <Reveal delay={100}>
          <TiltCard max={4}>
            <ProfilePreviewCard profile={profile} appearance={appearance} />
          </TiltCard>
        </Reveal>
      </div>
    </div>
  );
}

/* ============================================================
   Photo uploader
   ============================================================ */

function PhotoUploader({ photo, name, onChange }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => (p === null ? 0 : Math.min(p + 18, 90)));
    }, 90);
    try {
      const dataUrl = await compressImage(file);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        onChange(dataUrl);
        setProgress(null);
      }, 300);
    } catch {
      clearInterval(interval);
      setProgress(null);
    }
  };

  return (
    <div className="flex items-center gap-5">
      <div
        className="relative group cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <Avatar photo={photo} name={name} size={84} />
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(5,5,9,0.65)" }}
        >
          {progress === null ? <><Camera size={16} /></> : `${progress}%`}
        </div>
        {progress !== null && (
          <svg className="absolute inset-0 -rotate-90" width={84} height={84}>
            <circle cx={42} cy={42} r={38} stroke={COLORS.border} strokeWidth={3} fill="none" />
            <circle
              cx={42} cy={42} r={38} stroke={COLORS.primary} strokeWidth={3} fill="none"
              strokeDasharray={2 * Math.PI * 38}
              strokeDashoffset={2 * Math.PI * 38 * (1 - progress / 100)}
              style={{ transition: "stroke-dashoffset 0.2s ease" }}
            />
          </svg>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} className="nexa-btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
          <ImagePlus size={14} /> Change Photo
        </button>
        {photo && (
          <button type="button" onClick={() => onChange(null)} className="text-xs text-left" style={{ color: COLORS.textMuted }}>
            Remove photo
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

/* ============================================================
   Profile editor
   ============================================================ */

function ProfileEditorPage({ savedProfile, appearance, onSave, notify }) {
  const [draft, setDraft] = useState(savedProfile);
  const [saving, setSaving] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(savedProfile);

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const updateSocial = (key, value) => setDraft((d) => ({ ...d, social: { ...d.social, [key]: value } }));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      onSave(draft);
      setSaving(false);
      notify("Changes saved");
    }, 1000);
  };

  const copyLink = () => {
    const url = `https://${BRAND.baseUrl}/p/${draft.profileCode}`;
    navigator.clipboard?.writeText(url).then(() => notify(`Link copied — ${url}`), () => notify("Couldn't copy the link", "error"));
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 fade-up">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Edit Profile</h2>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>This information appears on your public NFC profile.</p>
        </div>
        {dirty && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.14)", color: COLORS.soft }}>Unsaved changes</span>}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <section className="nexa-card p-6">
            <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.text }}>Personal Information</h3>
            <div className="mb-5">
              <PhotoUploader photo={draft.photo} name={draft.name} onChange={(photo) => update({ photo })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Name"><TextInput value={draft.name} onChange={(e) => update({ name: e.target.value })} /></Field>
              <Field label="Job title"><TextInput value={draft.title} onChange={(e) => update({ title: e.target.value })} /></Field>
              <Field label="Company"><TextInput value={draft.company} onChange={(e) => update({ company: e.target.value })} /></Field>
            </div>
            <Field label="Bio" hint="A short line that appears under your title.">
              <TextArea rows={3} value={draft.bio} onChange={(e) => update({ bio: e.target.value })} />
            </Field>
          </section>

          <section className="nexa-card p-6">
            <h3 className="text-sm font-semibold mb-4">Contact</h3>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Phone"><TextInput icon={Phone} value={draft.phone} onChange={(e) => update({ phone: e.target.value })} /></Field>
              <Field label="WhatsApp"><TextInput icon={MessageCircle} value={draft.whatsapp} onChange={(e) => update({ whatsapp: e.target.value })} /></Field>
              <Field label="Email"><TextInput icon={Mail} type="email" value={draft.email} onChange={(e) => update({ email: e.target.value })} /></Field>
              <Field label="Website"><TextInput icon={Globe} value={draft.website} onChange={(e) => update({ website: e.target.value })} /></Field>
              <Field label="Location"><TextInput icon={MapPin} value={draft.location} onChange={(e) => update({ location: e.target.value })} /></Field>
            </div>
          </section>

          <section className="nexa-card p-6">
            <h3 className="text-sm font-semibold mb-4">Social Media</h3>
            <div className="grid sm:grid-cols-2 gap-x-4">
              {SOCIAL_FIELDS.map((f) => (
                <Field key={f.key} label={f.label}>
                  <TextInput icon={f.icon} placeholder={f.placeholder} value={draft.social[f.key]} onChange={(e) => updateSocial(f.key, e.target.value)} />
                </Field>
              ))}
            </div>
          </section>

          <section className="nexa-card p-6">
            <h3 className="text-sm font-semibold mb-3">Profile URL</h3>
            <div className="flex items-center gap-3">
              <div className="nexa-input flex-1 px-3 py-2.5 text-sm" style={{ color: COLORS.textSecondary }}>
                {BRAND.baseUrl}/p/{draft.profileCode}
              </div>
              <button onClick={copyLink} className="nexa-btn-secondary px-3 py-2.5 flex items-center gap-1.5 text-sm"><Copy size={14} /> Copy Link</button>
            </div>
            <p className="text-xs mt-2" style={{ color: COLORS.textMuted }}>This URL is connected to your NFC card.</p>
          </section>

          <div className="flex items-center gap-3 sticky bottom-4">
            <button onClick={save} disabled={!dirty || saving} className="nexa-btn-primary px-5 py-2.5 text-sm font-medium flex items-center gap-2">
              {saving ? (<><Loader2 size={15} className="spin" /> Saving…</>) : "Save Changes"}
            </button>
            {dirty && !saving && (
              <button onClick={() => setDraft(savedProfile)} className="nexa-btn-secondary px-4 py-2.5 text-sm">Discard Changes</button>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="text-xs mb-2 uppercase tracking-wide" style={{ color: COLORS.textMuted }}>Live preview</div>
          <ProfilePreviewCard profile={draft} appearance={appearance} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Appearance page
   ============================================================ */

function AppearancePage({ appearance, onSave, notify, profile }) {
  const [draft, setDraft] = useState(appearance);
  const dirty = JSON.stringify(draft) !== JSON.stringify(appearance);

  const save = () => {
    onSave(draft);
    notify("Appearance updated");
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6 fade-up">
        <h2 className="text-xl md:text-2xl font-semibold">Appearance</h2>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>Choose how your public profile looks. Nexa curates every option to stay premium.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <section className="nexa-card p-6">
            <h3 className="text-sm font-semibold mb-4">Profile style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {APPEARANCE_PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setDraft((d) => ({ ...d, preset: p.key }))}
                  className="nexa-card p-3 text-left"
                  style={{ borderColor: draft.preset === p.key ? COLORS.primary : COLORS.border, boxShadow: draft.preset === p.key ? "0 0 0 1px rgba(124,58,237,0.5)" : "none" }}
                >
                  <div className="flex gap-1 mb-2">
                    {p.swatch.map((c, i) => (
                      <span key={i} className="w-4 h-4 rounded-full" style={{ background: c, border: "1px solid rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <div className="text-xs font-medium">{p.name}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="nexa-card p-6">
            <h3 className="text-sm font-semibold mb-4">Accent color</h3>
            <div className="flex items-center gap-3">
              {ACCENT_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setDraft((d) => ({ ...d, accent: c }))}
                  className="w-8 h-8 rounded-full"
                  style={{ background: c, boxShadow: draft.accent === c ? `0 0 0 3px ${COLORS.bgDash}, 0 0 0 5px ${c}` : "none" }}
                />
              ))}
            </div>
          </section>

          <section className="nexa-card p-6">
            <h3 className="text-sm font-semibold mb-4">Button style</h3>
            <div className="flex gap-2 flex-wrap">
              {BUTTON_STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setDraft((d) => ({ ...d, buttonStyle: s }))}
                  className={draft.buttonStyle === s ? "nexa-btn-primary" : "nexa-btn-secondary"}
                  style={{ padding: "8px 16px", fontSize: 13 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section className="nexa-card p-6">
            <h3 className="text-sm font-semibold mb-4">Background style</h3>
            <div className="flex gap-2 flex-wrap">
              {BACKGROUND_STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setDraft((d) => ({ ...d, backgroundStyle: s }))}
                  className={draft.backgroundStyle === s ? "nexa-btn-primary" : "nexa-btn-secondary"}
                  style={{ padding: "8px 16px", fontSize: 13 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <button onClick={save} disabled={!dirty} className="nexa-btn-primary px-5 py-2.5 text-sm font-medium">Save Changes</button>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="text-xs mb-2 uppercase tracking-wide" style={{ color: COLORS.textMuted }}>Live preview</div>
          <ProfilePreviewCard profile={profile} appearance={draft} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Links management
   ============================================================ */

function LinksPage({ links, onChange, notify }) {
  const [items, setItems] = useState(links);
  const [dragIndex, setDragIndex] = useState(null);
  const dirty = JSON.stringify(items) !== JSON.stringify(links);

  const addLink = () => setItems((l) => [...l, { id: uid(), label: "", url: "", enabled: true }]);
  const updateItem = (id, patch) => setItems((l) => l.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const removeItem = (id) => setItems((l) => l.filter((i) => i.id !== id));

  const onDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    setItems((l) => {
      const copy = [...l];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(index, 0, moved);
      return copy;
    });
    setDragIndex(null);
  };

  const save = () => {
    onChange(items);
    notify("Links updated");
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 fade-up">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Links</h2>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>Add extra links to your profile — booking pages, portfolios, anything you want visitors to reach.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="nexa-card p-10 text-center">
          <Link2 size={22} className="mx-auto mb-3" color={COLORS.textMuted} />
          <h3 className="font-medium mb-1">Add your first link</h3>
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>Give visitors more ways to reach you or see your work.</p>
          <button onClick={addLink} className="nexa-btn-primary px-4 py-2 text-sm inline-flex items-center gap-1.5"><Plus size={14} /> Add link</button>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {items.map((item, index) => (
            <Reveal
              key={item.id}
              delay={index * 50}
              className="nexa-card p-4 flex items-center gap-3"
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(index)}
            >
              <GripVertical size={16} color={COLORS.textMuted} className="cursor-grab flex-shrink-0" />
              <div className="flex-1 grid sm:grid-cols-2 gap-2">
                <TextInput placeholder="Label (e.g. Book a call)" value={item.label} onChange={(e) => updateItem(item.id, { label: e.target.value })} />
                <TextInput placeholder="URL" value={item.url} onChange={(e) => updateItem(item.id, { url: e.target.value })} />
              </div>
              <Toggle checked={item.enabled} onChange={(v) => updateItem(item.id, { enabled: v })} label="" />
              <button onClick={() => removeItem(item.id)} className="p-2 rounded-md hover:bg-white/5 flex-shrink-0">
                <Trash2 size={15} color={COLORS.textMuted} />
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="flex items-center gap-3">
          <button onClick={addLink} className="nexa-btn-secondary px-4 py-2 text-sm inline-flex items-center gap-1.5"><Plus size={14} /> Add link</button>
          <button onClick={save} disabled={!dirty} className="nexa-btn-primary px-5 py-2 text-sm font-medium">Save Changes</button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Portfolio management
   ============================================================ */

function PortfolioCard({ item, onUpdate, onRemove, dragHandlers }) {
  const inputRef = useRef(null);
  const handleImage = async (file) => {
    if (!file) return;
    const dataUrl = await compressImage(file, 480);
    onUpdate({ image: dataUrl });
  };
  return (
    <div className="nexa-card p-4" {...dragHandlers}>
      <div className="flex gap-4">
        <div
          className="w-24 h-24 rounded-lg flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden"
          style={{ background: COLORS.cardSoft, border: `1px dashed ${COLORS.border}` }}
          onClick={() => inputRef.current?.click()}
        >
          {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <ImagePlus size={18} color={COLORS.textMuted} />}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
        </div>
        <div className="flex-1 grid sm:grid-cols-2 gap-2">
          <TextInput placeholder="Project title" value={item.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          <TextInput placeholder="Category" value={item.category} onChange={(e) => onUpdate({ category: e.target.value })} />
          <TextInput placeholder="Project URL" value={item.url} onChange={(e) => onUpdate({ url: e.target.value })} />
          <TextInput placeholder="Description" value={item.description} onChange={(e) => onUpdate({ description: e.target.value })} />
        </div>
        <button onClick={onRemove} className="p-2 rounded-md hover:bg-white/5 flex-shrink-0 h-fit">
          <Trash2 size={15} color={COLORS.textMuted} />
        </button>
      </div>
    </div>
  );
}

function PortfolioPage({ portfolio, onChange, notify }) {
  const [items, setItems] = useState(portfolio);
  const [dragIndex, setDragIndex] = useState(null);
  const dirty = JSON.stringify(items) !== JSON.stringify(portfolio);

  const addItem = () => setItems((l) => [...l, { id: uid(), title: "", category: "", description: "", url: "", image: null }]);
  const updateItem = (id, patch) => setItems((l) => l.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const removeItem = (id) => setItems((l) => l.filter((i) => i.id !== id));
  const onDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    setItems((l) => {
      const copy = [...l];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(index, 0, moved);
      return copy;
    });
    setDragIndex(null);
  };

  const save = () => { onChange(items); notify("Portfolio updated"); };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6 fade-up">
        <h2 className="text-xl md:text-2xl font-semibold">Portfolio</h2>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>Show visitors a few pieces of your best work.</p>
      </div>

      {items.length === 0 ? (
        <div className="nexa-card p-10 text-center">
          <Briefcase size={22} className="mx-auto mb-3" color={COLORS.textMuted} />
          <h3 className="font-medium mb-1">Showcase your best work</h3>
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>Add projects to your digital profile and let visitors discover what you do.</p>
          <button onClick={addItem} className="nexa-btn-primary px-4 py-2 text-sm inline-flex items-center gap-1.5"><Plus size={14} /> Add Project</button>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 60}>
              <PortfolioCard
                item={item}
                onUpdate={(patch) => updateItem(item.id, patch)}
                onRemove={() => removeItem(item.id)}
                dragHandlers={{
                  draggable: true,
                  onDragStart: () => setDragIndex(index),
                  onDragOver: (e) => e.preventDefault(),
                  onDrop: () => onDrop(index),
                }}
              />
            </Reveal>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="flex items-center gap-3">
          <button onClick={addItem} className="nexa-btn-secondary px-4 py-2 text-sm inline-flex items-center gap-1.5"><Plus size={14} /> Add Project</button>
          <button onClick={save} disabled={!dirty} className="nexa-btn-primary px-5 py-2 text-sm font-medium">Save Changes</button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Analytics
   ============================================================ */

function StatCard({ label, value, icon: Icon }) {
  return (
    <TiltCard max={5}>
      <div className="nexa-card nexa-card-hover p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: COLORS.textMuted }}>{label}</span>
          <Icon size={14} color={COLORS.soft} />
        </div>
        <div className="text-xl font-semibold"><CountUp value={value} /></div>
      </div>
    </TiltCard>
  );
}

function AnalyticsPage() {
  const { totals, series, channels } = demoAnalytics;
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <Reveal>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">Analytics</h2>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>Track how visitors engage with your profile.</p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.14)", color: COLORS.soft }}>Demo data — connect analytics to see live numbers</span>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Profile views", value: totals.views, icon: Eye },
          { label: "NFC taps", value: totals.taps, icon: Sparkles },
          { label: "QR scans", value: totals.scans, icon: QrCode },
          { label: "Link clicks", value: totals.linkClicks, icon: Link2 },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 60}>
            <StatCard label={s.label} value={s.value} icon={s.icon} />
          </Reveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Reveal className="nexa-card p-5">
          <h3 className="text-sm font-semibold mb-4">Views & taps (last 7 days)</h3>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke={COLORS.textMuted} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke={COLORS.textMuted} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, fontSize: 12 }} />
                <Area type="monotone" dataKey="views" stroke={COLORS.bright} fill="url(#viewsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        <Reveal delay={80} className="nexa-card p-5">
          <h3 className="text-sm font-semibold mb-4">Clicks by channel</h3>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={channels}>
                <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.textMuted} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke={COLORS.textMuted} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="value" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "WhatsApp clicks", value: totals.whatsapp, icon: MessageCircle },
          { label: "Phone clicks", value: totals.phone, icon: Phone },
          { label: "Email clicks", value: totals.email, icon: Mail },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 60}>
            <StatCard label={s.label} value={s.value} icon={s.icon} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Settings
   ============================================================ */

function SettingsPage({ profile, onLogout, notify }) {
  const [visibility, setVisibility] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="mb-2 fade-up">
        <h2 className="text-xl md:text-2xl font-semibold">Settings</h2>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>Manage your account and profile preferences.</p>
      </div>

      <section className="nexa-card p-6">
        <h3 className="text-sm font-semibold mb-4">Account</h3>
        <Field label="Email"><TextInput icon={Mail} defaultValue={profile.email} /></Field>
        <button className="nexa-btn-secondary text-sm px-4 py-2 inline-flex items-center gap-1.5"><KeyRound size={14} /> Change password</button>
      </section>

      <section className="nexa-card p-6">
        <h3 className="text-sm font-semibold mb-4">Profile visibility</h3>
        <Toggle checked={visibility} onChange={setVisibility} label={visibility ? "Public profile is visible to visitors" : "Public profile is hidden"} />
      </section>

      <section className="nexa-card p-6">
        <h3 className="text-sm font-semibold mb-4">Notifications</h3>
        <Toggle checked={notifications} onChange={setNotifications} label="Email me when someone views my profile" />
      </section>

      <section className="nexa-card p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><ShieldCheck size={15} color={COLORS.success} /> Security</h3>
        <p className="text-sm mb-3" style={{ color: COLORS.textSecondary }}>You're signed in on this device.</p>
        <button onClick={onLogout} className="nexa-btn-secondary text-sm px-4 py-2 inline-flex items-center gap-1.5"><LogOut size={14} /> Sign out</button>
      </section>

      <section className="nexa-card p-6" style={{ borderColor: "rgba(239,68,68,0.35)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.error }}>Danger Zone</h3>
        <p className="text-sm mb-3" style={{ color: COLORS.textSecondary }}>Deleting your account permanently removes your public NFC profile.</p>
        <button onClick={() => setConfirmDelete(true)} className="text-sm px-4 py-2 rounded-lg" style={{ border: `1px solid ${COLORS.error}`, color: COLORS.error }}>
          Delete account
        </button>
      </section>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete account?"
        footer={
          <>
            <button onClick={() => setConfirmDelete(false)} className="nexa-btn-secondary px-4 py-2 text-sm">Cancel</button>
            <button
              onClick={() => { setConfirmDelete(false); notify("Account deletion is disabled in this preview", "error"); }}
              className="px-4 py-2 text-sm rounded-lg"
              style={{ background: COLORS.error, color: "#fff" }}
            >
              Delete account
            </button>
          </>
        }
      >
        This will permanently remove your NFC profile and cannot be undone.
      </Modal>
    </div>
  );
}

/* ============================================================
   Root app
   ============================================================ */

export default function NexaSmartNFCApp() {
  const [booted, setBooted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState("overview");
  const [navigating, setNavigating] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [links, setLinks] = useState(initialLinks);
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [appearance, setAppearance] = useState(initialAppearance);
  const [toast, setToast] = useState(null);
  const [publicPreviewOpen, setPublicPreviewOpen] = useState(false);
  const toastTimer = useRef(null);
  const navTimer = useRef(null);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const navigate = useCallback((key) => {
    setPage((prev) => {
      if (prev === key) return prev;
      setNavigating(true);
      clearTimeout(navTimer.current);
      navTimer.current = setTimeout(() => setNavigating(false), 40);
      return key;
    });
  }, []);

  useEffect(() => () => { clearTimeout(toastTimer.current); clearTimeout(navTimer.current); }, []);

  const pageTitle = NAV_ITEMS.find((n) => n.key === page)?.label || "Dashboard";

  if (!booted) {
    return (
      <div className="nexa-root">
        <GlobalStyles />
        <BootSplash onDone={() => setBooted(true)} />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="nexa-root">
        <GlobalStyles />
        <CursorGlow />
        <LoginPage onLogin={() => setAuthed(true)} />
      </div>
    );
  }

  return (
    <div className="nexa-root">
      <GlobalStyles />
      <CursorGlow />
      <TopProgressBar active={navigating} />
      <AuroraBackground />
      <div className="flex min-h-screen relative" style={{ zIndex: 1 }}>
        <Sidebar
          current={page}
          onNavigate={navigate}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
          onLogout={() => setAuthed(false)}
          profile={profile}
        />
        <div className="flex-1 min-w-0 nexa-scroll">
          <Topbar
            title={pageTitle}
            greeting={page === "overview" ? `Welcome back, ${profile.name.split(" ")[0]}` : null}
            onOpenMobileNav={() => setMobileNavOpen(true)}
            profile={profile}
          />

          <div key={page} className="fade-in">
            {page === "overview" && (
              <DashboardHome
                profile={profile}
                appearance={appearance}
                onNavigate={navigate}
                notify={notify}
                openPublicPreview={() => setPublicPreviewOpen(true)}
              />
            )}
            {page === "profile" && (
              <ProfileEditorPage savedProfile={profile} appearance={appearance} onSave={setProfile} notify={notify} />
            )}
            {page === "appearance" && (
              <AppearancePage appearance={appearance} onSave={setAppearance} notify={notify} profile={profile} />
            )}
            {page === "links" && <LinksPage links={links} onChange={setLinks} notify={notify} />}
            {page === "portfolio" && <PortfolioPage portfolio={portfolio} onChange={setPortfolio} notify={notify} />}
            {page === "analytics" && <AnalyticsPage />}
            {page === "settings" && <SettingsPage profile={profile} onLogout={() => setAuthed(false)} notify={notify} />}
          </div>
        </div>
      </div>

      <Modal open={publicPreviewOpen} onClose={() => setPublicPreviewOpen(false)} title="Public profile preview" width={380}>
        <ProfilePreviewCard profile={profile} appearance={appearance} compact />
      </Modal>

      <Toast toast={toast} />
    </div>
  );
}
