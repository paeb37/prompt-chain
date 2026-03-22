'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

type Props = {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
};

export default function Pagination({ page, totalPages, hasNextPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const navBtn = (disabled: boolean): React.CSSProperties => ({
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: disabled ? '#52525b' : '#d4d4d8',
    padding: '0.5rem 0.75rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '0.75rem 1rem',
    }}>
      <p style={{ fontSize: '0.85rem', color: '#71717a' }}>
        Page <span style={{ color: '#f4f4f5', fontWeight: 600 }}>{page}</span> of <span style={{ color: '#f4f4f5', fontWeight: 600 }}>{totalPages}</span>
      </p>
      <div style={{ display: 'flex' }}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          style={{ ...navBtn(page <= 1), borderRadius: '8px 0 0 8px' }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
        </button>
        <span style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderLeft: 'none',
          borderRight: 'none',
          color: '#f4f4f5',
          padding: '0.5rem 1rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
        }}>
          {page}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNextPage}
          style={{ ...navBtn(!hasNextPage), borderRadius: '0 8px 8px 0' }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
}
