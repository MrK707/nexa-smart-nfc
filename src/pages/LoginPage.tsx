import React, { useEffect, useRef, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';

const CSS = `.cn-root{--purple:#8b35ff;--cyan:#36d8ff;--text:#f8f7ff;--muted:#aaa5c9;--logo:url(/images/logo-cinematic.png)}
:where(.cn-root) *,:where(.cn-root) *:before,:where(.cn-root) *:after{box-sizing:border-box}
.cn-root{margin:0;min-height:100vh;color:var(--text);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;background:radial-gradient(ellipse at 22% 30%,#3b0f7a66,transparent 45%),radial-gradient(ellipse at 92% 88%,#00559933,transparent 40%),#05030f;overflow-x:hidden}
.cn-root:before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 40% 45%,transparent 38%,#000000b3)}
.cn-fx{position:fixed;inset:0;z-index:0;pointer-events:none}
.cn-bar{position:fixed;left:0;right:0;height:11vh;background:#000;z-index:60;pointer-events:none}
.cn-bar.cn-top{top:0;animation:cn-barT 1.1s 2.15s cubic-bezier(.7,0,.2,1) forwards}
.cn-bar.cn-bottom{bottom:0;animation:cn-barB 1.1s 2.15s cubic-bezier(.7,0,.2,1) forwards}
.cn-intro{position:fixed;inset:0;z-index:50;background:#030212;display:grid;place-items:center;pointer-events:none;animation:cn-introOut .9s 2.2s ease forwards}
.cn-intro-stack{position:relative;display:grid;place-items:center}
.cn-intro-logo{position:relative;width:min(72vw,480px);aspect-ratio:700/211;animation:cn-introLogo 2.3s cubic-bezier(.2,.7,.2,1) both}
.cn-intro-logo-img{position:absolute;inset:0;background:var(--logo) center/contain no-repeat}
.cn-intro-sweep{position:absolute;inset:0;-webkit-mask:var(--logo) center/contain no-repeat;mask:var(--logo) center/contain no-repeat;background-image:linear-gradient(100deg,transparent 40%,#a66bff 50%,transparent 60%);background-size:250% 100%;background-repeat:no-repeat;background-position:100% 0;animation:cn-sweep 1.4s .7s ease-in-out both}
.cn-flare{position:absolute;left:50%;top:50%;height:2px;width:0;transform:translate(-50%,-50%);background:linear-gradient(90deg,transparent,#8b35ff 25%,#fff 50%,#36d8ff 75%,transparent);box-shadow:0 0 24px 4px #8b35ff88;animation:cn-flare 1.7s .6s ease-out both}
@keyframes cn-introOut{to{opacity:0;visibility:hidden}}
@keyframes cn-introLogo{0%{opacity:0;transform:scale(.9);filter:blur(14px)}35%{opacity:1;transform:scale(1);filter:blur(0)}100%{opacity:1;transform:scale(1.06)}}
@keyframes cn-sweep{from{background-position:100% 0}to{background-position:0 0}}
@keyframes cn-flare{0%{width:0;opacity:0}30%{opacity:1}100%{width:92vw;opacity:0}}
@keyframes cn-barT{to{transform:translateY(-100%)}}
@keyframes cn-barB{to{transform:translateY(100%)}}
@keyframes cn-fade{from{opacity:0}to{opacity:1}}
.cn-layout{position:relative;z-index:1;min-height:100vh;display:grid;grid-template-columns:1.2fr .8fr}
.cn-showcase{position:relative;min-height:100vh;padding:clamp(24px,3.5vw,52px) clamp(24px,4vw,64px);display:flex;flex-direction:column;overflow:hidden}
.cn-brand{display:flex;align-items:center;gap:14px;position:relative;z-index:3;animation:cn-fade 1s 2.6s backwards}
.cn-brand-logo{width:180px;height:54px;background:var(--logo) left center/contain no-repeat}
.cn-brand-sub{padding-left:14px;border-left:1px solid #a784ff55;color:#a99bd9;font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;line-height:1.2}
.cn-stage{--cw:clamp(250px,29vw,420px);--u:calc(var(--cw) / 100);position:relative;flex:1;min-height:calc(var(--cw) * 1.3);perspective:1200px;perspective-origin:50% 40%;margin:10px 0}
.cn-beam{position:absolute;left:50%;top:-8%;width:calc(var(--cw) * 1.5);height:115%;transform:translateX(-50%);background:linear-gradient(to bottom,#9a55ff66,#6a2dff14 55%,transparent);clip-path:polygon(38% 0,62% 0,100% 100%,0 100%);filter:blur(22px);opacity:.7;animation:cn-beam 7s ease-in-out infinite alternate}
.cn-floor{position:absolute;left:50%;bottom:4%;width:calc(var(--cw) * 1.4);height:calc(var(--cw) * .28);transform:translateX(-50%);background:radial-gradient(ellipse,#8b35ffaa,#4b2aff22 50%,transparent 70%);filter:blur(14px);animation:cn-floorp 6s ease-in-out infinite}
.cn-dolly,.cn-float,.cn-rig{transform-style:preserve-3d}
.cn-dolly{position:absolute;inset:0;animation:cn-dolly 2.8s 2s cubic-bezier(.16,.84,.3,1) backwards}
.cn-float{position:absolute;inset:0;animation:cn-floatY 7s ease-in-out infinite}
.cn-rig{position:absolute;left:50%;top:50%;width:0;height:0}
@keyframes cn-dolly{from{transform:translate3d(0,calc(var(--u) * -40),-900px) rotateY(75deg) rotateX(25deg)}to{transform:none}}
@keyframes cn-floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(calc(var(--u) * -2.5))}}
@keyframes cn-beam{from{opacity:.45}to{opacity:.85}}
@keyframes cn-floorp{0%,100%{opacity:.6;transform:translateX(-50%) scale(.94)}50%{opacity:1;transform:translateX(-50%) scale(1.04)}}
.cn-orbits{position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d}
.cn-ring-tilt{position:absolute;left:0;top:0;width:0;height:0;transform-style:preserve-3d}
.cn-ring-tilt.cn-r1{transform:rotateX(74deg) rotateY(-12deg)}
.cn-ring-tilt.cn-r2{transform:rotateX(66deg) rotateY(18deg)}
.cn-ring{position:absolute;border-radius:50%;animation:cn-spin 26s linear infinite}
.cn-r1 .cn-ring{width:calc(var(--cw) * 1.35);height:calc(var(--cw) * 1.35);left:calc(var(--cw) * -.675);top:calc(var(--cw) * -.675);border:1px solid #9a5bff88;box-shadow:0 0 24px #7a30ff33}
.cn-r2 .cn-ring{width:calc(var(--cw) * 1.75);height:calc(var(--cw) * 1.75);left:calc(var(--cw) * -.875);top:calc(var(--cw) * -.875);border:1px dashed #36d8ff55;animation-duration:38s;animation-direction:reverse}
.cn-sat{position:absolute;left:50%;top:-5px;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:#fff;box-shadow:0 0 14px 4px #8b35ff,0 0 30px 8px #36d8ff66}
.cn-r2 .cn-sat{background:#bff4ff;box-shadow:0 0 14px 4px #36d8ff}
@keyframes cn-spin{to{transform:rotate(360deg)}}
.cn-card{position:absolute;width:var(--cw);height:calc(var(--cw) * .63);left:calc(var(--cw) * -.5);top:calc(var(--cw) * -.315);transform-style:preserve-3d;border-radius:calc(var(--u) * 5)}
.cn-edge{position:absolute;inset:0;border-radius:inherit;background:linear-gradient(145deg,#5b2bd6,#2a1180)}
.cn-e1{transform:translateZ(calc(var(--u) * -.5))}
.cn-e2{transform:translateZ(calc(var(--u) * -1))}
.cn-e3{transform:translateZ(calc(var(--u) * -1.5))}
.cn-e4{transform:translateZ(calc(var(--u) * -2))}
.cn-face{position:absolute;inset:0;border-radius:inherit;overflow:hidden;border:1px solid #d3bcffcc;background:linear-gradient(145deg,#2b1a68,#0b0c2c 58%,#06061a);box-shadow:0 0 50px #8b35ff66,inset 0 0 40px #6030d033}
.cn-face:before{content:"";position:absolute;inset:0;background-image:linear-gradient(#ffffff0c 1px,transparent 1px),linear-gradient(90deg,#ffffff0c 1px,transparent 1px);background-size:calc(var(--u) * 6) calc(var(--u) * 6);-webkit-mask-image:linear-gradient(120deg,#000,transparent 70%);mask-image:linear-gradient(120deg,#000,transparent 70%)}
.cn-face:after{content:"";position:absolute;inset:0;mix-blend-mode:screen;background:radial-gradient(circle at var(--mx,50%) var(--my,30%),#ffffff33,transparent 38%),linear-gradient(115deg,transparent calc(var(--mx,50%) - 18%),#b58cff2e var(--mx,50%),transparent calc(var(--mx,50%) + 18%))}
.cn-card-logo{position:absolute;left:calc(var(--u) * 8);top:50%;width:calc(var(--u) * 54);height:calc(var(--u) * 16.3);transform:translateY(-50%) translateZ(calc(var(--u) * 4));background:var(--logo) left center/contain no-repeat;filter:drop-shadow(0 0 calc(var(--u) * 2) #8b35ffaa)}
.cn-card-tag,.cn-card-foot{position:absolute;left:calc(var(--u) * 8);font-size:max(6.5px,calc(var(--u) * 2.1));letter-spacing:.14em;color:#c4b9ed;transform:translateZ(calc(var(--u) * 2));white-space:nowrap}
.cn-card-tag{top:calc(var(--u) * 7)}
.cn-card-foot{bottom:calc(var(--u) * 6.5)}
.cn-nfc-ico{position:absolute;left:calc(var(--u) * 74);top:calc(var(--u) * 21);width:calc(var(--u) * 16);height:calc(var(--u) * 21);color:#55dfff;transform:translateZ(calc(var(--u) * 6));filter:drop-shadow(0 0 8px #279cff)}
.cn-nfc-ico svg{width:100%;height:100%;display:block}
.cn-chip-ico{position:absolute;left:calc(var(--u) * 80);top:calc(var(--u) * 7);width:calc(var(--u) * 12);height:calc(var(--u) * 9);border-radius:calc(var(--u) * 1.6);background:linear-gradient(135deg,#d9c8ff,#8a6aff);box-shadow:0 0 18px #935cff55;transform:translateZ(calc(var(--u) * 3))}
.cn-chip-ico:before{content:"";position:absolute;inset:calc(var(--u) * 1.6) calc(var(--u) * 3.6);border:1px solid #38186eaa;border-radius:3px}
.cn-ripple{position:absolute;left:calc(var(--u) * 22);top:calc(var(--u) * -10);width:calc(var(--u) * 20);height:calc(var(--u) * 20);border-radius:50%;border:1.5px solid #5be4ff;box-shadow:0 0 16px #36d8ff88;opacity:0;transform:translateZ(calc(var(--u) * 1)) scale(.15);animation:cn-ripple 10s linear infinite}
.cn-rp2{animation-delay:.35s}
.cn-rp3{animation-delay:.7s}
@keyframes cn-ripple{0%,34.9%{opacity:0;transform:translateZ(calc(var(--u) * 1)) scale(.15)}35%{opacity:.95;transform:translateZ(calc(var(--u) * 1)) scale(.15)}52%{opacity:0;transform:translateZ(calc(var(--u) * 1)) scale(3.2)}100%{opacity:0}}
.cn-chip3d{position:absolute;left:calc(var(--u) * -5.5);top:calc(var(--u) * -5.5);width:calc(var(--u) * 11);height:calc(var(--u) * 11);display:grid;place-items:center;border-radius:calc(var(--u) * 3);background:linear-gradient(145deg,#6a43c8aa,#0a1233d9);border:1px solid #b894ffa0;box-shadow:0 0 22px #8b35ff66;opacity:0;animation:cn-chipFly 10s ease-in-out infinite}
.cn-chip3d svg{width:52%;height:52%;stroke:#efe9ff;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.cn-c1{--tx:calc(var(--u) * -30);--ty:calc(var(--u) * -46);--tz:calc(var(--u) * 70)}
.cn-c2{--tx:calc(var(--u) * 10);--ty:calc(var(--u) * -52);--tz:calc(var(--u) * 95);animation-delay:.12s}
.cn-c3{--tx:calc(var(--u) * 48);--ty:calc(var(--u) * -40);--tz:calc(var(--u) * 60);animation-delay:.24s}
@keyframes cn-chipFly{0%,36%{opacity:0;transform:translate3d(calc(var(--u) * 32),0,0) scale(0)}42%{opacity:1}48%,64%{opacity:1;transform:translate3d(var(--tx),var(--ty),var(--tz)) scale(1)}76%{opacity:0;transform:translate3d(calc(var(--u) * 32),calc(var(--u) * 22),calc(var(--u) * 40)) scale(.3)}100%{opacity:0}}
.cn-phone{position:absolute;width:calc(var(--u) * 26);height:calc(var(--u) * 52);left:calc(var(--u) * -13);top:calc(var(--u) * -26);border-radius:calc(var(--u) * 5);background:linear-gradient(160deg,#1a1a33,#07071a);border:1.5px solid #cdbaffaa;box-shadow:0 20px 50px #000a,0 0 30px #8b35ff55;opacity:0;animation:cn-phone 10s cubic-bezier(.4,0,.2,1) infinite}
.cn-phone-screen{position:absolute;inset:3.5%;border-radius:calc(var(--u) * 3.6);background:linear-gradient(160deg,#1c1250,#090a22);overflow:hidden;display:flex;flex-direction:column;align-items:center;padding-top:calc(var(--u) * 8)}
.cn-p-avatar{width:calc(var(--u) * 8);height:calc(var(--u) * 8);border-radius:50%;background:linear-gradient(135deg,#a33dff,#36d8ff)}
.cn-p-line{height:calc(var(--u) * 1.4);border-radius:9px;background:#ffffff26;margin-top:calc(var(--u) * 2.2);width:60%}
.cn-p-line.cn-s{width:42%;opacity:.7}
.cn-p-saved{margin-top:calc(var(--u) * 5);padding:calc(var(--u) * 1.2) calc(var(--u) * 3);border-radius:99px;background:#35e0a122;border:1px solid #35e0a177;color:#7bf3c8;font-size:max(6px,calc(var(--u) * 2.2));font-weight:700;opacity:0;animation:cn-saved 10s ease-out infinite}
@keyframes cn-phone{
0%,10%{opacity:0;transform:translate3d(calc(var(--u) * 85),calc(var(--u) * 75),calc(var(--u) * 110)) rotateX(40deg) rotateY(-30deg) rotateZ(22deg)}
14%{opacity:1}
32%,38%,70%{opacity:1;transform:translate3d(calc(var(--u) * 32),calc(var(--u) * 24),calc(var(--u) * 34)) rotateX(14deg) rotateY(-10deg) rotateZ(9deg)}
35%{opacity:1;transform:translate3d(calc(var(--u) * 32),calc(var(--u) * 24),calc(var(--u) * 27)) rotateX(14deg) rotateY(-10deg) rotateZ(9deg)}
84%,100%{opacity:0;transform:translate3d(calc(var(--u) * 85),calc(var(--u) * 75),calc(var(--u) * 110)) rotateX(40deg) rotateY(-30deg) rotateZ(22deg)}}
@keyframes cn-saved{0%,36%{opacity:0;transform:scale(.6)}42%{opacity:1;transform:scale(1.1)}46%,70%{opacity:1;transform:scale(1)}78%,100%{opacity:0}}
.cn-pitch{position:relative;z-index:3;max-width:600px;animation:cn-fade 1s 2.9s backwards}
.cn-pitch h1{margin:0 0 12px;font-size:clamp(30px,3.2vw,46px);line-height:1.02;letter-spacing:-.045em;font-weight:800}
.cn-pitch h1 span{background:linear-gradient(90deg,#bd83ff,#8e59ff 55%,#43d9ff);color:transparent;-webkit-background-clip:text;background-clip:text}
.cn-pitch p{max-width:440px;color:#b8b2d2;line-height:1.7;font-size:14px;margin:0}
.cn-benefits{display:flex;flex-wrap:wrap;gap:9px;margin-top:20px}
.cn-benefit{padding:8px 12px;border:1px solid #a784ff33;background:#2819555c;border-radius:999px;color:#ddd5ff;font-size:11px}
.cn-benefit b{color:#58ddff;margin-right:5px}
@property --ang{syntax:'<angle>';inherits:false;initial-value:0deg}
.cn-auth-side{position:relative;z-index:2;display:grid;place-items:center;padding:clamp(24px,4vw,60px)}
.cn-auth-card{width:min(100%,440px);position:relative;padding:clamp(25px,3vw,42px);border-radius:26px;background:linear-gradient(145deg,#130f30d9,#09091de6);box-shadow:0 24px 80px #000a,0 0 60px #6926ff22,inset 0 1px #ffffff0d;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);animation:cn-cardIn 1.1s 2.7s cubic-bezier(.2,.8,.2,1) backwards}
.cn-auth-card:before{content:"";position:absolute;inset:0;border-radius:26px;padding:1px;pointer-events:none;background:conic-gradient(from var(--ang),#a384ff33 0 60%,#8b35ff 78%,#36d8ff 88%,#a384ff33);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:cn-spinb 7s linear infinite}
@keyframes cn-spinb{to{--ang:360deg}}
@keyframes cn-cardIn{from{opacity:0;transform:translateY(36px) rotateX(12deg) scale(.97)}to{opacity:1;transform:none}}
.cn-user-icon{margin:0 auto 20px;width:56px;height:56px;display:grid;place-items:center;border-radius:19px;background:linear-gradient(135deg,#7f38ff,#2a9dff);box-shadow:0 0 35px #7337ff66}
.cn-user-icon svg{width:26px;height:26px;stroke:#fff;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.cn-auth-card h2{margin:0;text-align:center;font-size:30px;letter-spacing:-.04em}
.cn-subhead{margin:9px 0 32px;text-align:center;color:#a8a1c5;font-size:13px}
:where(.cn-root) label{display:block;margin:0 0 9px;font-size:12px;font-weight:700;color:#e9e4ff}
.cn-field{position:relative;margin-bottom:22px}
:where(.cn-root) input[type=email],:where(.cn-root) input[type=password],:where(.cn-root) input[type=text]{width:100%;padding:16px;border:1px solid #9c85e855;border-radius:13px;color:#fff;background:#070719c7;outline:none;font:inherit;font-size:13px;transition:.2s}
:where(.cn-root) input::placeholder{color:#716a91}
:where(.cn-root) input:focus{border-color:#a16aff;box-shadow:0 0 0 4px #8429ff22;background:#0a081ffb}
.cn-password-wrap{position:relative}
.cn-password-wrap input{padding-right:50px}
.cn-toggle{position:absolute;top:50%;right:12px;transform:translateY(-50%);border:0;background:transparent;color:#b8a6f4;cursor:pointer;font-size:17px;padding:4px}
.cn-options{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:-2px 0 25px;color:#a8a1c5;font-size:12px}
.cn-remember{display:flex;align-items:center;gap:8px;cursor:pointer;margin:0;font-weight:400;color:#a8a1c5}
.cn-remember input{accent-color:#923dff}
:where(.cn-root) a{color:#b78bff;text-decoration:none}
:where(.cn-root) a:hover{color:#58ddff}
:where(.cn-root) a:focus-visible,:where(.cn-root) button:focus-visible{outline:2px solid #58ddff;outline-offset:3px;border-radius:6px}
.cn-submit{width:100%;padding:16px;border:0;border-radius:13px;color:#fff;font-weight:800;font-size:14px;cursor:pointer;background:linear-gradient(100deg,#7827ff,#4b67ff 60%,#29c8f4);box-shadow:0 10px 26px #5a2df03b;transition:transform .2s,box-shadow .2s}
.cn-submit:hover{transform:translateY(-2px);box-shadow:0 15px 32px #5a2df059}
.cn-message{display:none;margin-top:14px;padding:11px 12px;border-radius:10px;background:#27c6ff17;border:1px solid #27c6ff40;color:#9cecff;font-size:12px;line-height:1.5}
.cn-signup{margin:23px 0 0;text-align:center;color:#9b95b7;font-size:12px}
.cn-signup a{font-weight:800;margin-left:5px}
.cn-secure{margin-top:26px;text-align:center;color:#686184;font-size:10px;letter-spacing:.07em}
.cn-secure span{color:#56dcbf;margin-right:5px}
@media(max-width:950px){.cn-layout{grid-template-columns:1fr}.cn-showcase{min-height:0;padding:22px 22px 8px}.cn-stage{--cw:min(74vw,330px);min-height:calc(var(--cw) * 1.35)}.cn-auth-side{padding:18px 16px 44px}}
@media(max-width:480px){.cn-brand-logo{width:150px;height:45px}.cn-brand-sub{font-size:10px}}
@media(prefers-reduced-motion:reduce){.cn-intro,.cn-bar{display:none}:where(.cn-root) *,:where(.cn-root) *:before,:where(.cn-root) *:after{animation-delay:0s!important;animation-duration:.01ms!important;animation-iteration-count:1!important}.cn-phone,.cn-chip3d,.cn-ripple,.cn-ring,.cn-float,.cn-beam,.cn-floor,.cn-auth-card:before{animation:none!important}}
.cn-root{position:relative}
.cn-message.show{display:block}
.cn-message.err{background:#ff4d6d17;border-color:#ff4d6d55;color:#ffb3c1}
.cn-message.ok{background:#35e0a117;border-color:#35e0a155;color:#9ff3d6}
.cn-submit:disabled{opacity:.75;cursor:default;transform:none}
.cn-link{background:none;border:0;padding:0;font:inherit;color:#b78bff;cursor:pointer}
.cn-link:hover{color:#58ddff}
.cn-signup .cn-link{font-weight:800;margin-left:5px}
.cn-fast .cn-intro,.cn-fast .cn-bar{display:none}
.cn-fast .cn-brand,.cn-fast .cn-pitch,.cn-fast .cn-auth-card,.cn-fast .cn-dolly{animation-delay:0s}
`;

const INTRO_KEY = 'nexa_intro_seen';

export const LoginPage: React.FC = () => {
  const { login, signUp, resetPassword, session, navigate } = useCustomer();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [note, setNote] = useState<{ type: 'err' | 'ok'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The film intro plays once per visit; later visits skip straight to the scene
  const [fast] = useState(() => {
    try {
      return sessionStorage.getItem(INTRO_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [introDone, setIntroDone] = useState(fast);

  const rigRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    if (fast) return;
    const t = setTimeout(() => {
      setIntroDone(true);
      try {
        sessionStorage.setItem(INTRO_KEY, '1');
      } catch {
        /* ignore */
      }
    }, 3600);
    return () => clearTimeout(t);
  }, [fast]);

  // ---------- real sign in / sign up ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setNote(null);

    if (!email) {
      setNote({ type: 'err', text: 'Please enter your email address' });
      return;
    }
    if (!password) {
      setNote({ type: 'err', text: 'Please enter your password' });
      return;
    }
    if (mode === 'signup' && password.length < 8) {
      setNote({ type: 'err', text: 'Password must be at least 8 characters' });
      return;
    }

    setIsSubmitting(true);
    if (mode === 'signin') {
      const { error } = await login(email, password);
      if (error) setNote({ type: 'err', text: error });
    } else {
      const { error, needsConfirmation } = await signUp(email, password, fullName.trim());
      if (error) {
        setNote({ type: 'err', text: error });
      } else if (needsConfirmation) {
        setNote({ type: 'ok', text: 'Account created! Please check your email and confirm it, then sign in.' });
        setMode('signin');
        setPassword('');
      }
    }
    setIsSubmitting(false);
  };

  const handleForgot = async () => {
    setNote(null);
    if (!email) {
      setNote({ type: 'err', text: 'Enter your email above first, then tap Forgot password' });
      return;
    }
    const { error } = await resetPassword(email);
    setNote(error ? { type: 'err', text: error } : { type: 'ok', text: 'Password reset link sent. Please check your email.' });
  };

  const switchMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setNote(null);
  };

  // ---------- cinematic scene: floating particles + mouse / tilt parallax ----------
  useEffect(() => {
    const rig = rigRef.current;
    const stage = stageRef.current;
    const cv = canvasRef.current;
    if (!rig || !stage || !cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, DPR = 1;
    let P: { x: number; y: number; z: number; s: number; c: string }[] = [];
    let tx = 0, ty = 0, cx = 0, cy = 0, last = -9999;
    let raf = 0;
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.width = Math.round(window.innerWidth * DPR);
      H = cv.height = Math.round(window.innerHeight * DPR);
      cv.style.width = window.innerWidth + 'px';
      cv.style.height = window.innerHeight + 'px';
      const n = Math.min(Math.round((window.innerWidth * window.innerHeight) / 9000), 200);
      P = Array.from({ length: n }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 0.9 + 0.1,
        s: Math.random() * 0.00005 + 0.00002,
        c: Math.random() < 0.3 ? '54,216,255' : '167,110,255',
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of P) {
        if (!RM) {
          p.y -= p.s * p.z * 16;
          if (p.y < -0.02) {
            p.y = 1.02;
            p.x = Math.random();
          }
        }
        const px = (p.x * window.innerWidth + cx * p.z * 40) * DPR;
        const py = (p.y * window.innerHeight + cy * p.z * 24) * DPR;
        const r = (p.z * 1.6 + 0.3) * DPR;
        ctx.fillStyle = 'rgba(' + p.c + ',' + 0.12 * p.z + ')';
        ctx.beginPath();
        ctx.arc(px, py, r * 4, 0, 6.283);
        ctx.fill();
        ctx.fillStyle = 'rgba(' + p.c + ',' + (0.35 + 0.5 * p.z) + ')';
        ctx.beginPath();
        ctx.arc(px, py, r, 0, 6.283);
        ctx.fill();
      }
    };

    const setT = (x: number, y: number) => {
      tx = clamp(x, -1, 1);
      ty = clamp(y, -1, 1);
      last = performance.now();
    };
    const onPointer = (e: PointerEvent) =>
      setT((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      setT(e.gamma / 30, (e.beta - 45) / 30);
    };

    const frame = (t: number) => {
      const idle = t - last > 2500;
      const sx = idle ? Math.sin(t / 2300) * 0.55 : tx;
      const sy = idle ? Math.cos(t / 3100) * 0.3 : ty;
      cx += (sx - cx) * 0.06;
      cy += (sy - cy) * 0.06;
      rig.style.transform = 'rotateY(' + cx * 24 + 'deg) rotateX(' + -cy * 15 + 'deg)';
      stage.style.setProperty('--mx', 50 + cx * 42 + '%');
      stage.style.setProperty('--my', 35 + cy * 40 + '%');
      draw();
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('deviceorientation', onOrient, { passive: true });
    window.addEventListener('resize', resize);
    resize();
    if (RM) draw();
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onOrient);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const isSignIn = mode === 'signin';

  return (
    <div className={`cn-root${fast ? ' cn-fast' : ''}`}>
      <style>{CSS}</style>

      {!introDone && (
        <>
          <div className="cn-bar cn-top" />
          <div className="cn-bar cn-bottom" />
          <div className="cn-intro" aria-hidden="true">
            <div className="cn-intro-stack">
              <div className="cn-intro-logo">
                <div className="cn-intro-logo-img" />
                <div className="cn-intro-sweep" />
              </div>
              <div className="cn-flare" />
            </div>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="cn-fx" aria-hidden="true" />

      <main className="cn-layout">
        <section className="cn-showcase" aria-label="Nexa Creatives smart NFC business cards">
          <header className="cn-brand">
            <div className="cn-brand-logo" role="img" aria-label="Nexa Creatives" />
            <span className="cn-brand-sub">Smart NFC</span>
          </header>

          <div className="cn-stage" ref={stageRef} aria-hidden="true">
            <div className="cn-beam" />
            <div className="cn-floor" />
            <div className="cn-orbits">
              <div className="cn-ring-tilt cn-r1">
                <div className="cn-ring"><i className="cn-sat" /></div>
              </div>
              <div className="cn-ring-tilt cn-r2">
                <div className="cn-ring"><i className="cn-sat" /></div>
              </div>
            </div>
            <div className="cn-dolly">
              <div className="cn-float">
                <div className="cn-rig" ref={rigRef}>
                  <div className="cn-card">
                    <div className="cn-edge cn-e4" />
                    <div className="cn-edge cn-e3" />
                    <div className="cn-edge cn-e2" />
                    <div className="cn-edge cn-e1" />
                    <div className="cn-face" />
                    <div className="cn-card-tag">NFC smart card</div>
                    <div className="cn-card-logo" />
                    <div className="cn-card-foot">Your digital identity</div>
                    <div className="cn-chip-ico" />
                    <div className="cn-nfc-ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M6 8c2.2 2.6 2.2 5.4 0 8" />
                        <path d="M10.5 5.5c3.6 4 3.6 9 0 13" />
                        <path d="M15 3c5 5.4 5 12.6 0 18" />
                      </svg>
                    </div>
                  </div>

                  <div className="cn-ripple cn-rp1" />
                  <div className="cn-ripple cn-rp2" />
                  <div className="cn-ripple cn-rp3" />

                  <div className="cn-chip3d cn-c1">
                    <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>
                  </div>
                  <div className="cn-chip3d cn-c2">
                    <svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
                  </div>
                  <div className="cn-chip3d cn-c3">
                    <svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9" /></svg>
                  </div>

                  <div className="cn-phone">
                    <div className="cn-phone-screen">
                      <div className="cn-p-avatar" />
                      <div className="cn-p-line" />
                      <div className="cn-p-line cn-s" />
                      <div className="cn-p-saved">✓ Saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cn-pitch">
            <h1>
              Your digital identity.
              <br />
              <span>One tap away.</span>
            </h1>
            <p>
              Make every connection count with a smarter, seamless way to share your business profile, contact
              details and links.
            </p>
            <div className="cn-benefits">
              <div className="cn-benefit"><b>✦</b> Instant sharing</div>
              <div className="cn-benefit"><b>✦</b> One-tap connection</div>
              <div className="cn-benefit"><b>✦</b> Your profile, everywhere</div>
            </div>
          </div>
        </section>

        <section className="cn-auth-side" aria-label="Login">
          <form className="cn-auth-card" onSubmit={handleSubmit} noValidate>
            <div className="cn-user-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
            </div>
            <h2>{isSignIn ? 'Welcome back.' : 'Create your account.'}</h2>
            <p className="cn-subhead">
              {isSignIn ? 'Sign in to continue to your Nexa dashboard' : 'Start building your smart digital card'}
            </p>

            {!isSignIn && (
              <div className="cn-field">
                <label htmlFor="cn-name">Full name</label>
                <input
                  id="cn-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="cn-field">
              <label htmlFor="cn-email">Email address</label>
              <input
                id="cn-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
                required
              />
            </div>

            <div className="cn-field">
              <label htmlFor="cn-password">Password</label>
              <div className="cn-password-wrap">
                <input
                  id="cn-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={isSignIn ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  className="cn-toggle"
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? '◎' : '◉'}
                </button>
              </div>
            </div>

            <div className="cn-options">
              <label className="cn-remember">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Remember me
              </label>
              {isSignIn && (
                <button type="button" className="cn-link" onClick={handleForgot}>
                  Forgot password?
                </button>
              )}
            </div>

            <button className="cn-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait…' : isSignIn ? 'Sign in' : 'Create account'}{' '}
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </button>

            <div className={`cn-message${note ? ` show ${note.type}` : ''}`} role="status">
              {note?.text}
            </div>

            <p className="cn-signup">
              {isSignIn ? 'New to Nexa Creatives?' : 'Already have an account?'}
              <button type="button" className="cn-link" onClick={switchMode}>
                {isSignIn ? 'Create an account' : 'Sign in'}
              </button>
            </p>

            <div className="cn-secure"><span>●</span> Your digital identity, securely managed</div>
          </form>
        </section>
      </main>
    </div>
  );
};
