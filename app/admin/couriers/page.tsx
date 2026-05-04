'use client';

// Kurir page — redirect ke /admin/users tab kurir
// Karena PRD Item 35 menggabungkan User & Courier di satu halaman

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CouriersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/users');
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-gray-400">Mengarahkan ke halaman Pengguna & Kurir...</p>
    </div>
  );
}
