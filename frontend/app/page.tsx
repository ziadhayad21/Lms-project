import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'EnglishPro — Master English with Expert Guidance',
  description: 'Join the world\'s most professional English learning platform. Video lessons, interactive quizzes, and certified tracking.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-mesh opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-[10%] -right-20 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-[40%] -left-20 w-[400px] h-[400px] bg-accent-100/30 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-glow" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass px-6 py-3 rounded-[24px] flex items-center justify-between border-white/40 shadow-xl shadow-brand-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 ring-1 ring-white/20">
                <span className="text-white font-black text-lg tracking-tighter">EP</span>
              </div>
              <span className="font-display font-black text-slate-900 text-xl tracking-tight hidden sm:block">EnglishPro</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-brand-600 px-4 py-2 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary !py-2.5 !px-5 text-sm">
                Get Started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 rounded-full">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-xs font-bold text-brand-700 tracking-wider uppercase">Next Generation Learning v2.0</span>
            </div>

            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Speak English <br />
              <span className="text-gradient">with Authority.</span>
            </h1>

            <p className="text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Transform your fluency with our high-impact curriculum. From expert video lessons to interactive adaptive quizzes, we provide the tools you need for absolute mastery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/register" className="btn-primary group !py-4 !px-10 text-lg shadow-2xl shadow-brand-500/40">
                Join Now — Free
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link href="/login" className="btn-secondary !py-4 !px-10 text-lg group bg-white/50 backdrop-blur-sm">
                View Courses
                <svg className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 grayscale opacity-40">
              <span className="font-black text-2xl tracking-tighter italic">TEDx</span>
              <span className="font-black text-2xl tracking-tighter italic">Harvard</span>
              <span className="font-black text-2xl tracking-tighter italic">MIT</span>
            </div>
          </div>

          <div className="flex-1 relative w-full lg:w-auto animate-float">
            <div className="relative aspect-[4/3] w-full max-w-[600px] mx-auto">
              {/* Glowing ring behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-rose-400 rounded-[2rem] blur-3xl opacity-20 -rotate-6 scale-110" />

              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_32px_120px_-20px_rgba(76,29,149,0.4)]">
                <Image
                  src="/hero.png"
                  alt="LMS Hero Illustration"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating micro-cards */}
              <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl border-white animate-slide-down shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">✓</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Success Rate</p>
                    <p className="text-lg font-black text-slate-900 leading-none">98.4%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -left-10 glass p-5 rounded-3xl border-white shadow-2xl animate-scale-in">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="badge-brand font-black">CERTIFIED</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Accredited</span>
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-100`} />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-500 flex items-center justify-center text-[10px] font-bold text-white">+2k</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Divider */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-950 rounded-[40px] p-12 relative overflow-hidden shadow-2xl">
            {/* Abstract grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                { label: 'Courses', val: '45+' },
                { label: 'Students', val: '12K+' },
                { label: 'Global Mentors', val: '24' },
                { label: 'Video Hours', val: '800+' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{s.val}</p>
                  <p className="text-xs font-black text-brand-400 uppercase tracking-[0.2em]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="font-display text-brand-600 font-black uppercase tracking-[0.3em] text-xs underline decoration-brand-200 decoration-4 underline-offset-8">The Platform</h2>
            <h3 className="font-display text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Everything built for <span className="text-gradient">Professional Results.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
                title: 'Cinema Quality Video',
                desc: 'Watch high-definition lessons that make complex grammar feels like watching a blockbuster movie.',
                color: 'bg-brand-500'
              },
              {
                icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                title: 'High-Impact Materials',
                desc: 'Download professionally crafted PDFs, cheat sheets, and workbooks to reinforce your learning journey.',
                color: 'bg-emerald-500'
              },
              {
                icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
                title: 'Adaptive Exam Lab',
                desc: 'Experience dynamic quizzes that adjust difficulty based on your performance, ensuring real mastery.',
                color: 'bg-orange-500'
              },
            ].map((f, i) => (
              <div key={i} className="card-premium group p-8 flex flex-col gap-6 relative overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center text-white shadow-lg`}>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {f.icon}
                  </svg>
                </div>
                <div className="space-y-3">
                  <h4 className="font-display text-xl font-black text-slate-900 tracking-tight">{f.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
                </div>
                {/* Subtle hover pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full -translate-y-12 translate-x-12" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto bg-brand-600 rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(76,29,149,0.5)]">
          <div className="absolute top-0 left-0 w-full h-full bg-mesh-indigo mix-blend-overlay opacity-60" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-500 rounded-full blur-[80px] opacity-40 animate-pulse-glow" />

          <div className="relative z-10 space-y-10">
            <h2 className="font-display text-4xl md:text-6xl font-black text-white leading-none">
              Enough waiting. <br />
              <span className="text-brand-200">Start winning.</span>
            </h2>
            <p className="text-brand-100 text-lg max-w-lg mx-auto opacity-80 font-medium">
              Join the elite group of students who elevated their professional careers through English mastery on our platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-secondary !bg-white !text-brand-700 !py-4 !px-12 text-lg shadow-xl">
                Create My Profile
              </Link>
              <Link href="/login" className="text-white font-bold hover:underline underline-offset-8 transition-all">
                I have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">EP</span>
                </div>
                <span className="font-display font-black text-slate-900 text-2xl tracking-tighter">EnglishPro</span>
              </div>
              <p className="text-slate-400 max-w-xs font-medium">The definitive Learning Management System for modern language acquisition.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-900 tracking-widest uppercase">Platform</p>
                <ul className="space-y-2 text-sm text-slate-500 font-bold">
                  <li className="hover:text-brand-600 cursor-pointer">Curriculum</li>
                  <li className="hover:text-brand-600 cursor-pointer">Pricing</li>
                  <li className="hover:text-brand-600 cursor-pointer">Instructors</li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-900 tracking-widest uppercase">Legal</p>
                <ul className="space-y-2 text-sm text-slate-500 font-bold">
                  <li className="hover:text-brand-600 cursor-pointer">Privacy</li>
                  <li className="hover:text-brand-600 cursor-pointer">Terms</li>
                  <li className="hover:text-brand-600 cursor-pointer">Ethics</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-50">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">© {new Date().getFullYear()} EnglishPro International Group</p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
