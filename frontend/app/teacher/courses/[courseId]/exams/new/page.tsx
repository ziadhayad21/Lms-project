import type { Metadata } from 'next';
import ExamBuilder from '@/components/exam/ExamBuilder';
import Link from 'next/link';

interface Props { params: { courseId: string } }

export const metadata: Metadata = { title: 'Create Exam' };

export default function NewExamPage({ params }: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href={`/teacher/courses/${params.courseId}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Course
        </Link>
        <h1 className="page-title mt-2">Create Exam</h1>
        <p className="text-slate-500 text-sm mt-1">Build a multiple-choice exam with optional timer and auto-grading.</p>
      </div>
      <ExamBuilder courseId={params.courseId} />
    </div>
  );
}
