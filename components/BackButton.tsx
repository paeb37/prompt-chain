'use client';

import { useRouter } from 'next/navigation';

type Props = {
  fallbackUrl: string;
  label: string;
};

export default function BackButton({ fallbackUrl, label }: Props) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      onClick={handleBack}
      style={{
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.9rem',
        cursor: 'pointer',
        padding: 0,
        textDecoration: 'none',
      }}
    >
      {label}
    </button>
  );
}
