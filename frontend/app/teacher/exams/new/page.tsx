import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ExamUploadForm from '@/components/exams/ExamUploadForm';
import { Trophy, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create New Exam',
  description: 'Add a new assessment to your course.',
};

export default async function TeacherNewExamPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
        <Link 
          href="/teacher/exams" 
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 border border-slate-100 shadow-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
               <Trophy className="w-4 h-4" />
             </div>
             <h1 className="text-3xl font-black text-slate-800 tracking-tight font-display">New Assessment</h1>
          </div>
          <p className="text-slate-500 mt-2 text-sm font-medium">Create a new exam to test your students&apos; knowledge.</p>
        </div>
      </div>

      <div className="card-glass p-8">
        <ExamUploadForm />
      </div>
    </div>
  );
}

