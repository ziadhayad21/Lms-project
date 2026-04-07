import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Academic Lessons',
  description: 'View all approved academic English lessons.',
};

async function fetchLessons(token: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  const res = await fetch(`${base}/api/v1/lessons`, {
    headers: { Cookie: `jwt=${token}` },
    next: { revalidate: 30 },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.data?.lessons ?? [];
}

import LessonCard from '@/components/lessons/LessonCard';

export default async function StudentLessonsPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const lessons = await fetchLessons(token);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight font-display">Classroom Library</h1>
        <p className="text-slate-400 mt-1 text-sm font-bold uppercase tracking-widest">Master Your English Curriculum</p>
      </div>

      {lessons.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-soft">
          <p className="text-4xl mb-4 opacity-20">📚</p>
          <p className="text-slate-600 font-black text-lg">Knowledge is on its way.</p>
          <p className="text-slate-400 text-sm mt-1">No community lessons are available at this moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {lessons.map((lesson: any) => (
            <LessonCard 
              key={lesson._id}
              lesson={{
                ...lesson,
                courseId: lesson.course?._id
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

