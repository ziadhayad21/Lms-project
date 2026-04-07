import type { Metadata } from 'next';
import CourseForm from '@/components/course/CourseForm';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Create New Course' };

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href="/teacher/courses" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Courses
        </Link>
        <h1 className="page-title mt-2">Create New Course</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details below to create your course.</p>
      </div>
      <div className="card p-8">
        <CourseForm mode="create" />
      </div>
    </div>
  );
}
