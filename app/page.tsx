import { requireAdmin } from '@/utils/auth';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { Layers, Workflow, TestTube2, MessageSquare } from 'lucide-react';

export default async function Dashboard() {
  const user = await requireAdmin();

  return (
    <div style={{ minHeight: '100vh', background: '#0d0a1c' }}>
      <header style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Workflow style={{ width: 28, height: 28 }} />
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Prompt Tool
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Manage Humor Flavors and Generation Pipelines
        </p>

        {/* Humor Flavors — wide horizontal card */}
        <Link href="/flavors" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            transition: 'all 0.2s',
          }}>
            <div style={{
              padding: '1rem',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '14px',
              color: '#a855f7',
              flexShrink: 0,
            }}>
              <Layers style={{ width: 28, height: 28 }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f4f4f5', margin: '0 0 0.35rem 0' }}>Humor Flavors</h2>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                Create and manage your humor styles and prompt steps.
              </p>
            </div>
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              color: '#fff',
              padding: '0.6rem 1.5rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.9rem',
              flexShrink: 0,
            }}>
              Open
            </span>
          </div>
        </Link>

        {/* Bottom row — two cards side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {/* Pipeline Tester — icon-top centered card */}
          <Link href="/test-pipeline" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              transition: 'all 0.2s',
              height: '100%',
            }}>
              <div style={{
                display: 'inline-flex',
                padding: '0.75rem',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '14px',
                color: '#38bdf8',
                marginBottom: '1rem',
              }}>
                <TestTube2 style={{ width: 24, height: 24 }} />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', margin: '0 0 0.5rem 0' }}>Pipeline Tester</h2>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Run images through your prompt chains to generate captions.
              </p>
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                color: '#fff',
                padding: '0.6rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}>
                Open
              </span>
            </div>
          </Link>

          {/* Captions Viewer — left-aligned compact card */}
          <Link href="/captions" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '16px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
              height: '100%',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    padding: '0.6rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    color: '#10b981',
                  }}>
                    <MessageSquare style={{ width: 20, height: 20 }} />
                  </div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Captions Viewer</h2>
                </div>
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Browse and filter all generated captions.
                </p>
              </div>
              <span style={{
                display: 'block',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                padding: '0.6rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}>
                Open
              </span>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
