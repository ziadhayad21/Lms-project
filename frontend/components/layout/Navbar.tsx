'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LogOut, LayoutDashboard, GraduationCap, Bell } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen]  = useState(false);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-sm">
      {/* Brand / Context */}
      <div className="flex items-center gap-4 group cursor-default">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
          <GraduationCap className="text-indigo-600 w-5 h-5" />
        </div>
        <div className="hidden sm:block">
           <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none">EnglishPro</h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">LMS Platform</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="relative w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors group">
           <Bell className="w-5 h-5" />
           <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white ring-2 ring-indigo-500/20 animate-pulse" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20 group-hover:rotate-6 transition-transform">
              <span className="text-white font-black text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-black text-slate-800 leading-none">{user?.name}</p>
              <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">
                {user?.role === 'student' ? 'Scholar' : 'Faculty'}
                {user?.role === 'student' && user?.status === 'active' && ' • Verified'}
              </p>
            </div>
            <ChevronDown className={clsx('w-4 h-4 text-slate-300 transition-transform duration-300', open && 'rotate-180')} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-3xl border border-slate-100 shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-sm font-black text-slate-800 truncate">{user?.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 truncate mt-1">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    href={user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                    className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                    Administrative Panel
                  </Link>
                  <button
                    onClick={() => { setOpen(false); logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Terminate Session
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
import clsx from 'clsx';

