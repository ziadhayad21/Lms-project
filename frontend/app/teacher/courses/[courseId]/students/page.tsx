import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';

interface Props { params: { courseId: string } }

export const metadata: Metadata = { title: 'Enrolled Students' };

async function fetchStudents(courseId: string, token: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  const res  = await fetch(`${base}/api/v1/courses/${courseId}/students`, {
    headers: { Cookie: `jwt=${token}` },
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data?.students ?? [];
}

export default async function StudentsPage({ params }: Props) {
  const token    = cookies().get('jwt')?.value ?? '';
  const students = await fetchStudents(params.courseId, token);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link href={`/teacher/courses/${params.courseId}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Course
        </Link>
        <h1 className="page-title mt-2">Enrolled Students</h1>
        <p className="text-slate-500 text-sm mt-1">{students.length} student{students.length !== 1 ? 's' : ''} enrolled</p>
      </div>

      {students.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-3xl mb-3">👥</p>
          <p className="text-slate-600 font-medium">No students enrolled yet.</p>
          <p className="text-slate-400 text-sm mt-1">Share your course to attract students.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Student</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Progress</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s: any) => (
                <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">{s.student?.name}</p>
                    <p className="text-xs text-slate-400">{s.student?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${s.completionPercentage ?? 0}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{s.completionPercentage ?? 0}%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{s.completedLessons?.length ?? 0} lessons done</p>
                  </td>
                  <td className="px-5 py-4">
                    {s.isCompleted
                      ? <span className="badge-green">Completed</span>
                      : <span className="badge-blue">In Progress</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs">
                    {s.lastAccessed ? new Date(s.lastAccessed).toLocaleDateString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
