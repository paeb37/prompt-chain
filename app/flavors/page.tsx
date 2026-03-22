import { requireAdmin } from '@/utils/auth';
import { createClient } from '@/utils/supabase/server';
import FlavorListClient from './FlavorListClient';
import BackButton from '@/components/BackButton';
import { Layers } from 'lucide-react';

export default async function FlavorsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: flavors, error } = await supabase
    .from('humor_flavors')
    .select('*, humor_flavor_steps(count)')
    .order('id', { ascending: true });

  if (error) {
    return <div style={{ color: '#f43f5e', padding: '2rem' }}>Error loading flavors: {error.message}</div>;
  }

  const processedFlavors = flavors.map(f => ({
    ...f,
    step_count: f.humor_flavor_steps?.[0]?.count || 0
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#0d0a1c' }}>
      <header style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <BackButton fallbackUrl="/" label="← Dashboard" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Layers style={{ width: 24, height: 24, color: '#fff' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Humor Flavors
            </h1>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <FlavorListClient initialFlavors={processedFlavors} />
      </main>
    </div>
  );
}
