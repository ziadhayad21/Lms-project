import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Progress',
  description: 'Track your learning progress across all enrolled English courses.',
};

async function fetchProgress(token: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  const [progRes, resRes] = await Promise.all([
    fetch(`${base}/api/v1/progress/overview`, { headers: { Cookie: `jwt=${token}` }, next: { revalidate: 60 } }),
    fetch(`${base}/api/v1/results/my`,         { headers: { Cookie: `jwt=${token}` }, next: { revalidate: 60 } }),
  ]);
  const [p, r] = await Promise.all([progRes.json(), resRes.json()]);
  return { progresses: p.data?.progresses ?? [], results: r.data?.results ?? [] };
}

export default async function ProgressPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const { progresses, results } = await fetchProgress(token);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">My Progress</h1>
        <p className="text-slate-500 text-sm mt-1">Track your learning journey across all courses</p>
      </div>

      {/* Course Progress */}
      <section>
        <h2 className="section-title mb-4">Course Completion</h2>
        {progresses.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-3xl mb-3">📊</p>
            <p className="text-slate-600 font-medium">No enrolled courses yet.</p>
            <Link href="/student/courses" className="btn-primary mt-4 inline-flex">Browse Courses</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {progresses.map((p: any) => {
              const pct = p.completionPercentage ?? 0;
              return (
                <div key={p._id} className="card p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">{p.course?.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 capitalize">
                        {p.course?.level} · {p.course?.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.isCompleted
                        ? <span className="badge-green">Completed 🎉</span>
                        : <span className="badge-blue">In Progress</span>}
                      <Link href={`/student/courses/${p.course?._id}`} className="btn-secondary text-xs px-3 py-1.5">
                        Continue →
                      </Link>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100
                            ? 'linear-gradient(90deg, #10b981, #059669)'
                            : 'linear-gradient(90deg, #4f46e5, #818cf8)',
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 w-10 text-right shrink-0">{pct}%</span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-6 mt-3 text-xs text-slate-400">
                    <span>✅ {p.completedLessons?.length ?? 0} lessons completed</span>
                    <span>📥 {p.downloadedMaterials?.length ?? 0} materials downloaded</span>
                    {p.lastAccessed && (
                      <span>🕐 Last active {new Date(p.lastAccessed).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Exam History */}
      <section>
        <h2 className="section-title mb-4">Exam History</h2>
        {results.length === 0 ? (
          <div className="card p-8 text-center text-slate-400 text-sm">
            No exam results yet. Take a quiz to see your scores here.
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Exam</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Course</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Score</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r: any) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800">{r.exam?.title ?? 'Exam'}</td>
                    <td className="px-5 py-4 text-slate-500">{r.course?.title ?? '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`font-bold ${r.score >= 80 ? 'text-green-600' : r.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {r.score}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {r.passed ? <span className="badge-green">Passed</span> : <span className="badge-red">Failed</span>}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {new Date(r.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
