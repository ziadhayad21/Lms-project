import TeacherSidebar from '@/components/layout/TeacherSidebar';
import Navbar from '@/components/layout/Navbar';
import { redirect } from 'next/navigation';
import { getServerAuthUser } from '@/lib/server/auth';

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerAuthUser();
  if (!user) redirect('/login');
  if (user.role !== 'teacher') redirect('/student/dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
