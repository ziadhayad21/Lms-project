'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { courseApi } from '@/lib/api/courses.api';
import { useRouter } from 'next/navigation';

interface Props { courseId: string }

export default function EnrollButton({ courseId }: Props) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  const isEnrolled = user?.enrolledCourses?.includes(courseId);
  const isTeacher  = user?.role === 'teacher';

  if (isTeacher)  return null;
  if (isEnrolled || done) {
    return (
      <span className="badge-green px-4 py-2 text-sm font-semibold">
        ✓ Enrolled
      </span>
    );
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setLoading(true);
    setError('');
    try {
      await courseApi.enroll(courseId);
      setDone(true);
      router.refresh(); // Re-fetch server components to update enrolled state
    } catch (e: any) {
      setError(e.message ?? 'Enrollment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button onClick={handleEnroll} disabled={loading} className="btn-primary px-8">
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Enrolling…
          </span>
        ) : (
          'Enroll Now — Free'
        )}
      </button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
