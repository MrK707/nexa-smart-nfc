import React from 'react';
import type { UserProfile } from '../types';
import { getTheme } from '../lib/themes';
import { PublicCardView } from './PublicCardView';
import { FramedCard } from './FramedCard';

interface ThemedCardProps {
  profile: UserProfile;
  themeId?: string;
  preview?: boolean;
  onSaveContact?: () => void;
  onShare?: () => void;
}

// Picks the right design for the chosen theme
export const ThemedCard: React.FC<ThemedCardProps> = ({ profile, themeId, preview, onSaveContact, onShare }) => {
  const theme = getTheme(themeId);
  if (theme.layout === 'aqua' || theme.layout === 'purple') {
    return (
      <FramedCard
        profile={profile}
        layout={theme.layout}
        height="620px"
        onSave={onSaveContact}
        onShare={onShare}
      />
    );
  }
  return <PublicCardView profile={profile} themeId={theme.id} preview={preview} onSaveContact={onSaveContact} />;
};
