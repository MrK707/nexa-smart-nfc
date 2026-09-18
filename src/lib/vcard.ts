import { UserProfile } from '../types';

export function generateVCard(profile: UserProfile): string {
  const { personal, business, contact } = profile;
  
  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${personal.full_name}`,
    `N:${personal.full_name.split(' ').slice(1).join(' ') || ''};${personal.full_name.split(' ')[0] || ''};;;`,
    `TITLE:${personal.job_title}`,
    `ORG:${business.company_name}`,
    `NOTE:${business.bio}`,
    contact.phone ? `TEL;TYPE=CELL,VOICE:${contact.phone}` : '',
    contact.email ? `EMAIL;TYPE=INTERNET,WORK:${contact.email}` : '',
    contact.website ? `URL:${contact.website}` : '',
    contact.address ? `ADR;TYPE=WORK:;;${contact.address};;;;` : '',
    `URL;TYPE=NexaCard:${profile.card.public_profile_url}`,
    'END:VCARD'
  ].filter(Boolean);

  return vcardLines.join('\r\n');
}

export function downloadVCard(profile: UserProfile): void {
  const vcard = generateVCard(profile);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${profile.personal.username || 'contact'}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
