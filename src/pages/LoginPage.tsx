import React, { useEffect, useRef, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';

export const LoginPage: React.FC = () => {
  const { login, signUp, resetPassword, session, navigate } = useCustomer();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for the animated robot mascot
  const botWrapRef = useRef<HTMLDivElement>(null);
  const robotGroupRef = useRef<SVGGElement>(null);
  const eyeTrackRef = useRef<SVGGElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  // If already authenticated, redirect
  useEffect(() => {
    if (session.isAuthenticated) {
      if (session.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [session, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setInfoMessage('');

    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }
    if (mode === 'signup' && password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);

    if (mode === 'signin') {
      const { error } = await login(email, password);
      if (error) setErrorMessage(error);
    } else {
      const { error, needsConfirmation } = await signUp(email, password, fullName.trim());
      if (error) {
        setErrorMessage(error);
      } else if (needsConfirmation) {
        setInfoMessage('Account created! Please check your email and confirm it, then log in.');
        setMode('signin');
        setPassword('');
      }
    }

    setIsSubmitting(false);
  };

  const handleForgotPassword = async () => {
    setErrorMessage('');
    setInfoMessage('');
    if (!email) {
      setErrorMessage('Enter your email above first, then tap Forgot password');
      return;
    }
    const { error } = await resetPassword(email);
    if (error) {
      setErrorMessage(error);
    } else {
      setInfoMessage('Password reset link sent. Please check your email.');
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setErrorMessage('');
    setInfoMessage('');
  };

  // Robot mascot interactive animation (mirrors the original index.html script)
  useEffect(() => {
    const botWrap = botWrapRef.current;
    const robotGroup = robotGroupRef.current;
    const eyeTrack = eyeTrackRef.current;
    const aura = auraRef.current;
    if (!botWrap || !robotGroup || !eyeTrack || !aura) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    let curRotZ = 0, tgtRotZ = 0;
    let curLeanX = 0, tgtLeanX = 0;
    let curLeanY = 0, tgtLeanY = 0;
    let curScale = 1, tgtScale = 1;
    let curEyeX = 0, tgtEyeX = 0;
    let curEyeY = 0, tgtEyeY = 0;
    let curEyeScale = 1, tgtEyeScale = 1;
    let curAura = 0, tgtAura = 0;
    let curAuraScale = 0.85, tgtAuraScale = 0.85;

    let mouseX: number | null = null;
    let mouseY: number | null = null;
    let wasVeryNear = false;

    let reacting = false;
    let reactStart = 0;
    let reactDuration = 0;
    let reactKind: 'click' | 'notice' | null = null;

    let rafId = 0;

    const MAX_DIST = 520;
    const NEAR_DIST = 150;
    const MAX_ROT = 9;
    const MAX_LEAN = 9;
    const EYE_RANGE = 4.5;

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const smoothstep = (t: number) => t * t * (3 - 2 * t);

    const triggerReaction = (kind: 'click' | 'notice') => {
      reacting = true;
      reactKind = kind;
      reactStart = performance.now();
      reactDuration = kind === 'click' ? 750 : 420;
    };

    const onClick = () => triggerReaction('click');
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerReaction('click');
      }
    };
    const onTouchStart = () => triggerReaction('click');

    botWrap.addEventListener('click', onClick);
    botWrap.addEventListener('keydown', onKeydown);
    botWrap.addEventListener('touchstart', onTouchStart, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onMouseLeave = () => {
      mouseX = null;
      mouseY = null;
    };

    if (hasFinePointer && !reduceMotion) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseleave', onMouseLeave);
    }

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      if (reduceMotion) return;

      let influence = 0;

      if (mouseX !== null && hasFinePointer) {
        const rect = botWrap.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY! - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        influence = smoothstep(clamp(1 - dist / MAX_DIST, 0, 1));

        const nx = clamp(dx / MAX_DIST, -1, 1);
        const ny = clamp(dy / MAX_DIST, -1, 1);

        tgtRotZ = nx * influence * MAX_ROT;
        tgtLeanX = nx * influence * MAX_LEAN;
        tgtLeanY = ny * influence * MAX_LEAN * 0.5;

        const ex = clamp(dx / 70, -1, 1);
        const ey = clamp(dy / 70, -1, 1);
        tgtEyeX = ex * influence * EYE_RANGE;
        tgtEyeY = ey * influence * EYE_RANGE * 0.6;

        tgtAura = influence * 0.9;
        tgtAuraScale = 0.85 + influence * 0.35;
        tgtScale = 1 + influence * 0.03;

        const isVeryNear = dist < NEAR_DIST;
        if (isVeryNear && !wasVeryNear && !reacting) {
          triggerReaction('notice');
        }
        wasVeryNear = isVeryNear;
      } else {
        tgtRotZ = 0;
        tgtLeanX = 0;
        tgtLeanY = 0;
        tgtEyeX = 0;
        tgtEyeY = 0;
        tgtAura = 0;
        tgtAuraScale = 0.85;
        tgtScale = 1;
        wasVeryNear = false;
      }

      tgtEyeScale = 1;

      if (reacting) {
        const t = clamp((now - reactStart) / reactDuration, 0, 1);
        if (t >= 1) {
          reacting = false;
        } else if (reactKind === 'click') {
          const decay = 1 - t;
          const shake = Math.sin(t * Math.PI * 7) * decay * 7;
          tgtRotZ += shake;
          tgtAura = Math.max(tgtAura, Math.sin(t * Math.PI) * 1);
          tgtAuraScale = Math.max(tgtAuraScale, 0.9 + Math.sin(t * Math.PI) * 0.5);
          tgtEyeScale = 1 + Math.sin(t * Math.PI) * 0.4;
          tgtScale = 1 + Math.sin(t * Math.PI) * 0.05;
        } else if (reactKind === 'notice') {
          tgtEyeScale = 1 + Math.sin(t * Math.PI) * 0.22;
          tgtAura = Math.max(tgtAura, Math.sin(t * Math.PI) * 0.7);
          tgtScale = Math.max(tgtScale, 1 + Math.sin(t * Math.PI) * 0.02);
        }
      }

      curRotZ = lerp(curRotZ, tgtRotZ, 0.1);
      curLeanX = lerp(curLeanX, tgtLeanX, 0.08);
      curLeanY = lerp(curLeanY, tgtLeanY, 0.08);
      curScale = lerp(curScale, tgtScale, 0.12);
      curEyeX = lerp(curEyeX, tgtEyeX, 0.16);
      curEyeY = lerp(curEyeY, tgtEyeY, 0.16);
      curEyeScale = lerp(curEyeScale, tgtEyeScale, 0.2);
      curAura = lerp(curAura, tgtAura, 0.1);
      curAuraScale = lerp(curAuraScale, tgtAuraScale, 0.12);

      robotGroup.style.transform = `translate(${curLeanX}px, ${curLeanY}px) rotate(${curRotZ}deg) scale(${curScale})`;
      eyeTrack.style.transform = `translate(${curEyeX}px, ${curEyeY}px) scale(${curEyeScale})`;
      aura.style.opacity = curAura.toFixed(3);
      aura.style.transform = `scale(${curAuraScale})`;
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      botWrap.removeEventListener('click', onClick);
      botWrap.removeEventListener('keydown', onKeydown);
      botWrap.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="login-page-root">
      <style>{`
        .login-page-root{
          --black:#7c3aed;
          --grad:linear-gradient(135deg,#7c3aed 0%,#22d3ee 100%);
          --field-bg:#f3f1fb;
          --field-border:rgba(124,58,237,0.18);
          --text-main:#1f1b2e;
          --text-muted:#6b6478;
          --radius-card:28px;
          --radius-field:14px;
          --ease: cubic-bezier(.4,0,.2,1);

          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#faf9fd;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing:antialiased;
          padding:40px 20px;
          position:relative;
          overflow:hidden;
        }

        .login-page-root::before{
          content:"";
          position:fixed;
          inset:0;
          z-index:-1;
          background:
            radial-gradient(600px 400px at 15% 20%, rgba(124,58,237,0.14), transparent 60%),
            radial-gradient(600px 400px at 85% 80%, rgba(34,211,238,0.16), transparent 60%);
          animation: bgDrift 18s ease-in-out infinite alternate;
        }

        @keyframes bgDrift{
          0%{ transform: translate3d(0,0,0); }
          100%{ transform: translate3d(0,-14px,0); }
        }

        .card{
          position:relative;
          display:flex;
          width:100%;
          max-width:960px;
          min-height:640px;
          background:#ffffff;
          border-radius:var(--radius-card);
          overflow:hidden;
          box-shadow:
            0 30px 60px -20px rgba(124,58,237,0.35),
            0 10px 25px -10px rgba(124,58,237,0.15);
          opacity:0;
          transform: translateY(24px) scale(.98);
          animation: cardEnter .8s var(--ease) forwards;
        }

        @keyframes cardEnter{ to{ opacity:1; transform:translateY(0) scale(1); } }

        .left-panel{
          flex:1 1 50%;
          position:relative;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          min-width:0;
          overflow:hidden;
          padding:36px 32px;
          background: linear-gradient(160deg,#1a1033 0%, #2a1566 50%, #3b1a8c 100%);
        }

        .lp-orb{
          position:absolute;
          border-radius:50%;
          filter:blur(70px);
          pointer-events:none;
          animation: lpDrift 16s ease-in-out infinite alternate;
        }
        .lp-orb.a{ width:300px; height:300px; left:-90px; top:-70px; background:#7c3aed; opacity:.55; }
        .lp-orb.b{ width:280px; height:280px; right:-100px; bottom:70px; background:#22d3ee; opacity:.30; animation-duration:20s; animation-delay:-6s; }
        .lp-orb.c{ width:220px; height:220px; left:18%; bottom:-80px; background:#c084fc; opacity:.35; animation-duration:24s; animation-delay:-10s; }
        @keyframes lpDrift{ to{ transform: translate(40px,30px) scale(1.15); } }

        .lp-grid{
          position:absolute;
          inset:0;
          pointer-events:none;
          background-image: radial-gradient(rgba(255,255,255,0.20) 1px, transparent 1.4px);
          background-size:22px 22px;
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 20%, transparent 75%);
          mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 20%, transparent 75%);
        }

        .lp-brand{
          position:absolute;
          top:28px;
          left:30px;
          z-index:2;
          display:flex;
          align-items:center;
          gap:10px;
          color:#fff;
        }
        .lp-mark{
          width:36px;
          height:36px;
          border-radius:11px;
          display:grid;
          place-items:center;
          font-weight:800;
          font-size:16px;
          background: linear-gradient(135deg,#7c3aed,#22d3ee);
          box-shadow:0 8px 20px -6px rgba(34,211,238,0.5);
        }
        .lp-brand b{ display:block; font-size:12px; letter-spacing:.16em; text-transform:uppercase; font-weight:700; }
        .lp-brand small{ display:block; margin-top:2px; font-size:9.5px; letter-spacing:.22em; font-weight:600; color:rgba(255,255,255,0.6); }

        .lp-stage{
          position:relative;
          z-index:1;
          width:300px;
          height:300px;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .lp-ring{
          position:absolute;
          left:50%;
          top:50%;
          width:180px;
          height:180px;
          margin:-90px 0 0 -90px;
          border-radius:50%;
          border:1.5px solid rgba(103,232,249,0.55);
          opacity:0;
          animation: lpRing 4.5s cubic-bezier(.2,.6,.3,1) infinite;
        }
        .lp-ring:nth-child(2){ animation-delay:1.5s; }
        .lp-ring:nth-child(3){ animation-delay:3s; }
        @keyframes lpRing{
          0%{ transform:scale(.55); opacity:.8; }
          100%{ transform:scale(1.7); opacity:0; }
        }

        .lp-chip{
          position:absolute;
          z-index:2;
          display:inline-flex;
          align-items:center;
          gap:7px;
          padding:7px 12px;
          border-radius:999px;
          font-size:11.5px;
          font-weight:700;
          color:#fff;
          white-space:nowrap;
          background:rgba(255,255,255,0.10);
          border:1px solid rgba(255,255,255,0.22);
          -webkit-backdrop-filter:blur(10px);
          backdrop-filter:blur(10px);
          box-shadow:0 10px 24px -10px rgba(0,0,0,0.5);
          animation: lpFloat 6s ease-in-out infinite alternate;
        }
        .lp-chip i{ width:7px; height:7px; border-radius:50%; background:#22d3ee; box-shadow:0 0 10px #22d3ee; }
        .lp-chip.c1{ left:-24px; top:34px; }
        .lp-chip.c2{ right:-34px; top:120px; animation-delay:-2s; }
        .lp-chip.c3{ left:4px; bottom:22px; animation-delay:-4s; }
        @keyframes lpFloat{ to{ transform: translateY(-10px); } }

        .lp-copy{
          position:absolute;
          left:30px;
          right:30px;
          bottom:32px;
          z-index:2;
          color:#fff;
        }
        .lp-copy h2{ margin:0; font-size:24px; line-height:1.15; font-weight:800; letter-spacing:-.02em; }
        .lp-copy h2 span{
          background:linear-gradient(90deg,#c4b5fd,#67e8f9);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
          -webkit-text-fill-color:transparent;
        }
        .lp-copy p{ margin:8px 0 0; font-size:12.5px; line-height:1.5; max-width:320px; color:rgba(255,255,255,0.68); }

        .bot-wrap{
          position:relative;
          z-index:1;
          opacity:0;
          transform: translateY(16px);
          animation: botEnter 1s var(--ease) forwards;
          animation-delay:.25s;
          cursor:pointer;
        }

        @keyframes botEnter{ to{ opacity:1; transform:translateY(0); } }

        .bot-wrap:focus-visible{
          outline:2px solid rgba(255,255,255,0.6);
          outline-offset:10px;
          border-radius:50%;
        }

        .bot{
          width:200px;
          height:auto;
          display:block;
          animation: botFloat 4.5s ease-in-out infinite;
          animation-delay: 1.2s;
        }

        @keyframes botFloat{
          0%,100%{ transform: translateY(0); }
          50%{ transform: translateY(-8px); }
        }

        .antenna{
          transform-origin: 96px 60px;
          animation: antennaWobble 3.4s ease-in-out infinite;
          animation-delay: 1.2s;
        }

        @keyframes antennaWobble{
          0%,100%{ transform: rotate(0deg); }
          50%{ transform: rotate(4deg); }
        }

        .eye-x-inner{
          animation: blink 5s ease-in-out infinite;
          transform-origin:center;
        }

        @keyframes blink{
          0%, 92%, 100%{ transform: scaleY(1); }
          95%{ transform: scaleY(0.15); }
        }

        .robot-group, .eye-track{
          transform-box: fill-box;
          transform-origin: 50% 50%;
          will-change: transform;
        }

        .bot-aura{
          position:absolute;
          top:50%;
          left:50%;
          width:210px;
          height:210px;
          margin:-105px 0 0 -105px;
          border-radius:50%;
          background: radial-gradient(circle, rgba(167,139,250,0.55) 0%, rgba(34,211,238,0.14) 45%, rgba(34,211,238,0) 72%);
          opacity:0;
          transform:scale(0.85);
          pointer-events:none;
          will-change: opacity, transform;
        }

        .right-panel{
          flex:1 1 50%;
          background:#ffffff;
          padding:56px 64px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          min-width:0;
        }

        .avatar{
          width:44px;
          height:44px;
          border-radius:50%;
          background:rgba(124,58,237,0.12);
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 18px;
          opacity:0;
          transform:translateY(-8px);
          animation: fadeDown .6s var(--ease) forwards;
          animation-delay:.35s;
        }

        .avatar svg{ width:22px; height:22px; fill:#7c3aed; }

        @keyframes fadeDown{ to{ opacity:1; transform:translateY(0); } }

        h1.title{
          margin:0;
          text-align:center;
          font-size:30px;
          font-weight:800;
          letter-spacing:-0.01em;
          color:var(--text-main);
          opacity:0;
          transform:translateY(10px);
          animation: fadeUp .6s var(--ease) forwards;
          animation-delay:.42s;
        }

        .subtitle{
          text-align:center;
          margin:6px 0 28px;
          font-size:13.5px;
          color:var(--text-muted);
          opacity:0;
          transform:translateY(10px);
          animation: fadeUp .6s var(--ease) forwards;
          animation-delay:.48s;
        }

        @keyframes fadeUp{ to{ opacity:1; transform:translateY(0); } }

        .error-banner{
          margin-bottom:16px;
          padding:10px 14px;
          border-radius:12px;
          background:#fef2f2;
          border:1px solid #fecaca;
          color:#b91c1c;
          font-size:12.5px;
          font-weight:600;
          text-align:center;
        }

        .info-banner{
          margin-bottom:16px;
          padding:10px 14px;
          border-radius:12px;
          background:#f0fdf4;
          border:1px solid #bbf7d0;
          color:#15803d;
          font-size:12.5px;
          font-weight:600;
          text-align:center;
        }

        form{ display:flex; flex-direction:column; }

        .field{
          margin-bottom:18px;
          opacity:0;
          transform:translateY(12px);
          animation: fadeUp .55s var(--ease) forwards;
        }
        .field:nth-of-type(1){ animation-delay:.55s; }
        .field:nth-of-type(2){ animation-delay:.62s; }
        .field:nth-of-type(3){ animation-delay:.66s; }

        .field label{
          display:block;
          font-size:14px;
          font-weight:600;
          color:var(--text-main);
          margin-bottom:8px;
        }

        .input-wrap{ position:relative; }

        .input-wrap input{
          width:100%;
          padding:14px 16px;
          background:var(--field-bg);
          border:1.5px solid var(--field-border);
          border-radius:var(--radius-field);
          font-size:14px;
          color:var(--text-main);
          outline:none;
          transition: border-color .25s var(--ease), background .25s var(--ease), box-shadow .25s var(--ease);
          box-sizing:border-box;
        }

        .input-wrap input::placeholder{ color:#b3b3b3; }

        .input-wrap input:focus{
          border-color: var(--black);
          background:#ffffff;
          box-shadow: 0 0 0 4px rgba(124,58,237,0.14);
        }

        .toggle-pass{
          position:absolute;
          right:10px;
          top:50%;
          transform:translateY(-50%);
          background:none;
          border:none;
          padding:6px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:var(--text-muted);
          cursor:pointer;
          border-radius:8px;
        }
        .toggle-pass:hover{ color:var(--text-main); background:#ebe7f8; }
        .toggle-pass svg{ width:18px; height:18px; }

        .row-between{
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin:-4px 0 22px;
          font-size:13px;
          opacity:0;
          transform:translateY(10px);
          animation: fadeUp .55s var(--ease) forwards;
          animation-delay:.68s;
        }

        .remember{
          display:flex;
          align-items:center;
          gap:8px;
          color:var(--text-muted);
          cursor:pointer;
          user-select:none;
        }
        .remember input{ accent-color:var(--black); width:15px; height:15px; cursor:pointer; }

        .forgot{
          color:var(--black);
          text-decoration:none;
          font-weight:600;
          background:none;
          border:none;
          cursor:pointer;
          font-size:13px;
          padding:0;
        }
        .forgot:hover{ text-decoration:underline; }

        .btn-login{
          position:relative;
          padding:15px 16px;
          background:var(--grad);
          color:#fff;
          border:none;
          border-radius:var(--radius-field);
          font-size:14.5px;
          font-weight:700;
          cursor:pointer;
          transition: transform .15s var(--ease), background .2s var(--ease), box-shadow .2s var(--ease);
          opacity:0;
          transform:translateY(10px);
          animation: fadeUp .55s var(--ease) forwards;
          animation-delay:.74s;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
        }
        .btn-login:hover{ transform:translateY(-1px); box-shadow:0 10px 24px -8px rgba(124,58,237,0.55); }
        .btn-login:active{ transform:translateY(0); }
        .btn-login:disabled{ opacity:.75; cursor:default; transform:none; }

        .spinner{
          width:16px;
          height:16px;
          border-radius:50%;
          border:2px solid rgba(255,255,255,0.35);
          border-top-color:#fff;
          animation: spin .7s linear infinite;
          display: none;
        }
        .btn-login.loading .spinner{ display:inline-block; }
        .btn-login.loading .btn-label{ opacity:.85; }

        @keyframes spin{ to{ transform: rotate(360deg); } }

        .switch-mode{
          margin:18px 0 0;
          text-align:center;
          font-size:13px;
          color:var(--text-muted);
        }
        .switch-mode button{
          background:none;
          border:none;
          padding:0;
          margin-left:6px;
          font-size:13px;
          font-weight:700;
          color:var(--black);
          cursor:pointer;
        }
        .switch-mode button:hover{ text-decoration:underline; }

        @media (max-width: 760px){
          .card{ flex-direction:column; min-height:auto; }
          .left-panel{ padding:64px 20px 28px; min-height:300px; }
          .lp-brand{ top:16px; left:18px; }
          .lp-copy{ display:none; }
          .lp-chip{ display:none; }
          .lp-stage{ width:220px; height:220px; }
          .bot{ width:150px; }
          .right-panel{ padding:36px 28px; }
        }

        :focus-visible{ outline:2px solid #7c3aed; outline-offset:2px; }
      `}</style>

      <div className="card">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <span className="lp-orb a"></span>
          <span className="lp-orb b"></span>
          <span className="lp-orb c"></span>
          <span className="lp-grid"></span>

          <div className="lp-brand">
            <span className="lp-mark">N</span>
            <div>
              <b>Nexa Creatives</b>
              <small>SMART NFC</small>
            </div>
          </div>

          <div className="lp-stage">
            <span className="lp-ring"></span>
            <span className="lp-ring"></span>
            <span className="lp-ring"></span>
            <div
            className="bot-wrap"
            ref={botWrapRef}
            tabIndex={0}
            role="button"
            aria-label="Robot assistant, press Enter to interact"
          >
            <div className="bot-aura" ref={auraRef}></div>
            <svg className="bot" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g className="robot-group" ref={robotGroupRef}>
                <g className="antenna" stroke="#fff" strokeWidth={4} strokeLinecap="round">
                  <path d="M96 60 C 92 50, 100 46, 96 38" fill="none" />
                  <circle cx="96" cy="34" r="4" fill="#fff" stroke="none" />
                </g>
                <rect x="34" y="90" width="12" height="46" rx="6" fill="#fff" />
                <rect x="154" y="90" width="12" height="46" rx="6" fill="#fff" />
                <polygon
                  points="80,58 120,58 148,86 148,144 120,172 80,172 52,144 52,86"
                  fill="none"
                  stroke="#fff"
                  strokeWidth={6}
                  strokeLinejoin="round"
                />
                <rect x="70" y="90" width="60" height="50" rx="10" fill="#ede9fe" />
                <g className="eye-track" ref={eyeTrackRef}>
                  <g className="eye-x-inner" stroke="#7c3aed" strokeWidth={7} strokeLinecap="round">
                    <line x1="80" y1="103" x2="96" y2="119" />
                    <line x1="96" y1="103" x2="80" y2="119" />
                  </g>
                </g>
                <rect x="112" y="108" width="8" height="8" fill="#7c3aed" />
              </g>
            </svg>
            </div>
            <span className="lp-chip c1"><i></i>NFC Tap</span>
            <span className="lp-chip c2"><i></i>QR Share</span>
            <span className="lp-chip c3"><i></i>Save Contact</span>
          </div>

          <div className="lp-copy">
            <h2>
              Your digital identity,
              <br />
              <span>one tap away.</span>
            </h2>
            <p>Smart NFC business cards for modern professionals. Share, connect and get remembered.</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="avatar">
            <svg viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9z" />
            </svg>
          </div>

          <h1 className="title">{mode === 'signin' ? 'Welcome back!' : 'Create your account'}</h1>
          <p className="subtitle">
            {mode === 'signin' ? 'Enter your login details' : 'Start building your digital card'}
          </p>

          {errorMessage && <div className="error-banner">{errorMessage}</div>}
          {infoMessage && <div className="info-banner">{infoMessage}</div>}

          <form onSubmit={handleLoginSubmit} noValidate>
            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="login-name-input">Full name</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    id="login-name-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="login-email-input">Email</label>
              <div className="input-wrap">
                <input
                  type="email"
                  id="login-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="login-password-input">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  className="toggle-pass"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 4.22-5.19M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.6 18.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="row-between">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              {mode === 'signin' && (
                <button type="button" className="forgot" onClick={handleForgotPassword}>
                  Forgot password?
                </button>
              )}
            </div>

            <button type="submit" className={`btn-login${isSubmitting ? ' loading' : ''}`} disabled={isSubmitting}>
              <span className="btn-label">{mode === 'signin' ? 'Log in' : 'Create account'}</span>
              <span className="spinner"></span>
            </button>
          </form>

          <p className="switch-mode">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" onClick={switchMode}>
              {mode === 'signin' ? 'Create one' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
