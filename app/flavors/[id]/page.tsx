import { requireAdmin } from '@/utils/auth';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import StepBuilderClient from './StepBuilderClient';
import BackButton from '@/components/BackButton';
import { Layers } from 'lucide-react';

export default async function FlavorBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const supabase = await createClient();
  const { id } = await params;

  const { data: flavor, error: flavorError } = await supabase
    .from('humor_flavors')
    .select('*')
    .eq('id', id)
    .single();

  if (flavorError || !flavor) {
    notFound();
  }

  const { data: steps } = await supabase
    .from('humor_flavor_steps')
    .select('*')
    .eq('humor_flavor_id', id)
    .order('order_by', { ascending: true });

  const [
    { data: inputTypes },
    { data: outputTypes },
    { data: models },
    { data: stepTypes }
  ] = await Promise.all([
    supabase.from('llm_input_types').select('*').order('id'),
    supabase.from('llm_output_types').select('*').order('id'),
    supabase.from('llm_models').select('*').order('name'),
    supabase.from('humor_flavor_step_types').select('*').order('id')
  ]);

  return (
    <div style={{ minHeight: '100vh', background: '#0d0a1c' }}>
      <header style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <BackButton fallbackUrl="/flavors" label="← Back to Flavors" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Layers style={{ width: 24, height: 24, color: '#fff' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Chain Builder: {flavor.slug}
            </h1>
          </div>
          {flavor.description && (
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{flavor.description}</p>
          )}
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <StepBuilderClient
          flavorId={parseInt(id)}
          initialSteps={steps || []}
          lookups={{
            inputTypes: inputTypes || [],
            outputTypes: outputTypes || [],
            models: models || [],
            stepTypes: stepTypes || []
          }}
        />
      </main>
    </div>
  );
}
