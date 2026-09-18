import React, { useState, useEffect, useRef } from 'react';
import './LoginPage.css'; // Ungal CSS file-ai import seyyavum

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  return (
    <div className="card">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="bot-wrap" id="botWrap" tabIndex={0} role="button">
          <div className="bot-aura" id="botAura"></div>
          <svg className="bot" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="robotGroup">
              <g className="antenna" stroke="#fff" strokeWidth="4" strokeLinecap="round">
                <path d="M96 60 C 92 50, 100 46, 96 38" fill="none"/>
                <circle cx="96" cy="34" r="4" fill="#fff" stroke="none"/>
              </g>
              <rect x="34" y="90" width="12" height="46" rx="6" fill="#fff"/>
              <rect x="154" y="90" width="12" height="46" rx="6" fill="#fff"/>
              <polygon points="80,58 120,58 148,86 148,144 120,172 80,172 52,144 52,86" fill="none" stroke="#fff" strokeWidth="6" strokeLinejoin="round"/>
              <rect x="70" y="90" width="60" height="50" rx="10" fill="#e9e9e9"/>
              <g id="eyeTrack">
                <g className="eye-x-inner" stroke="#141414" strokeWidth="7" strokeLinecap="round">
                  <line x1="80" y1="103" x2="96" y2="119"/>
                  <line x1="96" y1="103" x2="80" y2="119"/>
                </g>
              </g>
              <rect x="112" y="108" width="8" height="8" fill="#141414"/>
            </g>
          </svg>
          <div className="glow"></div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="avatar">
          <svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
        </div>

        <h1 className="title">Welcome back!</h1>
        <p className="subtitle">Enter your login details</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <input type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="••••••••" required />
              <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div className="row-between">
            <label className="remember">
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <button type="submit" className={`btn-login ${loading ? 'loading' : ''}`}>
            <span className="btn-label">Log in</span>
            <span className="spinner"></span>
          </button>
        </form>
      </div>
    </div>
  );
};
