'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { label: 'الرئيسية', href: '/' },
    { label: 'اكتب تهنئة', href: '/write' },
    { label: 'الذكريات', href: '/my-memories' },
  ];

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between"
      style={{
        direction: 'rtl',
        padding: '0 clamp(1rem, 4vw, 2.5rem)',
        height: '56px',
        borderBottom: '1px solid var(--border-soft)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        background: 'var(--card-bg)',
      }}
    >
      {/* ── Brand ───────────────────────── */}
      <Link
        href="/"
        className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-100"
        style={{ opacity: 0.9 }}
      >
        {/* Book icon */}
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" style={{ color: 'var(--accent)' }}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span
          className="font-amiri text-sm font-bold tracking-wide"
          style={{ color: 'var(--accent)' }}
        >
          دفتر يوسف
        </span>
      </Link>

      {/* ── Links + Toggle ─────────────── */}
      <div className="flex items-center gap-4 sm:gap-6">
        {links.map(({ label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="hidden sm:inline-flex items-center gap-1 font-tajawal text-[12px] tracking-wide transition-all duration-300 hover:opacity-100 pb-[2px]"
              style={{
                color: active ? 'var(--fg)' : 'var(--fg-muted)',
                opacity: active ? 1 : 0.55,
                borderBottom: active ? '1.5px solid var(--accent)' : '1.5px solid transparent',
              }}
            >
              {label}
            </Link>
          );
        })}

        {/* Mobile: hamburger-style compact links */}
        <div className="sm:hidden flex items-center gap-3">
          {links.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="font-tajawal text-[11px] transition-opacity duration-300"
                style={{
                  color: active ? 'var(--accent)' : 'var(--fg-muted)',
                  opacity: active ? 1 : 0.4,
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:opacity-100"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--fg-muted)',
            opacity: 0.6,
            background: 'var(--accent-soft)',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
