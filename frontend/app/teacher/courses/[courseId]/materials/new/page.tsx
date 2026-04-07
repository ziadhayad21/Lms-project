import type { Metadata } from 'next';
import MaterialUploadForm from '@/components/course/MaterialUploadForm';
import Link from 'next/link';

interface Props { params: { courseId: string } }

export const metadata: Metadata = { title: 'Upload Material' };

export default function NewMaterialPage({ params }: Props) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href={`/teacher/courses/${params.courseId}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Course
        </Link>
        <h1 className="page-title mt-2">Upload PDF Material</h1>
        <p className="text-slate-500 text-sm mt-1">Upload worksheets, grammar guides, or any PDF resource.</p>
      </div>
      <div className="card p-8">
        <MaterialUploadForm courseId={params.courseId} />
      </div>
    </div>
  );
}
