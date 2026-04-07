import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ExamTaker from '@/components/exams/ExamTaker';

async function fetchExam(examId: string, token: string) {
  const base = process.env.API_URL || 'http://localhost:5000';
  const res = await fetch(`${base}/api/v1/exams/${examId}`, {
    headers: { Cookie: `jwt=${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 403 || res.status === 404) {
      redirect('/student/exams');
    }
    return null;
  }
  const data = await res.json();
  return data.data?.exam || null;
}

export default async function StudentExamTakePage({
  params,
}: {
  params: { examId: string };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get('jwt')?.value;
  if (!token) redirect('/login');

  const exam = await fetchExam(params.examId, token);

  if (!exam) {
    return (
      <div className="flex items-center justify-center h-full">
         <p className="text-slate-500 font-bold">Exam not found or you are not authorized.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <ExamTaker courseId={exam.course || ''} exam={exam} />
    </div>
  );
}
