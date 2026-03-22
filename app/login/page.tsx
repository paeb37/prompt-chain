import LoginButton from '@/components/LoginButton';
import { Workflow } from 'lucide-react';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0a1c', paddingTop: '15vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          borderTop: '3px solid #a855f7',
          padding: '2.5rem',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              padding: '0.75rem',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '12px',
              color: '#a855f7',
            }}>
              <Workflow style={{ width: 28, height: 28 }} />
            </div>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.5rem' }}>
            Prompt Tool
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Please sign in to continue.
          </p>
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
