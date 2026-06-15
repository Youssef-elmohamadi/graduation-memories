import { redirect } from 'next/navigation';
import { checkAuth, logout } from '@/app/actions/authActions';
import { getMemories } from '@/app/actions/memoryActions';
import MemoryViewer from './MemoryViewer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ذكريات يوسف',
  description: 'سجل خاص بذكريات وتهاني الخريج يوسف.',
};

export const dynamic = 'force-dynamic';

async function handleLogout() {
  'use server';
  await logout();
  redirect('/login');
}

export default async function MyMemoriesPage() {
  // Auth check (middleware already enforces this at the edge —
  // this is a defence-in-depth layer for direct server component calls)
  const authed = await checkAuth();
  if (!authed) redirect('/login');

  let memories;
  try {
    memories = await getMemories();
  } catch {
    // If getMemories throws for any reason, send back to login
    redirect('/login');
  }

  return <MemoryViewer memories={memories} onLogout={handleLogout} />;
}
