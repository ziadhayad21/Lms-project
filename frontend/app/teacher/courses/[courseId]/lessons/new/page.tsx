import type { Metadata } from 'next';
import LessonUploadForm from '@/components/course/LessonUploadForm';
import Link from 'next/link';

interface Props { params: { courseId: string } }

export const metadata: Metadata = { title: 'Add Lesson' };

export default function NewLessonPage({ params }: Props) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href={`/teacher/courses/${params.courseId}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Course
        </Link>
        <h1 className="page-title mt-2">Add Video Lesson</h1>
        <p className="text-slate-500 text-sm mt-1">Upload a video or paste an external URL (YouTube, Vimeo).</p>
      </div>
      <div className="card p-8">
        <LessonUploadForm courseId={params.courseId} />
      </div>
    </div>
  );
}
