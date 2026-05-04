// components/ui/Button.tsx
// ─────────────────────────────────────────────────────────
// Komponen tombol yang bisa dipakai ulang.
// Mendukung variant: 'primary' (hijau) dan 'outline' (border saja).
// ─────────────────────────────────────────────────────────

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = true,
  children,
  style,
  disabled,
  ...props
}) => {
  // Style dasar yang selalu ada
  const base: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    padding: '14px 24px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '15px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.2s, background-color 0.2s',
    opacity: disabled ? 0.6 : 1,
    border: 'none',
  };

  // Style khusus per variant
  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#1a9e7a',
      color: '#ffffff',
    },
    outline: {
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      border: '1.5px solid #e0e0e0',
    },
  };

  return (
    <button
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
};
