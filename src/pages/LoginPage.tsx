"use client";

import React, { useState, useEffect, useRef } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const botWrapRef = useRef<HTMLDivElement>(null);
  const robotGroupRef = useRef<SVGGElement>(null);
  const eyeTrackRef = useRef<SVGGElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1400);
  };

  // Robot animation & cursor tracking logic
  useEffect(() => {
    const botWrap = botWrapRef.current;
    const robotGroup = robotGroupRef.current;
    const eyeTrack = eyeTrackRef.current;
    const aura = auraRef.current;

    if (!botWrap || !robotGroup || !eyeTrack || !aura) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

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
    let reactKind: "notice" | "click" | null = null;

    const MAX_DIST = 520;
    const NEAR_DIST = 150;
    const MAX_ROT = 9;
    const MAX_LEAN = 9;
    const EYE_RANGE = 4.5;

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const smoothstep = (t: number) => t * t * (3 - 2 * t);

    const triggerReaction = (kind: "notice" | "click") => {
      reacting = true;
      reactKind = kind;
      reactStart = performance.now();
      reactDuration = kind === "click" ? 750 : 420;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = null;
      mouseY = null;
    };

    if (hasFinePointer && !reduceMotion) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
    }

    let animationFrameId: number;

    const frame = (now: number) => {
      animationFrameId = requestAnimationFrame(frame);

      if (reduceMotion) return;

      let influence = 0;

      if (mouseX !== null && hasFinePointer && botWrap) {
        const rect = botWrap.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
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
          triggerReaction("notice");
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
        } else if (reactKind === "click") {
          const decay = 1 - t;
          const shake = Math.sin(t * Math.PI * 7) * decay * 7;
          tgtRotZ += shake;
          tgtAura = Math.max(tgtAura, Math.sin(t * Math.PI) * 1);
          tgtAuraScale = Math.max(tgtAuraScale, 0.9 + Math.sin(t * Math.PI) * 0.5);
          tgtEyeScale = 1 + Math.sin(t * Math.PI) * 0.4;
          tgtScale = 1 + Math.sin(t * Math.PI) * 0.05;
        } else if (reactKind === "notice") {
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

      if (robotGroup) {
        robotGroup.style.transform = `translate(${curLeanX}px, ${curLeanY}px) rotate(${curRotZ}deg) scale(${curScale})`;
      }
      if (eyeTrack) {
        eyeTrack.style.transform = `translate(${curEyeX}px, ${curEyeY}px) scale(${curEyeScale})`;
      }
      if (aura) {
        aura.style.opacity = curAura.toFixed(3);
        aura.style.transform = `scale(${curAuraScale})`;
      }
    };

    animationFrameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="login-wrapper">
      <style jsx global>{`
        :root {
          --black: #141414;
          --panel-black: #161616;
          --field-bg: #f2f2f2;
          --field-border: #e2e2e2;
          --text-main: #111111;
          --text-muted: #6b6b6b;
          --radius-card: 28px;
          --radius-field: 14px;
          --ease: cubic-bezier(0.4, 0, 0.2, 1);
        }

        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          padding: 40px 20px;
          position: relative;
        }

        .login-wrapper::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 0;
          background: radial-gradient(600px 400px at 15% 20%, rgba(0, 0, 0, 0.02), transparent 60%),
            radial-gradient(600px 400px at 85% 80%, rgba(0, 0, 0, 0.03), transparent 60%);
          animation: bgDrift 18s ease-in-out infinite alternate;
        }

        @keyframes bgDrift {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, -14px, 0); }
        }

        .card {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          max-width: 960px;
          min-height: 640px;
          background: #ffffff;
          border-radius: var(--radius-card);
          overflow: hidden;
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.35), 0 10px 25px -10px rgba(0, 0, 0, 0.15);
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          animation: cardEnter 0.8s var(--ease) forwards;
        }

        @keyframes cardEnter {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .left-panel {
          flex: 1 1 50%;
          background: linear-gradient(160deg, #181818 0%, #0f0f0f 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          overflow: hidden;
        }

        .left-panel .glow {
          position: absolute;
          bottom: 6%;
          left: 50%;
          transform: translateX(-50%);
          width: 220px;
          height: 60px;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 70%);
          filter: blur(4px);
          opacity: 0;
          animation: glowFade 1.4s var(--ease) forwards;
          animation-delay: 0.9s;
        }

        @keyframes glowFade { to { opacity: 1; } }

        .bot-wrap {
          position: relative;
          opacity: 0;
          transform: translateY(16px);
          animation: botEnter 1s var(--ease) forwards;
          animation-delay: 0.25s;
          cursor: pointer;
        }

        @keyframes botEnter { to { opacity: 1; transform: translateY(0); } }

        .bot {
          width: 190px;
          height: auto;
          display: block;
          animation: botFloat 4.5s ease-in-out infinite;
          animation-delay: 1.2s;
        }

        @keyframes botFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .antenna {
          transform-origin: 96px 60px;
          animation: antennaWobble 3.4s ease-in-out infinite;
          animation-delay: 1.2s;
        }

        @keyframes antennaWobble {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(4deg); }
        }

        .eye-x-inner {
          animation: blink 5s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.15); }
        }

        #robotGroup, #eyeTrack {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          will-change: transform;
        }

        .bot-aura {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 210px;
          height: 210px;
          margin: -105px 0 0 -105px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0) 72%);
          opacity: 0;
          transform: scale(0.85);
          pointer-events: none;
          will-change: opacity, transform;
        }

        .right-panel {
          flex: 1 1 50%;
          background: #ffffff;
          padding: 56px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ececec;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          opacity: 0;
          transform: translateY(-8px);
          animation: fadeDown 0.6s var(--ease) forwards;
          animation-delay: 0.35s;
        }

        .avatar svg { width: 22px; height: 22px; fill: #9a9a9a; }

        @keyframes fadeDown { to { opacity: 1; transform: translateY(0); } }

        h1.title {
          margin: 0;
          text-align: center;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--text-main);
          opacity: 0;
          transform: translateY(10px);
          animation: fadeUp 0.6s var(--ease) forwards;
          animation-delay: 0.42s;
        }

        .subtitle {
          text-align: center;
          margin: 6px 0 28px;
          font-size: 13.5px;
          color: var(--text-muted);
          opacity: 0;
          transform: translateY(10px);
          animation: fadeUp 0.6s var(--ease) forwards;
          animation-delay: 0.48s;
        }

        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

        form { display: flex; flex-direction: column; }

        .field {
          margin-bottom: 18px;
          opacity: 0;
          transform: translateY(12px);
          animation: fadeUp 0.55s var(--ease) forwards;
        }
        .field:nth-of-type(1) { animation-delay: 0.55s; }
        .field:nth-of-type(2) { animation-delay: 0.62s; }

        .field label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .input-wrap { position: relative; }

        .input-wrap input {
          width: 100%;
          padding: 14px 16px;
          background: var(--field-bg);
          border: 1.5px solid var(--field-border);
          border-radius: var(--radius-field);
          font-size: 14px;
          color: var(--text-main);
          outline: none;
          transition: border-color 0.25s var(--ease), background 0.25s var(--ease), box-shadow 0.25s var(--ease);
        }

        .input-wrap input::placeholder { color: #b3b3b3; }

        .input-wrap input:focus {
          background: #ffffff;
          border-color: #141414;
          box-shadow: 0 0 0 4px rgba(20, 20, 20, 0.06);
        }

        .toggle-pass {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #a9a9a9;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s var(--ease), transform 0.2s var(--ease);
        }

        .toggle-pass:hover { color: #555; }
        .toggle-pass svg { width: 18px; height: 18px; }

        .row-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
          opacity: 0;
          transform: translateY(10px);
          animation: fadeUp 0.55s var(--ease) forwards;
          animation-delay: 0.68s;
        }

        .remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: var(--text-main);
          cursor: pointer;
          user-select: none;
        }

        .remember input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: 17px;
          height: 17px;
          border-radius: 4px;
          background: var(--black);
          border: 1.5px solid var(--black);
          position: relative;
          cursor: pointer;
          transition: transform 0.15s var(--ease);
          flex-shrink: 0;
        }

        .remember input[type="checkbox"]:checked::after {
          content: "";
          position: absolute;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .remember input[type="checkbox"]:active { transform: scale(0.9); }

        .forgot {
          font-size: 13.5px;
          color: var(--text-main);
          text-decoration: none;
          position: relative;
        }

        .forgot::after {
          content: "";
          position: absolute;
          left: 0; bottom: -2px;
          width: 0%;
          height: 1px;
          background: var(--text-main);
          transition: width 0.25s var(--ease);
        }

        .forgot:hover::after { width: 100%; }

        .btn-login {
          width: 100%;
          padding: 15px;
          background: var(--black);
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.18s var(--ease), box-shadow 0.25s var(--ease), background 0.25s var(--ease);
          opacity: 0;
          transform: translateY(10px);
          animation: fadeUp 0.55s var(--ease) forwards;
          animation-delay: 0.74s;
        }

        .btn-login::before {
          content: "";
          position: absolute;
          top: 0; left: -60%;
          width: 40%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.18), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }

        .btn-login:hover {
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.45);
          transform: translateY(-2px);
        }

        .btn-login:hover::before { left: 130%; }

        .btn-login:active { transform: translateY(0) scale(0.98); }

        .btn-login.loading .btn-label { opacity: 0; }

        .spinner {
          position: absolute;
          top: 50%; left: 50%;
          width: 18px; height: 18px;
          margin: -9px 0 0 -9px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          opacity: 0;
          animation: spin 0.7s linear infinite;
        }

        .btn-login.loading .spinner { opacity: 1; }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 860px) {
          .card { max-width: 520px; min-height: auto; }
          .left-panel { display: none; }
          .right-panel { padding: 44px 32px; }
        }

        @media (max-width: 420px) {
          .right-panel { padding: 34px 22px; }
          h1.title { font-size: 26px; }
        }
      `}</style>

      <div className="card">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div
            className="bot-wrap"
            id="botWrap"
            ref={botWrapRef}
            tabIndex={0}
            role="button"
            aria-label="Robot assistant, press Enter to interact"
          >
            <div className="bot-aura" id="botAura" ref={auraRef}></div>
            <svg className="bot" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="robotGroup" ref={robotGroupRef}>
                <g className="antenna" stroke="#fff" strokeWidth="4" strokeLinecap="round">
                  <path d="M96 60 C 92 50, 100 46, 96 38" fill="none" />
                  <circle cx="96" cy="34" r="4" fill="#fff" stroke="none" />
                </g>
                <rect x="34" y="90" width="12" height="46" rx="6" fill="#fff" />
                <rect x="154" y="90" width="12" height="46" rx="6" fill="#fff" />
                <polygon
                  points="80,58 120,58 148,86 148,144 120,172 80,172 52,144 52,86"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                <rect x="70" y="90" width="60" height="50" rx="10" fill="#e9e9e9" />
                <g id="eyeTrack" ref={eyeTrackRef}>
                  <g className="eye-x-inner" stroke="#141414" strokeWidth="7" strokeLinecap="round">
                    <line x1="80" y1="103" x2="96" y2="119" />
                    <line x1="96" y1="103" x2="80" y2="119" />
                  </g>
                </g>
                <rect x="112" y="108" width="8" height="8" fill="#141414" />
              </g>
            </svg>
            <div className="glow"></div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="avatar">
            <svg viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9z" />
            </svg>
          </div>

          <h1 className="title">Welcome back!</h1>
          <p className="subtitle">Enter your login details</p>

          <form id="loginForm" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 4.22-5.19M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.6 18.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="row-between">
              <label className="remember">
                <input type="checkbox" defaultChecked />
                Remember me
              </label>
              <a href="#" className="forgot">
                Forgot password?
              </a>
            </div>

            <button type="submit" className={`btn-login ${isLoading ? "loading" : ""}`}>
              <span className="btn-label">Log in</span>
              <span className="spinner"></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
