import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare, 
  Download, 
  ShieldCheck
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const ShareModal: React.FC = () => {
  const { profile, isShareModalOpen, setShareModalOpen, recordCustomActivity } = useCustomer();
  const { personal } = profile;

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const publicUrl = `https://tap.nexacreatives.site/u/${personal.username}`;

  useEffect(() => {
    if (isShareModalOpen && personal.username) {
      QRCode.toDataURL(publicUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#1f1b2e',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR', err));
    }
  }, [isShareModalOpen, personal.username, publicUrl]);

  if (!isShareModalOpen) return null;

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
          title: `${personal.full_name} - Nexa Smart Digital Card`,
          text: `Connect with ${personal.full_name} (${personal.job_title} at ${profile.business.company_name}):`,
          url: publicUrl,
        });
        recordCustomActivity('link_shared', 'Shared via Native System Share', publicUrl);
      } catch (err) {
        console.log('Share dismissed or cancelled', err);
      }
    } else {
      handleCopyLink();
      setShareFeedback('Link copied! Paste anywhere to share.');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `Hi! Here is my Nexa Smart NFC digital business card:\n${personal.full_name} | ${personal.job_title}\n${publicUrl}`
    );
    recordCustomActivity('link_shared', 'Shared card to WhatsApp', publicUrl);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${personal.username || 'nexa'}-smart-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    recordCustomActivity('qr_scanned', 'Smart Card QR Code image downloaded');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => setShareModalOpen(false)}
      />

      {/* Modal Dialog (Aurora Glass) */}
      <div 
        id="share-card-modal"
        className="relative z-10 w-full max-w-md bg-white/[0.90] backdrop-blur-[20px] border border-[#7c3aed]/20 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(124,58,237,0.25)] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setShareModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#6b6478] hover:text-[#1f1b2e] hover:bg-violet-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Profile */}
        <div className="text-center space-y-3 pt-1">
          <div className="relative inline-block mx-auto">
            <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#7c3aed] to-[#22d3ee] shadow-md">
              <img
                src={personal.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={personal.full_name}
                className="w-full h-full rounded-full object-cover bg-violet-50"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-[#1f1b2e] tracking-tight">
              {personal.full_name}
            </h3>
            <p className="text-xs text-[#7c3aed] font-bold">
              {personal.job_title} {profile.business.company_name && `• ${profile.business.company_name}`}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-xs text-[#7c3aed] font-bold font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span>NFC Verified Card</span>
          </div>
        </div>

        {/* Dynamic High-Res QR Code Card */}
        <div className="mt-6 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl shadow-lg shadow-[#7c3aed]/10 border border-[#7c3aed]/15 flex flex-col items-center">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt={`QR code for ${personal.full_name}`}
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-[#6b6478] text-xs font-medium">
                Generating QR...
              </div>
            )}
            <p className="text-[10px] font-mono tracking-wider text-[#6b6478] uppercase mt-2 font-bold">
              Scan with any camera or NFC
            </p>
          </div>
        </div>

        {/* Public Profile URL Box */}
        <div className="mt-5 p-2.5 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-[#1f1b2e] truncate pl-1 font-semibold">
            {publicUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-xs hover:opacity-90 transition-all cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {shareFeedback && (
          <p className="text-center text-xs text-emerald-600 mt-2 font-bold">
            {shareFeedback}
          </p>
        )}

        {/* 4 Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <button
            id="share-modal-copy-btn"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white hover:bg-violet-50 border border-[#7c3aed]/15 text-[#1f1b2e] text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#7c3aed]" />}
            <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
          </button>

          <button
            id="share-modal-native-btn"
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 border border-[#7c3aed]/20 text-[#7c3aed] text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4 text-[#7c3aed]" />
            <span>Share</span>
          </button>

          <button
            id="share-modal-whatsapp-btn"
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-500/20 text-emerald-700 text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            id="share-modal-download-qr-btn"
            onClick={handleDownloadQr}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white hover:bg-violet-50 border border-[#7c3aed]/15 text-[#1f1b2e] text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-[#0284c7]" />
            <span>Download QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
