'use client';

import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Load theme preference on client load
  useEffect(() => {
    const savedTheme = localStorage.getItem('valora_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('valora_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!mounted) {
    return (
      <div style={{ width: '42px', height: '42px', borderRadius: '50%' }} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary"
      aria-label="Toggle Theme"
      style={{
        width: '42px',
        height: '42px',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        boxShadow: 'var(--shadow-sm)',
        border: '1.5px solid var(--border)',
        background: 'var(--btn-ghost-bg)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, background-color 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {theme === 'light' ? (
        /* Sun (Light Mode Icon) */
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="float-icon"
        >
          <circle cx="12" cy="12" r="5" fill="rgba(245, 158, 11, 0.15)" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1.01" y1="12" x2="3.01" y2="12" />
          <line x1="21.01" y1="12" x2="23.01" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        /* Moon (Dark Mode Icon) */
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="float-icon-reverse"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="rgba(59, 130, 246, 0.15)" />
        </svg>
      )}
    </button>
  );
}
