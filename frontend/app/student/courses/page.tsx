import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title:       'Browse Courses',
  description: 'Explore all available English courses — grammar, speaking, writing, listening and more.',
};

async function fetchCourses(searchParams: Record<string, string>) {
  const base   = process.env.API_URL || 'http://localhost:5000';
  const params = new URLSearchParams(searchParams).toString();
  const res    = await fetch(`${base}/api/v1/courses?${params}`, { next: { revalidate: 120 } });
  if (!res.ok) return { courses: [], meta: null };
  const data = await res.json();
  return { courses: data.data?.courses ?? [], meta: data.meta ?? null };
}

const LEVELS      = ['beginner', 'intermediate', 'advanced'];
const CATEGORIES  = ['grammar', 'speaking', 'writing', 'reading', 'listening', 'vocabulary', 'general'];

const levelColors: Record<string, string> = {
  beginner: 'badge-green', intermediate: 'badge-amber', advanced: 'badge-red',
};

interface Props { searchParams: Record<string, string> }

export default async function StudentCoursesPage({ searchParams }: Props) {
  const { courses, meta } = await fetchCourses(searchParams);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Browse Courses</h1>
        <p className="text-slate-500 text-sm mt-1">{meta?.total ?? courses.length} course{courses.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <Link
          href="/student/courses"
          className={`badge cursor-pointer transition-colors ${!searchParams.level && !searchParams.category ? 'badge-blue' : 'badge-slate hover:bg-slate-200'}`}
        >
          All
        </Link>
        {LEVELS.map((l) => (
          <Link key={l} href={`/student/courses?level=${l}`}
            className={`badge cursor-pointer capitalize transition-colors ${searchParams.level === l ? 'badge-blue' : 'badge-slate hover:bg-slate-200'}`}>
            {l}
          </Link>
        ))}
        <div className="h-4 w-px bg-slate-200" />
        {CATEGORIES.map((c) => (
          <Link key={c} href={`/student/courses?category=${c}`}
            className={`badge cursor-pointer capitalize transition-colors ${searchParams.category === c ? 'badge-blue' : 'badge-slate hover:bg-slate-200'}`}>
            {c}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {courses.length === 0 ? (
        <div className="card p-14 text-center">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-slate-600 font-medium">No courses found for these filters.</p>
          <Link href="/student/courses" className="btn-secondary mt-4 inline-flex">Clear filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course: any) => (
            <Link
              key={course._id}
              href={`/student/courses/${course._id}`}
              className="card flex flex-col overflow-hidden hover:shadow-md hover:border-primary-200 transition-all group"
            >
              {/* Thumbnail */}
              <div className="h-36 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                {course.thumbnailUrl
                  ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )
                  : <span className="text-4xl opacity-50">📚</span>}
              </div>

              <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={levelColors[course.level] ?? 'badge-slate'}>{course.level}</span>
                  <span className="badge-slate capitalize">{course.category}</span>
                </div>
                <h3 className="font-display font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 flex-1">{course.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <span>👩‍🏫 {course.teacher?.name}</span>
                  <span>👥 {course.enrollmentCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
