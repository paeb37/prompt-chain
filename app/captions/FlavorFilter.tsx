'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function FlavorFilter({
  flavors,
  currentFlavor
}: {
  flavors: { id: number, slug: string }[],
  currentFlavor: string
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <select
      value={currentFlavor}
      onChange={(e) => {
        const val = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        if (val) { params.set('flavor', val); } else { params.delete('flavor'); }
        params.delete('page');
        router.replace(`${pathname}?${params.toString()}`);
      }}
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '0.5rem 0.75rem',
        color: '#f4f4f5',
        fontSize: '0.85rem',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <option value="">All Flavors</option>
      {flavors?.map(f => (
        <option key={f.id} value={f.id}>{f.slug}</option>
      ))}
    </select>
  );
}
