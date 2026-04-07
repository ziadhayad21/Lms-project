import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = { title: 'My Courses' };

async function fetchMyCourses(token: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  // Teacher fetches all their courses (including drafts) — no isPublished filter
  const res = await fetch(`${base}/api/v1/courses?limit=100`, {
    headers: { Cookie: `jwt=${token}` },
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data?.courses ?? [];
}

const levelColors: Record<string, string> = {
  beginner: 'badge-green', intermediate: 'badge-amber', advanced: 'badge-red',
};

export default async function TeacherCoursesPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');
  const courses = await fetchMyCourses(token);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">My Courses</h1>
          <p className="text-slate-500 text-sm mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/teacher/courses/new" className="btn-primary">+ New Course</Link>
      </div>

      {courses.length === 0 ? (
        <div className="card p-14 text-center">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-slate-700 font-semibold mb-2">No courses yet</p>
          <p className="text-slate-400 text-sm mb-6">Create your first course to get started.</p>
          <Link href="/teacher/courses/new" className="btn-primary inline-flex">Create Course</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course: any) => (
            <div key={course._id} className="card p-5 flex flex-col gap-4 hover:border-primary-200 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={levelColors[course.level] ?? 'badge-slate'}>{course.level}</span>
                    {course.isPublished
                      ? <span className="badge-green">Published</span>
                      : <span className="badge-amber">Draft</span>}
                  </div>
                  <h3 className="font-display font-semibold text-slate-800 text-sm leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 flex-1">{course.description}</p>
              <div className="text-xs text-slate-400 flex items-center gap-3">
                <span>👥 {course.enrollmentCount} students</span>
                <span>📅 {new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link href={`/teacher/courses/${course._id}`} className="btn-primary text-xs flex-1 text-center">
                  Manage
                </Link>
                <Link href={`/teacher/courses/${course._id}/edit`} className="btn-secondary text-xs px-3">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
