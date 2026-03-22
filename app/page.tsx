import { requireAdmin } from '@/utils/auth';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { ThemeToggle } from '@/components/ThemeToggle';
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
              Prompt Chain Tool
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ThemeToggle />
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Flavor Management */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                padding: '0.6rem',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '10px',
                color: '#a855f7',
              }}>
                <Layers style={{ width: 20, height: 20 }} />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Humor Flavors</h2>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Define the core styles of humor. These act as the parent containers for prompt steps.
            </p>
            <Link
              href="/flavors"
              style={{
                display: 'block',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              Manage Flavors
            </Link>
          </div>

          {/* Testing Tool */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                padding: '0.6rem',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '10px',
                color: '#38bdf8',
              }}>
                <TestTube2 style={{ width: 20, height: 20 }} />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Pipeline Tester</h2>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Test your prompt chains by running images through specific Humor Flavors using the live generation API.
            </p>
            <Link
              href="/test-pipeline"
              style={{
                display: 'block',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              Open Tester
            </Link>
          </div>

          {/* Results Viewer */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
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
              Browse and review all captions generated by the system, filterable by specific Humor Flavors.
            </p>
            <Link
              href="/captions"
              style={{
                display: 'block',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              View Captions
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
