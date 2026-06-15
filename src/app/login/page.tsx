'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { login } from '@/app/actions/authActions';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const fd = new FormData();
      fd.append('password', password);
      const res = await login(fd);
      if (res.success) {
        router.push('/my-memories');
        router.refresh();
      } else {
        setError(res.error ?? 'خطأ في كلمة المرور');
        setPassword('');
      }
    });
  };

  return (
    <main
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--bg-fade-50)] backdrop-blur-md transition-colors duration-700"
      style={{ direction: 'rtl' }}
    >
      {/* Subtle glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[var(--accent)] opacity-10 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-md p-10 flex flex-col items-center relative overflow-hidden"
      >
        {/* Shimmer top border */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
        
        {/* Heading */}
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-10 h-10 mb-4 rounded-full border border-[var(--border)] flex items-center justify-center bg-[var(--accent-soft)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[var(--accent)]">
              <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V11C20 9.89543 19.1046 9 18 9H6C4.89543 9 4 9.89543 4 11V19C4 20.1046 4.89543 21 6 21ZM16 9V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V9H16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-amiri text-2xl mb-2 text-[var(--fg)]">بوابة الدخول</h1>
          <p
            className="font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'var(--fg-faint)' }}
          >
            سجل الذكريات الخاص
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
          <div className="relative">
            <label
              htmlFor="login-pwd"
              className="block font-mono text-[9px] tracking-widest uppercase mb-3 text-center"
              style={{ color: 'var(--fg-muted)' }}
            >
              رمز الدخول
            </label>
            <input
              id="login-pwd"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="············"
              className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border)] rounded-lg px-4 py-3 text-center font-mono tracking-widest text-[var(--fg)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all duration-300"
              style={{ letterSpacing: '0.3em' }}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[10px] tracking-wide text-center"
              style={{ color: '#e07070' }}
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full relative overflow-hidden group font-mono text-[11px] tracking-widest uppercase border border-[var(--accent)] rounded-lg px-5 py-3 transition-all duration-300 hover:bg-[var(--accent-soft)] hover:shadow-[0_0_20px_var(--accent-soft)] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none"
            style={{ color: 'var(--accent)' }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <span className="write-spinner" style={{ width: '12px', height: '12px', borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                  جاري التحقق...
                </>
              ) : (
                'دخول ←'
              )}
            </span>
          </button>
        </form>
      </motion.div>
    </main>
  );
}
