const channels = [
  { key: 'facebook', label: 'Facebook', icon: <path fill="currentColor" d="M13.5 22v-9.1h3.1l.5-3.6h-3.6V7c0-1 .3-1.7 1.8-1.7h1.9V2.1A24 24 0 0 0 14.4 2c-2.8 0-4.7 1.7-4.7 4.8v2.5H6.5v3.6h3.2V22z" /> },
  { key: 'tiktok', label: 'TikTok', icon: <path fill="currentColor" d="M16.7 2h-3.5v13.6a3 3 0 1 1-2.6-3V9.1a6.5 6.5 0 1 0 6.1 6.5V8.7A8.5 8.5 0 0 0 22 10V6.5A5.4 5.4 0 0 1 16.7 2z" /> },
  { key: 'instagram', label: 'Instagram', icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></> },
  { key: 'threads', label: 'Threads', icon: <path d="M20 7.2C18.8 3.8 16 2 12.1 2 6 2 3 6 3 12s3 10 9.1 10c5.4 0 8.9-2.8 8.9-7 0-3.8-3-6-7.3-6-3.7 0-6 1.7-6 4.3 0 2.1 1.6 3.5 3.7 3.5 3 0 4.6-2.2 4.6-5.8 0-3.3-1.4-5.1-4-5.1-1.6 0-2.9.7-3.7 2" /> },
];

export default function SocialLinks({ contactInfo, className = '' }) {
  return <div className={`social-links ${className}`}>
    {channels.filter(({ key }) => contactInfo[key]).map(({ key, label, icon }) => (
      <a key={key} href={contactInfo[key]} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
      </a>
    ))}
  </div>;
}
