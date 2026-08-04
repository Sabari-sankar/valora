import React from 'react';

// General animated SVG wrapper styles can be embedded
const animateStyle = `
  @keyframes coin-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes lid-slide {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-2px) rotate(-3deg); }
  }
  @keyframes gear-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes line-grow {
    0%, 100% { stroke-dashoffset: 40; }
    50% { stroke-dashoffset: 0; }
  }
  @keyframes bar-scale {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.7); }
  }
  @keyframes float-tiny {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-2px) scale(1.02); }
  }
  .icon-svg {
    transition: transform 0.3s ease;
    transform-origin: center;
  }
  .icon-svg:hover {
    transform: scale(1.15);
  }
  .icon-svg:hover .h-spin {
    animation: gear-spin 3s linear infinite;
    transform-origin: center;
  }
  .icon-svg:hover .h-bounce {
    animation: coin-bounce 0.8s ease-in-out infinite;
  }
  .icon-svg:hover .h-lid {
    animation: lid-slide 0.6s ease-in-out infinite;
    transform-origin: top left;
  }
  .icon-svg:hover .h-bar {
    animation: bar-scale 1s ease-in-out infinite;
    transform-origin: bottom;
  }
`;

export const SVGStyleBlock = () => <style dangerouslySetInnerHTML={{ __html: animateStyle }} />;

export const LogoIcon = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg float-icon ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 3l8 4.5v9l-8 4.5l-8 -4.5v-9l8 -4.5" fill="var(--color-trust-light)" stroke="var(--color-trust)" />
    <circle cx="12" cy="12" r="3" fill="var(--color-growth)" className="h-bounce" />
    <path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" stroke="var(--color-growth)" strokeDasharray="3 3" />
  </svg>
);

export const WalletIcon = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg float-icon-reverse ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3" />
    <path d="M17 12h-12a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h12a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" fill="var(--color-trust-light)" />
    <circle cx="16" cy="16" r="1" fill="var(--color-amber)" className="h-bounce" />
  </svg>
);

export const CoinsIcon = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg float-icon ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <circle cx="9" cy="5" r="3" fill="var(--color-amber-light)" stroke="var(--color-amber)" className="h-bounce" />
    <circle cx="15" cy="18" r="3" fill="var(--color-growth-light)" stroke="var(--color-growth)" style={{ animationDelay: '0.2s' }} className="h-bounce" />
    <path d="M9 12v3" />
    <path d="M15 11v1" />
  </svg>
);

export const TrendUpIcon = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg ${className}`}
    style={{ color: 'var(--color-growth)' }}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 17l6 -6l4 4l8 -8" />
    <polyline points="14 7 20 7 20 13" fill="none" className="h-bounce" />
  </svg>
);

export const TrendDownIcon = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg ${className}`}
    style={{ color: 'var(--color-expense)' }}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 7l6 6l4 -4l8 8" />
    <polyline points="14 17 20 17 20 11" fill="none" className="h-bounce" />
  </svg>
);

export const CategoryIcon = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg float-icon-reverse ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <rect x="4" y="4" width="6" height="6" rx="1" fill="var(--color-trust-light)" className="h-spin" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <rect x="14" y="14" width="6" height="6" rx="1" fill="var(--color-growth-light)" className="h-spin" />
  </svg>
);

export const SettingsIcon = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path className="h-spin" d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
    <circle cx="12" cy="12" r="3" fill="var(--bg-primary)" />
  </svg>
);

export const PlusIcon = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="12" y1="5" x2="12" y2="19" className="h-bounce" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const TrashIcon = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" fill="var(--color-expense-light)" className="h-lid" />
  </svg>
);

export const EditIcon = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" fill="var(--color-trust-light)" className="h-bounce" />
    <line x1="16" y1="5" x2="19" y2="8" />
  </svg>
);

export const RefreshIcon = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" className="h-spin" />
    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" className="h-spin" />
  </svg>
);

export const ChartIcon = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg float-icon ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="4" y1="20" x2="20" y2="20" />
    <rect x="7" y="11" width="3" height="9" rx="1" fill="var(--color-trust-light)" className="h-bar" />
    <rect x="13" y="4" width="3" height="16" rx="1" fill="var(--color-growth-light)" className="h-bar" style={{ animationDelay: '0.2s' }} />
    <path d="M4 14l6 -4l4 4l6 -6" stroke="var(--color-amber)" strokeWidth="1.5" />
  </svg>
);

export const ExportIcon = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v2" />
    <path d="M16 19h6m-3 -3l3 3l-3 3" className="h-bounce" />
  </svg>
);

export const ImportIcon = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg ${className}`}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M12 21h-5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v4" />
    <path d="M22 19h-6m3 -3l-3 3l3 3" className="h-bounce" />
  </svg>
);

export const CalendarIcon = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg float-icon ${className}`}
  >
    <rect x="4" y="5" width="16" height="15" rx="2" fill="var(--color-trust-light)" />
    <line x1="16" y1="3" x2="16" y2="7" className="h-bounce" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="4" y1="11" x2="20" y2="11" />
    <rect x="8" y="14" width="2" height="2" rx="0.5" fill="var(--color-growth)" />
    <rect x="12" y="14" width="2" height="2" rx="0.5" />
  </svg>
);

export const CheckIcon = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon-svg ${className}`}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const UserActiveIcon = ({ className = '', size = 26, name = 'User' }) => {
  const initial = name ? name.trim().charAt(0).toUpperCase() : 'U';
  return (
    <div 
      className={className}
      style={{ 
        position: 'relative', 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: size * 0.44,
        boxShadow: '0 2px 10px var(--primary-glow-strong)',
        flexShrink: 0,
        fontFamily: "'Space Grotesk', 'Inter', sans-serif"
      }}
    >
      {initial}
      <span
        style={{
          position: 'absolute',
          top: -1,
          right: -1,
          width: Math.max(size * 0.26, 8),
          height: Math.max(size * 0.26, 8),
          borderRadius: '50%',
          backgroundColor: '#10b981',
          boxShadow: '0 0 8px #10b981',
          border: '1.5px solid var(--modal)'
        }}
      />
    </div>
  );
};

export const UserIcon = ({ className = '', size = 24, color = 'currentColor', fill = 'none' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <circle cx="12" cy="7" r="4" fill={fill} />
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
  </svg>
);


