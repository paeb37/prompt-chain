'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

const btnBase: React.CSSProperties = {
  padding: '0.4rem',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
};

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div style={{ display: 'flex', gap: '0.2rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.2rem', opacity: 0 }}>
        <button style={btnBase}><Sun style={{ width: 14, height: 14 }} /></button>
        <button style={btnBase}><Monitor style={{ width: 14, height: 14 }} /></button>
        <button style={btnBase}><Moon style={{ width: 14, height: 14 }} /></button>
      </div>
    );
  }

  const active: React.CSSProperties = { background: 'rgba(255,255,255,0.1)', color: '#f4f4f5' };
  const inactive: React.CSSProperties = { background: 'transparent', color: '#71717a' };

  return (
    <div style={{ display: 'flex', gap: '0.2rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.2rem' }}>
      <button onClick={() => setTheme('light')} style={{ ...btnBase, ...(theme === 'light' ? active : inactive) }} title="Light Mode">
        <Sun style={{ width: 14, height: 14 }} />
      </button>
      <button onClick={() => setTheme('system')} style={{ ...btnBase, ...(theme === 'system' ? active : inactive) }} title="System">
        <Monitor style={{ width: 14, height: 14 }} />
      </button>
      <button onClick={() => setTheme('dark')} style={{ ...btnBase, ...(theme === 'dark' ? active : inactive) }} title="Dark Mode">
        <Moon style={{ width: 14, height: 14 }} />
      </button>
    </div>
  );
}
