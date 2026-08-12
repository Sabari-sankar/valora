'use client';

import { useState, useEffect } from 'react';
import './SpecularButton.css';

const SpecularButton = ({
  children = 'Get Started',
  size = 'lg',
  radius = 9999,
  tint = '#141625',
  tintOpacity = 0.95,
  blur = 16,
  textColor = '#ffffff',
  lineColor,
  baseColor,
  speed,
  followMouse,
  proximity,
  autoAnimate,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style = {}
}) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateTheme = () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(activeTheme);
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isLight = theme === 'light';
  const finalTint = tint !== '#141625' ? tint : (isLight ? '#ffffff' : '#0e0f1d');
  const finalTextColor = textColor !== '#ffffff' ? textColor : (isLight ? '#0f172a' : '#ffffff');
  const finalBorderColor = lineColor || 'var(--border-strong)';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`}
      style={{
        '--sb-radius': `${radius}px`,
        '--sb-tint': finalTint,
        '--sb-tint-opacity': tintOpacity,
        '--sb-blur': `${blur}px`,
        '--sb-text-color': finalTextColor,
        borderColor: finalBorderColor,
        ...style
      }}
    >
      <span className="specular-button__label">{children}</span>
    </button>
  );
};

export default SpecularButton;
