import { requireAdmin } from '@/utils/auth';
import { createClient } from '@/utils/supabase/server';
import TesterClient from './TesterClient';
import BackButton from '@/components/BackButton';
import { TestTube2 } from 'lucide-react';

export default async function TestPipelinePage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: flavors, error: flavorsError } = await supabase
    .from('humor_flavors')
    .select('*')
    .order('id', { ascending: true });

  const { data: imageSets, error: setsError } = await supabase
    .from('study_image_sets')
    .select('*')
    .order('created_datetime_utc', { ascending: false });

  const { data: defaultImages, error: imagesError } = await supabase
    .from('images')
    .select('id, url')
    .not('url', 'is', null)
    .order('created_datetime_utc', { ascending: false })
    .limit(24);

  if (flavorsError || imagesError || setsError) {
    return <div style={{ color: '#f43f5e', padding: '2rem' }}>Error loading data for tester.</div>;
  }

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
            <TestTube2 style={{ width: 24, height: 24, color: '#fff' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Pipeline Tester
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Select a dataset, an image, and a humor flavor to test your prompt chains via the live API.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <TesterClient
          flavors={flavors || []}
          imageSets={imageSets || []}
          defaultImages={defaultImages || []}
        />
      </main>
    </div>
  );
}
