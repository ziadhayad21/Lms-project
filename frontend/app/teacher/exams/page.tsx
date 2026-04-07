import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Clock, Users, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import type { Exam } from '@/types';

export const metadata: Metadata = {
  title: 'Manage Exams',
  description: 'Manage all your created exams.',
};

async function fetchExams(token: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  const res = await fetch(`${base}/api/v1/exams`, {
    headers: { Cookie: `jwt=${token}` },
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.data?.exams || [];
}

export default async function TeacherExamsPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const exams = await fetchExams(token);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Manage Exams</h1>
          <p className="text-slate-500 mt-1 text-sm">View and manage all assessments across your courses</p>
        </div>
        <Link href="/teacher/exams/new" className="btn-primary">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Exam
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
        {exams.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">No Exams Found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              You haven&apos;t created any assessments yet. Get started by creating your first exam.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Exam Title</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Course</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {exams.map((exam: any) => (
                  <tr key={exam._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{exam.title}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">{exam.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                        {exam.course?.title || 'Unknown Course'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 space-y-1">
                       <div className="flex items-center gap-2"><Clock className="w-3 h-3"/> {exam.timeLimit || 'No limit'} mins</div>
                       <div className="flex items-center gap-2"><Trophy className="w-3 h-3"/> Pass {exam.passingScore}%</div>
                       <div className="flex items-center gap-2"><AlertCircle className="w-3 h-3"/> Max {exam.maxAttempts === -1 ? 'Unlimited' : exam.maxAttempts} Tries</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {exam.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                          <span className="w-2 h-2 rounded-full bg-slate-400" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                       {/* Add edit/delete buttons later if needed, for MVP they can just see them */}
                       <span className="text-xs font-bold text-slate-400">View Details</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
