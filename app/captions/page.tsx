import { requireAdmin } from '@/utils/auth';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import FlavorFilter from './FlavorFilter';
import Pagination from '@/components/Pagination';
import BackButton from '@/components/BackButton';

export default async function CaptionsPage({ searchParams }: { searchParams: Promise<{ flavor?: string, page?: string }> }) {
  await requireAdmin();
  const supabase = await createClient();
  const params = await searchParams;
  const flavorFilter = params.flavor;

  const page = parseInt(params.page || '1');
  const limit = 50;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: flavors } = await supabase.from('humor_flavors').select('id, slug').order('slug');

  let query = supabase
    .from('captions')
    .select(`
      *,
      humor_flavors ( slug ),
      profiles!profile_id ( email )
    `, { count: 'exact' })
    .order('created_datetime_utc', { ascending: false })
    .range(from, to);

  if (flavorFilter) {
    query = query.eq('humor_flavor_id', flavorFilter);
  }

  const { data: captions, count, error } = await query;

  if (error) return <div style={{ color: '#f43f5e', padding: '2rem' }}>Error loading captions: {error.message}</div>;

  const totalPages = count ? Math.ceil(count / limit) : 0;
  const hasNextPage = page < totalPages;

  const currentParams = new URLSearchParams();
  if (flavorFilter) currentParams.set('flavor', flavorFilter);
  if (page > 1) currentParams.set('page', page.toString());
  const queryString = currentParams.toString();
  const returnSuffix = queryString ? `?${queryString}` : '';

  return (
    <div style={{ minHeight: '100vh', background: '#0d0a1c' }}>
      <header style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <BackButton fallbackUrl="/" label="← Dashboard" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MessageSquare style={{ width: 24, height: 24, color: '#fff' }} />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', margin: 0 }}>Generated Captions</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Filter:</span>
              <FlavorFilter flavors={flavors || []} currentFlavor={flavorFilter || ''} />
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                <th style={{ color: '#a1a1aa', padding: '1rem', fontWeight: 600, fontSize: '0.85rem', textAlign: 'left' }}>Content</th>
                <th style={{ color: '#a1a1aa', padding: '1rem', fontWeight: 600, fontSize: '0.85rem', textAlign: 'left' }}>Flavor</th>
                <th style={{ color: '#a1a1aa', padding: '1rem', fontWeight: 600, fontSize: '0.85rem', textAlign: 'left' }}>Author</th>
                <th style={{ color: '#a1a1aa', padding: '1rem', fontWeight: 600, fontSize: '0.85rem', textAlign: 'left' }}>Date</th>
                <th style={{ color: '#a1a1aa', padding: '1rem', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {captions?.map((caption) => {
                const flavorSlug = Array.isArray(caption.humor_flavors) ? caption.humor_flavors[0]?.slug : (caption.humor_flavors as any)?.slug;
                const authorEmail = Array.isArray(caption.profiles) ? caption.profiles[0]?.email : (caption.profiles as any)?.email;

                return (
                  <tr key={caption.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <Link href={`/captions/${caption.id}${returnSuffix}`} style={{ color: '#38bdf8', fontSize: '0.9rem', fontStyle: 'italic', textDecoration: 'none' }}>
                        &ldquo;{caption.content.length > 80 ? `${caption.content.substring(0, 80)}...` : caption.content}&rdquo;
                      </Link>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', color: '#fff', background: 'rgba(168,85,247,0.3)' }}>
                        {flavorSlug || `ID: ${caption.humor_flavor_id}`}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#a1a1aa' }}>
                      {authorEmail || caption.profile_id}
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#a1a1aa' }}>
                      {new Date(caption.created_datetime_utc).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', textAlign: 'right' }}>
                      <Link href={`/captions/${caption.id}${returnSuffix}`} style={{ color: '#a855f7', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {captions?.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#52525b', fontStyle: 'italic' }}>
                    No captions found for this flavor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination page={page} totalPages={totalPages} hasNextPage={hasNextPage} />
        </div>
      </main>
    </div>
  );
}
