'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { authApi } from '@/lib/api/auth.api';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', password: '', level: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.level) {
      setError('يرجى اختيار السنة الدراسية');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authApi.register(form);
      // Auto-login after registration
      await login(form.email, form.password);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const levels = [
    'أولى إعدادي',
    'تانية إعدادي',
    'تالتة إعدادي',
    'أولى ثانوي',
    'تانية ثانوي',
    'تالتة ثانوي',
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
      {error && (
        <div className="bg-rose-50 border-2 border-rose-100 text-rose-700 text-sm font-black px-5 py-4 rounded-3xl animate-shake flex items-center gap-3 text-right dir-rtl" dir="rtl">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
            Display Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="input-field !bg-white focus:shadow-xl focus:shadow-brand-500/5 transition-all"
            placeholder="Jane Smith"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="level" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
            السنة الدراسية (Academic Level)
          </label>
          <select
            id="level"
            name="level"
            required
            value={form.level}
            onChange={handleChange}
            className="input-field !bg-white focus:shadow-xl focus:shadow-brand-500/5 transition-all appearance-none text-right font-bold text-slate-700"
            style={{ direction: 'rtl' }}
          >
            <option value="" disabled>اختر مستواك الدراسي</option>
            {levels.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>


      <div className="space-y-2">
        <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
          Secure Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="input-field !bg-white focus:shadow-xl focus:shadow-brand-500/5"
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
          Master Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
          className="input-field !bg-white focus:shadow-xl focus:shadow-brand-500/5"
          placeholder="••••••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full !py-4 text-base shadow-2xl shadow-brand-500/40 mt-4 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
            <>
              <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              Initializing Profile…
            </>
          ) : (
            <>
              Unlock Premium Access
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </span>
      </button>

      <p className="text-[10px] text-slate-400 text-center font-black uppercase tracking-widest">
        By initializing access you agree to our <span className="text-brand-500 border-b border-brand-200">Protocol</span> and <span className="text-brand-500 border-b border-brand-200">Privacy</span>.
      </p>
    </form>
  );
}
