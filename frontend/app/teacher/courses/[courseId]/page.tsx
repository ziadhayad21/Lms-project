import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props { params: { courseId: string } }

async function fetchCourse(courseId: string, token: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  const res  = await fetch(`${base}/api/v1/courses/${courseId}`, {
    headers: { Cookie: `jwt=${token}` },
    next: { revalidate: 30 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.course ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const token  = cookies().get('jwt')?.value ?? '';
  const course = await fetchCourse(params.courseId, token);
  return { title: course ? `Manage: ${course.title}` : 'Manage Course' };
}

export default async function TeacherCourseDetailPage({ params }: Props) {
  const token  = cookies().get('jwt')?.value ?? '';
  const course = await fetchCourse(params.courseId, token);
  if (!course) notFound();

  const sections = [
    { label: 'Lessons',   count: course.lessons?.length   ?? 0, icon: '🎬', href: `/teacher/courses/${course._id}/lessons/new`,   action: 'Add Lesson'   },
    { label: 'Materials', count: course.materials?.length ?? 0, icon: '📄', href: `/teacher/courses/${course._id}/materials/new`, action: 'Upload PDF'   },
    { label: 'Exams',     count: course.exams?.length     ?? 0, icon: '📝', href: `/teacher/courses/${course._id}/exams/new`,     action: 'Create Exam'  },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/teacher/courses" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Back to Courses
          </Link>
          <h1 className="page-title mt-2">{course.title}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className={course.isPublished ? 'badge-green' : 'badge-amber'}>
              {course.isPublished ? 'Published' : 'Draft'}
            </span>
            <span className="badge-slate capitalize">{course.level}</span>
            <span className="badge-slate capitalize">{course.category}</span>
            <span className="text-sm text-slate-400">👥 {course.enrollmentCount} students</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/teacher/courses/${course._id}/edit`}     className="btn-secondary text-sm">Edit Course</Link>
          <Link href={`/teacher/courses/${course._id}/students`} className="btn-secondary text-sm">View Students</Link>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sections.map((s) => (
          <div key={s.label} className="card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800">{s.label}</p>
                  <p className="text-sm text-slate-400">{s.count} item{s.count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
            <Link href={s.href} className="btn-primary text-sm text-center">{s.action}</Link>
          </div>
        ))}
      </div>

      {/* Lessons List */}
      {course.lessons?.length > 0 && (
        <section>
          <h2 className="section-title mb-4">Lessons</h2>
          <div className="space-y-2">
            {course.lessons?.map((lesson: any, i: number) => (
              <div key={lesson._id} className="card p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {lesson.isPublished ? <span className="badge-green text-xs">Published</span> : <span className="badge-amber text-xs">Draft</span>}
                    {lesson.isPreview && <span className="badge-blue text-xs">Preview</span>}
                  </div>
                </div>
                <Link href={`/teacher/courses/${course._id}/lessons/${lesson._id}/edit`} className="btn-secondary text-xs px-3 py-1.5">Edit</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Exams List */}
      {course.exams?.length > 0 && (
        <section>
          <h2 className="section-title mb-4">Exams</h2>
          <div className="space-y-2">
            {course.exams?.map((exam: any) => (
              <div key={exam._id} className="card p-4 flex items-center gap-4">
                <span className="text-xl">📝</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm">{exam.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Passing: {exam.passingScore}%{exam.timeLimit ? ` · ${exam.timeLimit} min` : ''}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/teacher/courses/${course._id}/exams/${exam._id}/results`} className="btn-secondary text-xs px-3 py-1.5">Results</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
