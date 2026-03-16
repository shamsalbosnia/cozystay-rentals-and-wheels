'use client';

import { Suspense } from 'react';
import AdminDashboard from '@/views/AdminDashboard';

export default function AdminPage() {
  return (
    <Suspense>
      <AdminDashboard />
    </Suspense>
  );
}
