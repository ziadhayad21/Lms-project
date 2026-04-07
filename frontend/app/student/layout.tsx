import StudentSidebar from '@/components/layout/StudentSidebar';
import Navbar from '@/components/layout/Navbar';
import { redirect } from 'next/navigation';
import { getServerAuthUser } from '@/lib/server/auth';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerAuthUser();
  if (!user) redirect('/login');
  if (user.role !== 'student') redirect('/teacher/dashboard');
  const isPending = user.status === 'pending';


  return (
    <div className="min-h-screen bg-slate-50 flex">
      <StudentSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {isPending ? (
            <div className="card border-amber-200 bg-amber-50 p-8 text-amber-900">
              <h1 className="text-2xl font-bold mb-2">Account Pending Approval</h1>
              <p className="text-sm">
                Your student account is pending teacher approval. You will gain access to all lessons once your status becomes active.
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
