import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Copy, 
  Check, 
  Download, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  ExternalLink,
  Printer
} from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useCustomer } from '../context/CustomerContext';

export const SharePage: React.FC = () => {
  const { profile, recordCustomActivity, navigate } = useCustomer();
  const { personal, business } = profile;

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const publicUrl = `https://tap.nexacreatives.site/u/${personal.username}`;

  useEffect(() => {
    QRCode.toDataURL(publicUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1f1b2e',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [publicUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      recordCustomActivity('link_shared', 'Public profile link copied to clipboard', publicUrl);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${personal.full_name} | Nexa Smart NFC Card`,
          text: `Here is the digital business card for ${personal.full_name} (${personal.job_title}):`,
          url: publicUrl,
        });
        recordCustomActivity('link_shared', 'Shared card using System Share', publicUrl);
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      handleCopyLink();
      setShareStatus('Link copied to clipboard!');
      setTimeout(() => setShareStatus(null), 3000);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello! Connect with me on my Nexa Smart NFC digital business card:\n${personal.full_name} - ${personal.job_title}\n${publicUrl}`
    );
    recordCustomActivity('link_shared', 'Shared card via WhatsApp', publicUrl);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`${personal.full_name} - Digital Business Card`);
    const body = encodeURIComponent(
      `Hi,\n\nPlease find my Nexa Smart NFC business card below:\n${personal.full_name}\n${personal.job_title} | ${business.company_name}\n\nView my card and save contact details: ${publicUrl}\n`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${personal.username || 'nexa'}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    recordCustomActivity('qr_scanned', 'Downloaded QR Code asset');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7c3aed]/12">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f1b2e] tracking-tight flex items-center gap-3">
              <span>Share My Smart Card</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 font-bold">
                Multi-Channel
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6b6478] mt-1 font-medium">
              Share your digital business identity via QR code, direct link, WhatsApp, or instant NFC.
            </p>
          </div>

          <button
            onClick={() => navigate(`/u/${personal.username}`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-[#1f1b2e] bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>Preview Public Card</span>
            <ExternalLink className="w-4 h-4 text-[#7c3aed]" />
          </button>
        </div>

        {/* 2-Column Sharing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: High-Res QR Card Display */}
          <div className="lg:col-span-5 flex flex-col items-center rounded-3xl p-8 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] text-center">
            <div className="p-4 bg-white rounded-3xl shadow-xl shadow-[#7c3aed]/10 border border-[#7c3aed]/10 mb-6">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="QR Code" 
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
                />
              ) : (
                <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center text-[#6b6478] text-xs font-medium">
                  Generating High-Res QR...
                </div>
              )}
            </div>

            <h3 className="text-base font-extrabold text-[#1f1b2e] tracking-tight">
              Scan to Connect Instantly
            </h3>
            <p className="text-xs text-[#6b6478] mt-1 max-w-xs font-medium">
              Directly opens your NFC profile on any iOS or Android camera without installing any apps.
            </p>

            <button
              onClick={handleDownloadQr}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] hover:from-[#6d28d9] hover:to-[#06b6d4] shadow-[0_10px_24px_rgba(124,58,237,0.25)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable QR Image</span>
            </button>
          </div>

          {/* Right: Sharing Channels & Instant Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Share Link Box */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7c3aed]">
                Direct Public Card URL
              </label>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 flex items-center justify-between gap-3 shadow-2xs">
                <span className="text-xs sm:text-sm font-mono font-bold text-[#1f1b2e] truncate">
                  {publicUrl}
                </span>

                <button
                  id="share-page-copy-btn"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-sm transition-all cursor-pointer shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {shareStatus && (
                <p className="text-xs text-emerald-600 font-bold">{shareStatus}</p>
              )}
            </div>

            {/* Sharing Methods Grid */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-4">
              <h3 className="text-sm font-extrabold text-[#1f1b2e] tracking-tight">
                Quick Sharing Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleNativeShare}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 text-left shadow-2xs transition-all cursor-pointer group"
                >
                  <div className="p-2.5 rounded-xl bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 group-hover:scale-105 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1f1b2e] group-hover:text-[#7c3aed]">
                      System Native Share
                    </h4>
                    <p className="text-[11px] text-[#6b6478] mt-0.5 font-medium">AirDrop, SMS, Nearby</p>
                  </div>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-500/20 hover:border-emerald-500/30 text-left shadow-2xs transition-all cursor-pointer group"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/25 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1f1b2e] group-hover:text-emerald-700">
                      Send to WhatsApp
                    </h4>
                    <p className="text-[11px] text-[#6b6478] mt-0.5 font-medium">Direct chat message</p>
                  </div>
                </button>

                <button
                  onClick={handleEmailShare}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 text-left shadow-2xs transition-all cursor-pointer group"
                >
                  <div className="p-2.5 rounded-xl bg-violet-500/10 text-[#7c3aed] border border-violet-500/20 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1f1b2e] group-hover:text-[#7c3aed]">
                      Email Card
                    </h4>
                    <p className="text-[11px] text-[#6b6478] mt-0.5 font-medium">Pre-composed email link</p>
                  </div>
                </button>

                <button
                  onClick={handleDownloadQr}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 text-left shadow-2xs transition-all cursor-pointer group"
                >
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1f1b2e] group-hover:text-cyan-600">
                      Print Badge / Card
                    </h4>
                    <p className="text-[11px] text-[#6b6478] mt-0.5 font-medium">Vector QR format</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
