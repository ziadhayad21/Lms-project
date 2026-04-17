'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LogOut, LayoutDashboard, GraduationCap, Menu, X, LayoutGrid } from 'lucide-react';
import { TEACHER_NAV_ITEMS, STUDENT_NAV_ITEMS } from '@/lib/constants/navigation';
import clsx from 'clsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);

  const navItems = user?.role === 'teacher' || user?.role === 'admin' ? TEACHER_NAV_ITEMS : STUDENT_NAV_ITEMS;

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand / Context */}
          <div className="flex items-center gap-3 md:gap-4 group cursor-default">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
              <GraduationCap className="text-indigo-600 w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none">Mr Abdallah Elhayad</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">LMS Platform</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Quick Sections Toggle */}
          <div className="relative">
            <button
              onClick={() => setSectionsOpen(!sectionsOpen)}
              className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                sectionsOpen ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            {sectionsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSectionsOpen(false)} />
                <div className="absolute right-0 top-full mt-3 w-[280px] sm:w-[320px] bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl z-20 p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Quick Navigation</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSectionsOpen(false)}
                          className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-slate-50 hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all text-center group"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-black text-slate-600 group-hover:text-indigo-700 uppercase tracking-tighter">
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen((p) => !p)}
              className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2 pr-2 md:pr-4 py-1.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
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
                      href={user?.role === 'teacher' || user?.role === 'admin' ? '/teacher/dashboard' : '/student/dashboard'}
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

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setMobileOpen(false)} />
          <nav className="absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col p-6">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <span className="font-black text-slate-800">Mr Abdallah Elhayad</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-3xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={() => { setMobileOpen(false); logout(); }}
                className="w-full py-4 text-rose-600 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 bg-rose-50 rounded-2xl"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
