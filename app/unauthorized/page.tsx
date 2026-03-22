import SignOutButton from '@/components/SignOutButton';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #9f1239 0%, #0d0a1c 100%)', paddingTop: '15vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          borderTop: '3px solid #f43f5e',
          padding: '2.5rem',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              padding: '0.75rem',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '12px',
              color: '#f43f5e',
            }}>
              <ShieldX style={{ width: 28, height: 28 }} />
            </div>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.5rem' }}>
            Unauthorized
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginBottom: '2rem' }}>
            You do not have permission to access this page. You must be a Superadmin or Matrix Admin.
          </p>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
