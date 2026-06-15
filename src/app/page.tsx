'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
/* ─────────────────────────────────────────────────────────────
   AMBIENT GOLD PARTICLES (Floating gold dust)
   Renders subtle floating particles behind modal content
───────────────────────────────────────────────────────────── */

function GoldDust() {
  const particles = Array.from({ length: 14 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => {
        const size = Math.random() * 2.5 + 1; // 1px to 3.5px
        const left = Math.random() * 100; // 0% to 100%
        const delay = Math.random() * 6;
        const duration = Math.random() * 7 + 8; // 8s to 15s
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#d4af37]"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: `-20px`,
              opacity: 0.15,
            }}
            animate={{
              y: -600,
              opacity: [0, 0.45, 0.45, 0],
              x: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    /*
     * Root: full-screen flex column
     * ─ paddingTop clears the fixed nav bar
     */
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{ direction: 'rtl', paddingTop: '72px' }}
    >
      {/* ═══════════════════════════════════════════════════
          HERO — clean, spacious, and centered focal point
      ═══════════════════════════════════════════════════ */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-4 text-center relative z-10 gap-4">
        
        {/* Floating Portrait with subtle vertical translate animation */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
          className="gallery-frame flex-shrink-0 cursor-pointer"
          style={{ direction: 'ltr' }}
          onClick={() => setIsOpen(true)}
        >
          <Image
            src="/graduated.png"
            alt="يوسف والعباءة"
            width={200}
            height={250}
            priority
            className="block"
            style={{
              width: 'clamp(120px, 25vh, 200px)',
              height: 'auto',
              filter: 'contrast(1.0) saturate(0.92) brightness(1.04)',
            }}
            sizes="(max-width: 640px) 25vh, 200px"
          />
        </motion.div>

        {/* Text content details */}
        <div className="flex flex-col items-center gap-2 max-w-xl">
          <h1
            className="font-amiri leading-normal"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              color: 'var(--fg)',
              letterSpacing: '0.04em',
              textShadow: '0 2px 16px var(--card-accent-glow)',
            }}
          >
            دفتر ذكرى تخرجي
          </h1>

          <p
            className="font-amiri leading-relaxed"
            style={{
              fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
              color: 'var(--fg-muted)',
              maxWidth: '90%',
            }}
          >
            صفحات نسجت لتخليد اللحظات الخالدة وعبارات التهنئة الصادقة بمناسبة التخرج.
          </p>

          {/* Primary CTA button to open the glass card modal */}
          <button
            onClick={() => setIsOpen(true)}
            className="font-mono font-semibold tracking-widest uppercase transition-all duration-300 hover:opacity-100 mt-4 cursor-pointer"
            style={{
              fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
              padding: 'clamp(0.7rem, 2vw, 0.95rem) clamp(2rem, 5vw, 3rem)',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              opacity: 0.92,
              letterSpacing: '0.16em',
              boxShadow: '0 0 20px rgba(200,169,74,0.18)',
              background: 'transparent',
            }}
          >
            ابدأ الذكريات ←
          </button>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════
          PREMIUM OVERLAY MODAL (Luxury graduation-book style)
      ═══════════════════════════════════════════════════ */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div
              className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-4 overflow-y-auto overflow-x-hidden"
              style={{
                paddingTop: 'max(80px, env(safe-area-inset-top))',
              }}
            >
              
              {/* Darken page background with heavy blur & overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 backdrop-blur-[12px]"
                style={{ background: 'var(--modal-overlay)' }}
              />

              {/* Luxurious Centerpiece Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-[95vw] md:w-[1220px] max-w-7xl rounded-[28px] overflow-hidden z-10 border border-[#d4af37]/25 shadow-[0_25px_80px_rgba(0,0,0,0.60),0_0_40px_rgba(212,175,55,0.15)] flex flex-col"
                style={{
                  background: `linear-gradient(to right, var(--card-surface) 0%, var(--card-surface-end) 50%, var(--card-surface-end) 100%)`,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  padding: 'clamp(1.5rem, 5vw, 4.5rem) clamp(1.25rem, 6vw, 5rem)',
                  maxHeight: 'calc(100vh - 110px)',
                }}
              >
                {/* Floating gold dust overlay inside the modal */}
                <GoldDust />

                {/* Circular luxury close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center justify-center w-11 h-11 rounded-full border border-[#d4af37]/25 text-[#d4af37] bg-black/40 backdrop-blur-md transition-all duration-300 hover:bg-[#d4af37] hover:text-black hover:scale-110 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] cursor-pointer"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Scrollable Content Container */}
                <div className="w-full flex-1 overflow-y-auto overflow-x-hidden min-h-0 pt-6 md:pt-0 scrollbar-hide">
                  {/* Inner grid: portrait on the right, content on the left (RTL layout) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center w-full relative z-10 flex-1">

                    {/* Portrait Column — overflow:hidden clips the gallery-frame -8px bleed */}
                    <div className="modal-portrait-col md:col-span-5 flex justify-center w-full relative overflow-hidden">
                      
                      {/* Ambient gold radial glow — no scale transform to prevent overflow */}
                      <div
                        className="absolute inset-0 pointer-events-none rounded-full blur-[65px]"
                        style={{
                          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0) 70%)',
                        }}
                      />

                      {/* Integrated Portrait (No rigid border frame) with vertical float */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 6,
                          ease: "easeInOut",
                        }}
                        className="gallery-frame flex-shrink-0"
                        style={{ direction: 'ltr' }}
                      >
                        <Image
                          src="/graduated.png"
                          alt="يوسف والعباءة"
                          width={280}
                          height={350}
                          priority
                          className="block"
                          style={{
                            width: 'clamp(180px, 40vh, 280px)',
                            height: 'auto',
                            filter: 'contrast(1.0) saturate(0.92) brightness(1.04)',
                          }}
                          sizes="(max-width: 640px) 40vh, 280px"
                        />
                      </motion.div>
                    </div>

                    {/* Text Content Column (renders on the left in RTL) */}
                    <div className="md:col-span-7 flex flex-col gap-8 text-center w-full relative z-10 p-2">

                      {/* Poetic Verse (Traditional Layout) */}
                      <div
                        className="flex flex-col gap-4 text-center font-amiri text-[#c8a94a] font-bold text-base md:text-[1.25rem] tracking-wide leading-loose"
                        style={{ textShadow: '0 0 12px rgba(212, 175, 55, 0.45)' }}
                      >
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 md:gap-16 w-full">
                          <span>تَعلَّم فَلَيسَ المَرءُ يولَدُ عالِماً</span>
                          <span>وَلَيسَ أَخو عِلمٍ كَمَن هُوَ جاهِلُ</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 md:gap-16 w-full">
                          <span>وَمَن لَم يَذُق مُرَّ التَّعَلُّمِ ساعَةً</span>
                          <span>تَجَرَّعَ ذُلَّ الجَهلِ طولَ حَياتِهِ</span>
                        </div>
                      </div>

                      {/* Main title — crisp ivory, significantly larger */}
                      <h1
                        className="font-amiri leading-normal py-1"
                        style={{
                          fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                          color: 'var(--fg)',
                          letterSpacing: '0.04em',
                          textShadow: '0 2px 16px var(--card-accent-glow)',
                        }}
                      >
                        دفتر ذكرى تخرجي
                      </h1>

                      {/* Subtle gold accent line under the title */}
                      <div
                        className="w-24 h-[2px] mx-auto"
                        style={{
                          background: 'var(--accent)',
                          boxShadow: '0 0 10px rgba(212, 175, 55, 0.65)',
                        }}
                      />

                      {/* Description */}
                      <p
                        className="font-amiri text-base md:text-lg mt-4"
                        style={{
                          color: 'var(--fg-muted)',
                          lineHeight: 1.9,
                        }}
                      >
                        صفحات نُسجت لتخليد اللحظات الخالدة وعبارات التهنئة الصادقة بمناسبة التخرج.
                      </p>

                      {/* Centered Single Primary CTA Button */}
                      <div className="flex justify-center mt-10 w-full">
                        <Link
                          href="/write"
                          className="flex items-center justify-center w-full max-w-[280px] min-h-[52px] text-center font-mono font-bold tracking-widest uppercase transition-all duration-300 bg-[#d4af37] text-[#090909] py-4 px-8 rounded-xl hover:bg-[#c59e2a] hover:scale-105 active:scale-95 cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)]"
                          style={{
                            fontSize: '0.9rem',
                            letterSpacing: '0.16em',
                          }}
                        >
                          اكتب تهنئة →
                        </Link>
                      </div>

                    </div>

                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ═══════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer
        className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-6 md:px-10 py-5"
        style={{
          borderTop: '1px solid var(--border-soft)',
          direction: 'ltr',
        }}
      >
        <p
          className="font-amiri text-sm"
          style={{ color: 'var(--fg-faint)' }}
        >
          دفتر ذكريات يوسف
        </p>

        <p
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ color: 'var(--fg-faint)', opacity: 0.5 }}
        >
          Private Memory Album · Class of 2026
        </p>

        <p
          className="font-mono text-[9px] tracking-widest"
          style={{ color: 'var(--fg-faint)', opacity: 0.35 }}
        >
          © 2026
        </p>
      </footer>
    </main>
  );
}
