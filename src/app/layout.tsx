import type { Metadata } from 'next';
import { Amiri, Tajawal } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import Navigation from '@/app/components/Navigation';
import BackdropText from '@/app/components/BackdropText';

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'دفتر ذكريات يوسف | Graduation Memory Book',
  description: 'كتاب ذكريات خاص بيوسف بمناسبة التخرج — صفحات من القلب.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${tajawal.variable} dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-screen overflow-x-hidden max-w-[100vw]">
        <ThemeProvider>
          {/* Layer 0 — fixed backdrop watermark */}
          <BackdropText />

          {/* Layer 1 — atmospheric bottom shadow overlay */}
          <div className="bottom-fade-overlay" aria-hidden="true" />

          {/* Layer 2 — fixed nav bar */}
          <Navigation />

          {/* Layer 3 — page content, sits under z-50 nav */}
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
