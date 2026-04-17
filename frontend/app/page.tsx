import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mr Abdallah Elhayad — English Mastery',
  description: 'Welcome to the official learning platform of Mr Abdallah Elhayad.',
};

export default function HomePage() {
  return (
    <main className="h-screen w-full flex flex-col items-center justify-center bg-white relative overflow-hidden px-6">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05)_0%,transparent_50%)] -z-10" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="w-full max-w-lg text-center space-y-12 animate-fade-in relative z-10">
        {/* Branding Section */}
        <div className="flex flex-col items-center gap-8">
          <div className="w-24 h-24 bg-brand-600 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center text-white text-4xl font-black rotate-3 hover:rotate-0 transition-transform duration-500">
            AE
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Mr Abdallah <br />
              <span className="text-brand-600">Elhayad</span>
            </h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] inline-block py-1 border-b-2 border-brand-100">
              Official Learning Platform
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-sm mx-auto">
          <Link 
            href="/login" 
            className="group py-5 px-8 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-3xl shadow-xl shadow-brand-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Sign In to Your Courses</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <Link 
            href="/register" 
            className="py-5 px-8 bg-white hover:bg-slate-50 text-slate-700 font-black rounded-3xl border border-slate-200 shadow-soft transition-all active:scale-95 text-center"
          >
            New Student? Register here
          </Link>
        </div>
      </div>

      {/* Simplified Bottom Bar */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="h-1 w-12 bg-slate-100 rounded-full" />
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">
          Mastery • Quality • Success
        </p>
      </div>
    </main>
  );
}
