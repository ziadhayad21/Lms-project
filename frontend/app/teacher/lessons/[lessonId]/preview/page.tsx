import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LessonPreviewPlayer from './LessonPreviewPlayer';

export const metadata: Metadata = {
  title: 'Preview Lesson',
  description: 'Preview the video and content of your lesson.',
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

export default async function LessonPreviewPage({
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
    redirect('/teacher/lessons');
  }

  const lesson = await fetchLessonData(courseId, lessonId, token);
  
  if (!lesson) {
    redirect('/teacher/lessons');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/teacher/lessons" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Back to All Lessons
          </Link>
          <h1 className="page-title mt-2">Lesson Preview: {lesson.title}</h1>
        </div>
        <Link 
          href={`/teacher/lessons/${lessonId}/edit?courseId=${courseId}`}
          className="btn-secondary text-sm"
        >
          Edit Lesson
        </Link>
      </div>

      <LessonPreviewPlayer lesson={lesson} />
    </div>
  );
}
