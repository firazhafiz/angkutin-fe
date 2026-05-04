
import React from 'react';

// ──────────────────────────────────────────────────────────
// Tipe props: semua props input HTML + tambahan label & icon
// ──────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightIcon?: React.ReactNode; // contoh: tombol show/hide password
}

// ──────────────────────────────────────────────────────────
// Komponen Input
// ──────────────────────────────────────────────────────────
export const Input: React.FC<InputProps> = ({ label, rightIcon, className = '', ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {/* Label opsional */}
      {label && (
        <label
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#1a1a1a',
          }}
        >
          {label}
        </label>
      )}

      {/* Wrapper untuk input + icon */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          style={{
            width: '100%',
            padding: '12px 16px',
            paddingRight: rightIcon ? '44px' : '16px',
            border: '1.5px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#1a1a1a',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
          className={className}
          {...props}
        />
        {/* Icon kanan (misal: eye untuk password) */}
        {rightIcon && (
          <span
            style={{
              position: 'absolute',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              color: '#9e9e9e',
              cursor: 'pointer',
            }}
          >
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
};
