import React from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { ProfileHero } from '../components/dashboard/ProfileHero';
import { ProfileCompletion } from '../components/dashboard/ProfileCompletion';
import { DigitalCardPreview } from '../components/dashboard/DigitalCardPreview';
import { QuickActions } from '../components/dashboard/QuickActions';
import { CardStatus } from '../components/dashboard/CardStatus';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { OnboardingCard } from '../components/dashboard/OnboardingCard';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';

export const DashboardOverview: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Dynamic Greeting Header */}
        <DashboardHeader />

        {/* Incomplete Profile Onboarding Banner (hides when 100%) */}
        <OnboardingCard />

        {/* Profile Hero Section */}
        <ProfileHero />

        {/* 2-Column Responsive Layout: Live Card Preview & Status Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Live Digital Card Preview (Primary showcase) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <DigitalCardPreview />
          </div>

          {/* Right Column: Profile Completion Ring & Smart Card Hardware Status */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 sm:space-y-8">
            <ProfileCompletion />
            <CardStatus />
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <QuickActions />

        {/* Recent Activity Timeline */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
};
