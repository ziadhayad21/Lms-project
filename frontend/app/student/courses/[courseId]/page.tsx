import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EnrollButton from '@/components/course/EnrollButton';
import LessonCard from '@/components/lessons/LessonCard';

interface Props { params: { courseId: string } }

async function fetchCourse(courseId: string, token?: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  const headers: HeadersInit = token ? { Cookie: `jwt=${token}` } : {};
  const res = await fetch(`${base}/api/v1/courses/${courseId}`, {
    headers,
    next: { revalidate: 120 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.course ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await fetchCourse(params.courseId);
  if (!course) return { title: 'Course Not Found' };
  return {
    title:       course.title,
    description: course.description.slice(0, 160),
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const token  = cookies().get('jwt')?.value;
  const course = await fetchCourse(params.courseId, token);
  if (!course) notFound();

  const levelColors: Record<string, string> = {
    beginner:     'badge-green',
    intermediate: 'badge-amber',
    advanced:     'badge-red',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={levelColors[course.level] ?? 'badge-slate'}>
                  {course.level}
                </span>
                <span className="badge bg-white/20 text-white">{course.category}</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">{course.title}</h1>
              <p className="mt-3 text-primary-100 leading-relaxed text-sm">{course.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-primary-200">
                <span>👩‍🏫 {course.teacher?.name}</span>
                <span>👥 {course.enrollmentCount} students</span>
                <span>🎬 {course.lessons?.length ?? 0} lessons</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>📄 {course.materials?.length ?? 0} materials</span>
            <span>📝 {course.exams?.length ?? 0} exams</span>
          </div>
          <EnrollButton courseId={course._id} />
        </div>
      </div>

      {/* Lessons */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Program Curriculum</h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{course.lessons?.length || 0} Lessons</span>
        </div>

        {course.lessons?.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <p className="text-3xl mb-3">📭</p>
             <p className="text-slate-500 text-sm font-medium">Curriculum is being prepared by the instructor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.lessons?.map((lesson: any) => (
              <LessonCard 
                key={lesson._id}
                lesson={{
                  ...lesson,
                  courseId: course._id
                }} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Materials */}
      {course.materials?.length > 0 && (
        <section>
          <h2 className="section-title mb-4">Materials &amp; Downloads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.materials?.map((mat: any) => (
              <a
                key={mat._id}
                href={`/api/v1/courses/${course._id}/materials/${mat._id}/download`}
                className="card p-4 flex items-center gap-3 hover:border-primary-200 transition-colors group"
              >
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-lg">📄</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{mat.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">PDF · Click to download</p>
                </div>
                <span className="text-slate-300 group-hover:text-primary-400 transition-colors text-sm">↓</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Exams */}
      {course.exams?.length > 0 && (
        <section>
          <h2 className="section-title mb-4">Exams &amp; Quizzes</h2>
          <div className="space-y-3">
            {course.exams?.map((exam: any) => (
              <Link
                key={exam._id}
                href={`/student/courses/${course._id}/exams/${exam._id}`}
                className="card p-4 flex items-center gap-4 hover:border-primary-200 transition-colors group"
              >
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-lg">📝</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800 text-sm">{exam.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span>Passing: {exam.passingScore}%</span>
                    {exam.timeLimit && <span>⏱ {exam.timeLimit} min</span>}
                    <span>Max {exam.maxAttempts} attempt{exam.maxAttempts !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <span className="btn-primary text-xs px-3 py-1.5">Take Exam</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
