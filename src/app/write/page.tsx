'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveMessage } from '@/app/actions/memoryActions';

/* ─────────────────────────────────────────────
   Decorative SVG corner ornament (vintage book)
───────────────────────────────────────────── */
function GoldCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 2 L14 2 M2 2 L2 14"
        stroke="#C9A55A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M2 2 L8 8"
        stroke="#C9A55A"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Field wrapper with label, input, and focus line
───────────────────────────────────────────── */
interface FieldProps {
  id: string;
  label: string;
  sublabel?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, sublabel, required, error, children }: FieldProps) {
  return (
    <div className="write-field" role="group" aria-labelledby={`${id}-label`}>
      <div className="write-field-header">
        <label id={`${id}-label`} htmlFor={id} className="write-label">
          {label}
          {required && (
            <span className="write-required" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {sublabel && <span className="write-sublabel">{sublabel}</span>}
      </div>

      {children}

      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="write-error"
            role="alert"
          >
            <span className="write-error-dot" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Character counter
───────────────────────────────────────────── */
function CharCounter({ current, max }: { current: number; max: number }) {
  const ratio = current / max;
  const color =
    ratio > 0.9 ? '#c0392b' : ratio > 0.7 ? '#C9A55A' : 'var(--fg-faint)';
  return (
    <span className="write-char-counter" style={{ color }}>
      {current} / {max}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
const MAX_TEXT = 800;
const MAX_NAME = 60;

export default function WritePage() {
  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [touched, setTouched] = useState({ text: false, sender: false });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [isPending, startTransition] = useTransition();

  const textError =
    touched.text && !text.trim() ? 'الرجاء كتابة رسالة تهنئة أولاً' : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ text: true, sender: true });
    if (!text.trim()) return;

    setStatus('submitting');
    startTransition(async () => {
      const fd = new FormData();
      fd.append('text', text.trim());
      fd.append('sender', sender.trim());
      const res = await saveMessage(fd);
      if (res.success) {
        setStatus('success');
        setText('');
        setSender('');
        setTouched({ text: false, sender: false });
      } else {
        setStatus('error');
        setServerError(res.error ?? 'خطأ غير متوقع');
        setTimeout(() => setStatus('idle'), 4000);
      }
    });
  };

  return (
    <>
      {/* ── Page-level backdrop dimmer — subdues background watermark ── */}
      <div className="write-backdrop" aria-hidden="true" />

      <main
        className="write-page-root"
        style={{ direction: 'rtl' }}
      >
        {/* ── Ambient glow above card ── */}
        <div className="write-glow" aria-hidden="true" />

        {/* ── Premium card modal ── */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            /* ─── Success state ─────────────────────────────────────── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="write-card"
              aria-live="polite"
            >
              {/* Corners */}
              <GoldCorner className="write-corner write-corner-tl" />
              <GoldCorner className="write-corner write-corner-tr" />
              <GoldCorner className="write-corner write-corner-bl" />
              <GoldCorner className="write-corner write-corner-br" />

              <div className="write-success-inner">
                {/* Gold check */}
                <div className="write-success-icon" aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
                    <circle
                      cx="24"
                      cy="24"
                      r="22"
                      stroke="#C9A55A"
                      strokeWidth="1.2"
                      opacity="0.35"
                    />
                    <path
                      d="M14 24.5L21 31.5L34 17"
                      stroke="#C9A55A"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="write-success-title">وُضِعَت كلماتك في سجل يوسف</p>

                <p className="write-success-sub">
                  شكراً على مشاركتنا هذه اللحظة الجميلة
                </p>

                {/* Thin gold divider */}
                <div className="write-divider" />

                <button
                  onClick={() => setStatus('idle')}
                  className="write-secondary-btn"
                  type="button"
                >
                  ↩&ensp;أرسل رسالة أخرى
                </button>
              </div>
            </motion.div>
          ) : (
            /* ─── Form card ──────────────────────────────────────────── */
            <motion.div
              key="form-card"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="write-card"
            >
              {/* Vintage corners */}
              <GoldCorner className="write-corner write-corner-tl" />
              <GoldCorner className="write-corner write-corner-tr" />
              <GoldCorner className="write-corner write-corner-bl" />
              <GoldCorner className="write-corner write-corner-br" />

              {/* ── Card header ── */}
              <header className="write-card-header">
                <p className="write-eyebrow">دفتر ذكريات · ٢٠٢٦</p>
                <h1 className="write-heading">اكتب تهنئتك</h1>
                <p className="write-subheading">
                  كلماتك ستظل محفورة في صفحات هذه اللحظة للأبد
                </p>
              </header>

              {/* Thin gold divider */}
              <div className="write-divider" />

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} noValidate className="write-form">
                {/* Message textarea */}
                <Field
                  id="msg-text"
                  label="رسالتك"
                  required
                  error={textError}
                >
                  <div className="write-textarea-wrap">
                    <textarea
                      id="msg-text"
                      rows={5}
                      value={text}
                      maxLength={MAX_TEXT}
                      onChange={(e) => setText(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, text: true }))}
                      placeholder="اكتب كلماتك هنا…"
                      className="write-textarea"
                      aria-required="true"
                      aria-invalid={!!textError}
                      aria-describedby={textError ? 'msg-text-error' : undefined}
                    />
                    <CharCounter current={text.length} max={MAX_TEXT} />
                  </div>
                </Field>

                {/* Sender name */}
                <Field
                  id="msg-sender"
                  label="اسمك"
                  sublabel="اختياري"
                >
                  <input
                    id="msg-sender"
                    type="text"
                    value={sender}
                    maxLength={MAX_NAME}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="اتركه فارغاً وستظهر باسم «مجهول»"
                    className="write-input"
                  />
                </Field>

                {/* Server-side error banner */}
                <AnimatePresence>
                  {status === 'error' && (
                    <motion.div
                      key="server-error"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="write-server-error"
                      role="alert"
                    >
                      <span className="write-error-dot" aria-hidden="true" />
                      {serverError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Actions row ── */}
                <div className="write-actions">
                  <button
                    id="write-submit-btn"
                    type="submit"
                    disabled={isPending || status === 'submitting'}
                    className="write-primary-btn"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isPending || status === 'submitting' ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="write-btn-spinner"
                          aria-label="جاري الإرسال"
                        >
                          <span className="write-spinner" aria-hidden="true" />
                          جاري الإرسال…
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          أرسل رسالتك&ensp;←
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  <span className="write-privacy-note">
                    للعيون الخاصة فقط
                  </span>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
