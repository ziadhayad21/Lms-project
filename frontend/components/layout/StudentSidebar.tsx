'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import clsx from 'clsx';
import { LayoutDashboard, Video, LogOut, ChevronRight, GraduationCap, BookOpen, PlusCircle, Trophy } from 'lucide-react';

const navItems = [
  { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/student/lessons', icon: Video, label: 'Lessons' },
  { href: '/student/exams', icon: Trophy, label: 'Exams' },
];


export default function StudentSidebar() {
  const pathname      = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-72 shrink-0 hidden md:flex flex-col bg-white border-r border-slate-100 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Academy Logo */}
      <div className="h-24 flex items-center gap-4 px-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 -rotate-3 hover:rotate-0 transition-transform">
          <GraduationCap className="text-white w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-slate-800 tracking-tight leading-none text-lg">EnglishPro</span>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">Academy</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
          Learning Path
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'group flex items-center gap-4 px-4 py-4 rounded-3xl text-sm font-bold transition-all duration-300',
                active
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-2'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
              )}
            >
              <Icon className={clsx('w-5 h-5 shrink-0 transition-transform group-hover:scale-110', active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600')} />
              <span>{item.label}</span>
              {active && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User Area */}
      <div className="p-6">
        <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
               <span className="text-indigo-600 font-black text-lg">
                 {user?.name?.charAt(0).toUpperCase()}
               </span>
            </div>
            <div className="min-w-0">
               <p className="text-sm font-black text-slate-800 truncate">{user?.name}</p>
               {user?.level ? (
                 <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-md border border-indigo-100">
                   {user.level}
                 </span>
               ) : (
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scholar</p>
               )}
            </div>
          </div>
          
          <button
             onClick={logout}
             className="w-full py-3 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 flex items-center justify-center gap-2"
          >
            <LogOut className="w-3 h-3" /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
