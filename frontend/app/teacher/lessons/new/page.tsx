import type { Metadata } from 'next';
import Link from 'next/link';
import LessonUploadForm from '@/components/course/LessonUploadForm';

export const metadata: Metadata = {
  title: 'Add Academic Lesson',
  description: 'Add a new grammar, reading, or exam preparation lesson.',
};

export default function NewAcademicLessonPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href="/teacher/dashboard" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Dashboard
        </Link>
        <h1 className="page-title mt-2">Add Academic Lesson</h1>
        <p className="text-slate-500 text-sm mt-1">
          Build structured lesson content for grammar, reading, and exam readiness.
        </p>
      </div>
      <div className="card p-8">
        <LessonUploadForm />
      </div>
    </div>
  );
}
