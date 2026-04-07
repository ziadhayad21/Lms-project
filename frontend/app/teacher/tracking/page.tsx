import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import StudentTrackingSection from '@/components/dashboard/StudentTrackingSection';

export const metadata: Metadata = {
  title: 'Student Tracking | Teacher Dashboard',
  description: 'Monitor student activity and progress.',
};

async function fetchTracking(token: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  const res = await fetch(`${base}/api/v1/progress/tracking`, {
    headers: { Cookie: `jwt=${token}` },
    next: { revalidate: 15 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.tracking ?? [];
}

export default async function TrackingPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const students = await fetchTracking(token);
  if (!students) redirect('/login');

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <StudentTrackingSection initial={students} />
    </div>
  );
}
