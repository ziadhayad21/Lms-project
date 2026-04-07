import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import './globals.css';

const inter = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  variable: '--font-plus-jakarta',
  display:  'swap',
});

const interBody = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'),
  title: {
    template: '%s | EnglishPro LMS',
    default:  'EnglishPro — Learn English Online',
  },
  description:
    'A professional English learning platform with expert-taught video lessons, PDF materials, and interactive quizzes. Track your progress and achieve fluency.',
  keywords: ['English learning', 'online English courses', 'ESL', 'learn English', 'English teacher', 'IELTS preparation'],
  authors: [{ name: 'EnglishPro LMS' }],
  openGraph: {
    type:      'website',
    locale:    'en_US',
    siteName:  'EnglishPro LMS',
    images:    [{ url: '/og-image.png', width: 1200, height: 630, alt: 'EnglishPro LMS' }],
  },
  twitter: {
    card:   'summary_large_image',
    images: ['/og-image.png'],
  },
  robots:   { index: true, follow: true },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor:   '#4f46e5',
  width:        'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interBody.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
