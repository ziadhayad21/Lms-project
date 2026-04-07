import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LessonEditClient from './LessonEditClient';

export const metadata: Metadata = {
  title: 'Edit Lesson',
  description: 'Edit an existing lesson.',
};

async function fetchLessonData(courseId: string, lessonId: string, token: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  const res = await fetch(`${base}/api/v1/courses/${courseId}/lessons/${lessonId}`, {
    headers: { Cookie: `jwt=${token}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.lesson || null;
}

export default async function EditLessonPage({
  params,
  searchParams,
}: {
  params: { lessonId: string };
  searchParams: { courseId?: string };
}) {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const { lessonId } = params;
  const { courseId } = searchParams;

  if (!courseId) {
    // If courseId is missing, redirect to lessons list
    redirect('/teacher/lessons');
  }

  const lesson = await fetchLessonData(courseId, lessonId, token);
  
  if (!lesson) {
    redirect('/teacher/lessons');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href="/teacher/lessons" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to All Lessons
        </Link>
        <h1 className="page-title mt-2">Edit Lesson</h1>
        <p className="text-slate-500 text-sm mt-1">
          Update the details of your lesson.
        </p>
      </div>
      <div className="card p-8">
        <LessonEditClient initialData={lesson} courseId={courseId} />
      </div>
    </div>
  );
}
