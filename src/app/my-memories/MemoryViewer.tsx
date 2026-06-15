'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { SerializedMemory } from '@/app/actions/memoryActions';

interface Props {
  memories: SerializedMemory[];
  onLogout: () => void;
}

/* ─────────────────────────────────────────────────────────────
   Decorative SVG corner ornament (vintage book)
───────────────────────────────────────────────────────────── */
function BookCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path d="M4 4 L18 4 M4 4 L4 18" stroke="#C9A55A" strokeWidth="1" strokeLinecap="round" />
      <path d="M4 4 L12 12" stroke="#C9A55A" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
      <circle cx="4" cy="4" r="1.5" fill="#C9A55A" opacity="0.3" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Decorative ruled lines for the notebook page
───────────────────────────────────────────────────────────── */
function RuledLines() {
  const lines = Array.from({ length: 12 });
  return (
    <div className="book-ruled-lines" aria-hidden="true">
      {lines.map((_, i) => (
        <div key={i} className="book-ruled-line" />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Book Viewer
───────────────────────────────────────────────────────────── */
export default function MemoryViewer({ memories, onLogout }: Props) {
  // Page 0 = cover. Pages 1..N = memories.
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next
  const [isFlipping, setIsFlipping] = useState(false);
  const totalPages = memories.length + 1; // cover + memory pages
  const bookRef = useRef<HTMLDivElement>(null);

  /* ── Keyboard navigation ────────────────────────────────── */
  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setDirection(1);
      setIsFlipping(true);
      setCurrentPage(p => p + 1);
    }
  }, [currentPage, totalPages, isFlipping]);

  const goPrev = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      setDirection(-1);
      setIsFlipping(true);
      setCurrentPage(p => p - 1);
    }
  }, [currentPage, isFlipping]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  /* ── Swipe gesture support ── */
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goNext(); // swipe left = next (RTL)
      else goPrev();        // swipe right = prev
    }
    touchStart.current = null;
  };

  /* ── Page flip animation variants ── */
  const pageVariants: Variants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        rotateY: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.4, ease: 'easeOut' },
        scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      },
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.95,
      transition: {
        rotateY: { duration: 0.5, ease: [0.7, 0, 0.84, 0] },
        opacity: { duration: 0.3, ease: 'easeIn' },
        scale: { duration: 0.4, ease: 'easeIn' },
      },
    }),
  };

  const memory = currentPage > 0 ? memories[currentPage - 1] : null;
  const date = memory
    ? new Date(memory.createdAt).toLocaleDateString('ar-EG', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  return (
    <>
      {/* Full-screen backdrop dimmer */}
      <div className="book-backdrop" aria-hidden="true" />

      <main
        className="book-page-root"
        style={{ direction: 'rtl' }}
      >
        {/* Ambient glow */}
        <div className="book-ambient-glow" aria-hidden="true" />

        {/* The Book */}
        <div
          ref={bookRef}
          className="book-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ perspective: '1800px' }}
        >
          {/* Book spine shadow */}
          <div className="book-spine" aria-hidden="true" />

          {/* Book body */}
          <div className="book-body">
            {/* Corner ornaments */}
            <BookCorner className="book-ornament book-ornament-tl" />
            <BookCorner className="book-ornament book-ornament-tr" />
            <BookCorner className="book-ornament book-ornament-bl" />
            <BookCorner className="book-ornament book-ornament-br" />

            {/* Top shimmer line */}
            <div className="book-shimmer-top" aria-hidden="true" />

            {/* Pages with flip animation */}
            <AnimatePresence
              mode="wait"
              custom={direction}
              onExitComplete={() => setIsFlipping(false)}
            >
              <motion.div
                key={currentPage}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="book-page-content"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                {currentPage === 0 ? (
                  /* ═══ COVER PAGE ═══ */
                  <div className="book-cover-page">
                    {/* Portrait */}
                    <div className="book-cover-portrait" style={{ direction: 'ltr' }}>
                      <div className="book-portrait-glow" aria-hidden="true" />
                      <Image
                        src="/graduated.png"
                        alt="يوسف والعباءة"
                        width={220}
                        height={275}
                        priority
                        className="block"
                        style={{
                          width: 'clamp(140px, 30vw, 220px)',
                          height: 'auto',
                          filter: 'contrast(1.05) saturate(0.92)',
                          borderRadius: '4px',
                        }}
                        sizes="(max-width: 640px) 30vw, 220px"
                      />
                    </div>

                    {/* Title */}
                    <h1 className="book-cover-title">دفتر ذكريات يوسف</h1>

                    {/* Divider */}
                    <div className="book-gold-divider" />

                    {/* Subtitle */}
                    <p className="book-cover-subtitle">
                      {memories.length === 0
                        ? 'لا توجد رسائل بعد'
                        : `${memories.length} رسالة محفوظة في هذا الدفتر`
                      }
                    </p>

                    {/* Open book prompt */}
                    {memories.length > 0 && (
                      <button
                        onClick={goNext}
                        className="book-open-btn"
                      >
                        <span>افتح الدفتر</span>
                        <svg viewBox="0 0 24 24" fill="none" className="book-open-btn-icon">
                          <path d="M9 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}

                    {/* Page number */}
                    <span className="book-page-number">الغلاف</span>
                  </div>
                ) : (
                  /* ═══ MEMORY PAGE ═══ */
                  <div className="book-memory-page">
                    {/* Ruled lines behind text */}
                    <RuledLines />

                    {/* Page header — sender & number */}
                    <div className="book-page-header">
                      <span className="book-sender-badge">
                        {memory!.sender}
                      </span>
                      <span className="book-date-label">{date}</span>
                    </div>

                    {/* The message — written on the ruled lines */}
                    <div className="book-message-area">
                      <p className="book-message-text">
                        «&nbsp;{memory!.text}&nbsp;»
                      </p>
                    </div>

                    {/* Bottom signature area */}
                    <div className="book-signature-area">
                      <div className="book-gold-divider book-gold-divider-short" />
                      <p className="book-signature-name">— {memory!.sender}</p>
                    </div>

                    {/* Page number */}
                    <span className="book-page-number">
                      صفحة {currentPage} من {memories.length}
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stacked pages effect (visible behind current page) */}
          <div className="book-stacked-page book-stacked-1" aria-hidden="true" />
          <div className="book-stacked-page book-stacked-2" aria-hidden="true" />
          <div className="book-stacked-page book-stacked-3" aria-hidden="true" />
        </div>

        {/* ── Navigation Controls ── */}
        <div className="book-controls">
          <button
            onClick={goPrev}
            disabled={currentPage === 0 || isFlipping}
            className="book-nav-btn"
            aria-label="الصفحة السابقة"
          >
            <svg viewBox="0 0 24 24" fill="none" className="book-nav-icon">
              <path d="M15 19l7-7-7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>السابقة</span>
          </button>

          {/* Page indicator dots */}
          <div className="book-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isFlipping && i !== currentPage) {
                    setDirection(i > currentPage ? 1 : -1);
                    setIsFlipping(true);
                    setCurrentPage(i);
                  }
                }}
                className={`book-dot ${i === currentPage ? 'book-dot-active' : ''}`}
                aria-label={i === 0 ? 'الغلاف' : `صفحة ${i}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className="book-nav-btn"
            aria-label="الصفحة التالية"
          >
            <span>التالية</span>
            <svg viewBox="0 0 24 24" fill="none" className="book-nav-icon">
              <path d="M9 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="book-logout-btn"
        >
          خروج
        </button>
      </main>
    </>
  );
}
