import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';

interface Props { params: { courseId: string; examId: string } }

export const metadata: Metadata = { title: 'Exam Results' };

async function fetchResults(courseId: string, token: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  const res  = await fetch(`${base}/api/v1/results/course/${courseId}`, {
    headers: { Cookie: `jwt=${token}` },
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data?.results ?? [];
}

export default async function ExamResultsPage({ params }: Props) {
  const token   = cookies().get('jwt')?.value ?? '';
  const allResults = await fetchResults(params.courseId, token);
  // Filter to just this exam
  const results = allResults.filter((r: any) => r.exam?._id === params.examId || r.exam === params.examId);

  const avgScore = results.length
    ? Math.round(results.reduce((a: number, r: any) => a + r.score, 0) / results.length)
    : 0;
  const passRate = results.length
    ? Math.round((results.filter((r: any) => r.passed).length / results.length) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link href={`/teacher/courses/${params.courseId}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Course
        </Link>
        <h1 className="page-title mt-2">Exam Results</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-slate-800">{results.length}</p>
          <p className="text-sm text-slate-500 mt-1">Submissions</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-primary-600">{avgScore}%</p>
          <p className="text-sm text-slate-500 mt-1">Average Score</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{passRate}%</p>
          <p className="text-sm text-slate-500 mt-1">Pass Rate</p>
        </div>
      </div>

      {/* Results Table */}
      {results.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-slate-500">No submissions yet for this exam.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Student</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Score</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Attempt</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r: any) => (
                <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">{r.student?.name}</p>
                    <p className="text-xs text-slate-400">{r.student?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-bold text-base ${r.score >= 80 ? 'text-green-600' : r.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {r.score}%
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">{r.correctAnswers}/{r.totalQuestions} correct</p>
                  </td>
                  <td className="px-5 py-4">
                    {r.passed
                      ? <span className="badge-green">Passed</span>
                      : <span className="badge-red">Failed</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-600">#{r.attemptNumber}</td>
                  <td className="px-5 py-4 text-slate-400">
                    {new Date(r.completedAt).toLocaleDateString()}
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
