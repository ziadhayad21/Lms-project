import type { Metadata } from 'next';
import RegisterForm from './RegisterForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apply For Access — EnglishPro Premium LMS',
  description: 'Begin your journey towards English mastery on the world\'s most professional platform.',
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-12 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-mesh opacity-20 pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] -right-20 w-[400px] h-[400px] bg-brand-200/30 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-[30%] -left-20 w-[600px] h-[600px] bg-accent-100/40 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />

      <div className="w-full max-w-lg lg:max-w-xl animate-fade-in py-12">
        <div className="text-center mb-10 space-y-4">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 bg-gradient-to-tr from-brand-700 to-accent-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-brand-500/30 ring-4 ring-white/60 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-2xl tracking-tighter">EP</span>
            </div>
            <div className="space-y-1">
              <span className="font-display font-black text-slate-950 text-2xl tracking-tighter uppercase block">Create Your Profile</span>
              <span className="text-xs font-black text-brand-600 uppercase tracking-[0.2em]">Join the Elite Community</span>
            </div>
          </Link>
        </div>

        <div className="relative glass p-10 rounded-[40px] border-white/60 shadow-2xl shadow-brand-900/5 animate-scale-in">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-500/10 rounded-full blur-[40px] pointer-events-none animate-pulse-glow" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent-500/10 rounded-full blur-[40px] pointer-events-none animate-pulse-glow" />

          <div className="mb-8 text-center sm:text-left">
            <h1 className="font-display text-3xl font-black text-slate-900 leading-none">Apply for Access</h1>
            <p className="mt-3 text-slate-500 font-bold text-sm tracking-tight">Complete your profile to unlock the full curriculum.</p>
          </div>

          <RegisterForm />
        </div>

        <div className="text-center mt-10 space-y-2">
          <p className="text-sm text-slate-400 font-black uppercase tracking-widest leading-none">
            Already have an account?
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 text-brand-600 font-black hover:text-brand-700 transition-colors group">
            Sign In to Dashboard
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
