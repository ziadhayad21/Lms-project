'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
      {error && (
        <div className="bg-rose-50 border-2 border-rose-100 text-rose-700 text-sm font-black px-5 py-4 rounded-3xl animate-shake flex items-center gap-3">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
          Authorized Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-300 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className="input-field !pl-12 !bg-white focus:shadow-xl focus:shadow-brand-500/5"
            placeholder="name.pro@domain.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center pr-1">
          <label htmlFor="password" className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
            Secure Password
          </label>
          <a href="#" className="text-[10px] font-black text-brand-500 uppercase tracking-widest hover:underline decoration-brand-200 decoration-2">Forgot Key?</a>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-300 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            className="input-field !pl-12 !bg-white focus:shadow-xl focus:shadow-brand-500/5"
            placeholder="••••••••••••"
          />
        </div>
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
              Authenticating Credentials…
            </>
          ) : (
            <>
              Access My Account
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </span>
      </button>
    </form>
  );
}
