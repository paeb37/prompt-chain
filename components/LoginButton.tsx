'use client';

import { createClient } from '@/utils/supabase/client';

export default function LoginButton() {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#f4f4f5',
        fontWeight: 600,
        padding: '0.85rem 1.5rem',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.95rem',
      }}
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google Logo"
        style={{ width: 22, height: 22 }}
      />
      <span>Sign in with Google</span>
    </button>
  );
}
