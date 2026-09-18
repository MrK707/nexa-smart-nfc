import React, { useState } from 'react';
import { 
  UserPen, 
  Building2, 
  Phone, 
  Share2, 
  Save, 
  Check, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useCustomer } from '../context/CustomerContext';
import { UserProfile } from '../types';

export const EditProfilePage: React.FC = () => {
  const { profile, updateProfile, navigate } = useCustomer();
  
  // Local state initialized with current profile
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [activeTab, setActiveTab] = useState<'personal' | 'business' | 'contact' | 'social'>('personal');
  const [isSaved, setIsSaved] = useState(false);
  const [newService, setNewService] = useState('');

  const handlePersonalChange = (field: keyof UserProfile['personal'], value: string) => {
    setFormData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  const handleBusinessChange = (field: keyof UserProfile['business'], value: any) => {
    setFormData(prev => ({
      ...prev,
      business: {
        ...prev.business,
        [field]: value,
      },
    }));
  };

  const handleContactChange = (field: keyof UserProfile['contact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleSocialChange = (field: keyof UserProfile['social'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [field]: value,
      },
    }));
  };

  const handleAddService = () => {
    if (!newService.trim()) return;
    setFormData(prev => ({
      ...prev,
      business: {
        ...prev.business,
        services: [...(prev.business.services || []), newService.trim()],
      },
    }));
    setNewService('');
  };

  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      business: {
        ...prev.business,
        services: prev.business.services.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Top Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7c3aed]/12">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b6478] hover:text-[#7c3aed] transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f1b2e] tracking-tight flex items-center gap-3">
              <span>Edit Digital Profile</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 font-bold">
                Live Sync
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6b6478] mt-1 font-medium">
              Changes reflect immediately on your dashboard, smart NFC business card, and public link.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/u/${formData.personal.username}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#1f1b2e] bg-white/80 hover:bg-white border border-[#7c3aed]/15 hover:border-[#7c3aed]/30 shadow-xs transition-all cursor-pointer"
            >
              <span>View Public</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#7c3aed]" />
            </button>

            <button
              id="edit-profile-save-top-btn"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] hover:from-[#6d28d9] hover:to-[#06b6d4] shadow-[0_10px_24px_rgba(124,58,237,0.25)] hover:shadow-[0_14px_30px_rgba(124,58,237,0.38)] transition-all cursor-pointer"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Saved to Card!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex items-center gap-2 p-2 bg-white/[0.75] backdrop-blur-[16px] border border-[#7c3aed]/15 rounded-3xl shadow-xs overflow-x-auto">
          {[
            { id: 'personal', label: 'Personal Info', icon: UserPen },
            { id: 'business', label: 'Business & Bio', icon: Building2 },
            { id: 'contact', label: 'Contact Details', icon: Phone },
            { id: 'social', label: 'Social Networks', icon: Share2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isTabActive
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white shadow-md shadow-[#7c3aed]/25'
                    : 'text-[#6b6478] hover:text-[#1f1b2e] hover:bg-violet-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: Personal Info */}
          {activeTab === 'personal' && (
            <div className="rounded-3xl p-6 sm:p-8 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-6">
              <h3 className="text-base font-extrabold text-[#1f1b2e] tracking-tight pb-3 border-b border-[#7c3aed]/10">
                Personal Identity
              </h3>

              {/* Profile Photo URL & Quick Presets */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                  Profile Photo URL
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-[#7c3aed] to-[#22d3ee] shrink-0 shadow-md">
                    <img
                      src={formData.personal.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt="Preview"
                      className="w-full h-full rounded-[14px] object-cover bg-violet-50"
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="url"
                      id="input-profile-photo"
                      value={formData.personal.profile_photo}
                      onChange={(e) => handlePersonalChange('profile_photo', e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:bg-white focus:outline-hidden text-sm text-[#1f1b2e] font-medium transition-colors shadow-2xs"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-[#6b6478] font-bold">Quick Avatars:</span>
                      {[
                        { label: 'Executive 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Executive 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Executive 3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handlePersonalChange('profile_photo', preset.url)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/20 transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name & Job Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="input-full-name"
                    value={formData.personal.full_name}
                    onChange={(e) => handlePersonalChange('full_name', e.target.value)}
                    placeholder="e.g. John Perera"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:bg-white focus:outline-hidden text-sm text-[#1f1b2e] font-medium transition-colors shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                    Job Title / Designation
                  </label>
                  <input
                    type="text"
                    id="input-job-title"
                    value={formData.personal.job_title}
                    onChange={(e) => handlePersonalChange('job_title', e.target.value)}
                    placeholder="e.g. Founder & CEO"
                    className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:bg-white focus:outline-hidden text-sm text-[#1f1b2e] font-medium transition-colors shadow-2xs"
                  />
                </div>
              </div>

              {/* Username Handle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                  Card Handle / Username (used in NFC public URL)
                </label>
                <div className="flex items-center rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus-within:border-[#7c3aed] px-3.5 py-1.5 transition-colors shadow-2xs">
                  <span className="text-xs text-[#6b6478] font-mono font-medium">tap.nexacreatives.site/u/</span>
                  <input
                    type="text"
                    id="input-username"
                    value={formData.personal.username}
                    onChange={(e) => handlePersonalChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="username"
                    required
                    className="flex-1 px-1 py-1 bg-transparent border-none focus:outline-hidden text-sm text-[#7c3aed] font-bold font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Business & Bio */}
          {activeTab === 'business' && (
            <div className="rounded-3xl p-6 sm:p-8 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-6">
              <h3 className="text-base font-extrabold text-[#1f1b2e] tracking-tight pb-3 border-b border-[#7c3aed]/10">
                Business Profile
              </h3>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  id="input-company-name"
                  value={formData.business.company_name}
                  onChange={(e) => handleBusinessChange('company_name', e.target.value)}
                  placeholder="e.g. Nexa Solutions"
                  className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:bg-white focus:outline-hidden text-sm text-[#1f1b2e] font-medium transition-colors shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                  Executive Bio / About
                </label>
                <textarea
                  id="input-bio"
                  rows={4}
                  value={formData.business.bio}
                  onChange={(e) => handleBusinessChange('bio', e.target.value)}
                  placeholder="Share a short summary of what you or your business does..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:bg-white focus:outline-hidden text-sm text-[#1f1b2e] font-medium transition-colors shadow-2xs leading-relaxed"
                />
              </div>

              {/* Services Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                  Services / Core Competencies
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                    placeholder="Add service (e.g. NFC Digital Identity) and press enter"
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:outline-hidden text-sm text-[#1f1b2e] font-medium shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-5 py-2.5 rounded-2xl bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 text-[#7c3aed] text-xs font-bold border border-[#7c3aed]/20 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.business.services?.map((svc, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#f3f1fb] border border-[#7c3aed]/15 text-[#7c3aed] shadow-2xs"
                    >
                      <span>{svc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(i)}
                        className="text-[#6b6478] hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Contact Info */}
          {activeTab === 'contact' && (
            <div className="rounded-3xl p-6 sm:p-8 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-6">
              <h3 className="text-base font-extrabold text-[#1f1b2e] tracking-tight pb-3 border-b border-[#7c3aed]/10">
                Direct Contact Points
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="input-phone"
                    value={formData.contact.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:outline-hidden text-sm text-[#1f1b2e] font-medium shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    id="input-whatsapp"
                    value={formData.contact.whatsapp}
                    onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                    placeholder="+15550000000 (with country code)"
                    className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:outline-hidden text-sm text-[#1f1b2e] font-medium shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="input-email"
                    value={formData.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:outline-hidden text-sm text-[#1f1b2e] font-medium shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="input-website"
                    value={formData.contact.website}
                    onChange={(e) => handleContactChange('website', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:outline-hidden text-sm text-[#1f1b2e] font-medium shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                  Business Location / Address
                </label>
                <input
                  type="text"
                  id="input-address"
                  value={formData.contact.address}
                  onChange={(e) => handleContactChange('address', e.target.value)}
                  placeholder="City, State, Country"
                  className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:outline-hidden text-sm text-[#1f1b2e] font-medium shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Social Links */}
          {activeTab === 'social' && (
            <div className="rounded-3xl p-6 sm:p-8 bg-white/[0.72] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-[0_20px_45px_-12px_rgba(124,58,237,0.08),0_0_0_1px_rgba(255,255,255,0.8)_inset] space-y-6">
              <h3 className="text-base font-extrabold text-[#1f1b2e] tracking-tight pb-3 border-b border-[#7c3aed]/10">
                Social & Network Handles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                    LinkedIn Username / Path
                  </label>
                  <div className="flex items-center rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 px-3.5 py-1.5 shadow-2xs">
                    <span className="text-xs text-[#6b6478] font-mono font-medium">linkedin.com/in/</span>
                    <input
                      type="text"
                      id="input-linkedin"
                      value={formData.social.linkedin}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      placeholder="johnperera"
                      className="flex-1 px-1 py-1 bg-transparent border-none focus:outline-hidden text-sm text-[#1f1b2e] font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                    Instagram Handle
                  </label>
                  <div className="flex items-center rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 px-3.5 py-1.5 shadow-2xs">
                    <span className="text-xs text-[#6b6478] font-mono font-medium">@</span>
                    <input
                      type="text"
                      id="input-instagram"
                      value={formData.social.instagram}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      placeholder="john.nexa"
                      className="flex-1 px-1 py-1 bg-transparent border-none focus:outline-hidden text-sm text-[#1f1b2e] font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                    Facebook Handle
                  </label>
                  <input
                    type="text"
                    id="input-facebook"
                    value={formData.social.facebook}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    placeholder="johnperera.official"
                    className="w-full px-4 py-3 rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 focus:border-[#7c3aed] focus:outline-hidden text-sm text-[#1f1b2e] font-medium shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b6478]">
                    TikTok Handle
                  </label>
                  <div className="flex items-center rounded-2xl bg-[#f3f1fb] border border-[#7c3aed]/15 px-3.5 py-1.5 shadow-2xs">
                    <span className="text-xs text-[#6b6478] font-mono font-medium">@</span>
                    <input
                      type="text"
                      id="input-tiktok"
                      value={formData.social.tiktok}
                      onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                      placeholder="john_perera"
                      className="flex-1 px-1 py-1 bg-transparent border-none focus:outline-hidden text-sm text-[#1f1b2e] font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action Bar */}
          <div className="flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-white/[0.80] backdrop-blur-[16px] border border-[#7c3aed]/15 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-[#6b6478] font-medium">
              <Sparkles className="w-4 h-4 text-[#7c3aed]" />
              <span>Smart NFC chip syncs automatically when saved.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[#6b6478] hover:text-[#1f1b2e] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="edit-profile-save-bottom-btn"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] hover:from-[#6d28d9] hover:to-[#06b6d4] shadow-[0_10px_24px_rgba(124,58,237,0.25)] transition-all cursor-pointer"
              >
                {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
