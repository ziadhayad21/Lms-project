import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '../lib/contexts/AuthContext';
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
    template: '%s | Mr Abdallah Elhayad',
    default:  'Mr Abdallah Elhayad - English Learning Platform',
  },
  description:
    'The official English learning platform by Mr Abdallah Elhayad. Quality video lessons, materials, and comprehensive courses.',
  keywords: ['English learning', 'Mr Abdallah Elhayad', 'English teacher', 'LMS', 'ESL'],
  authors: [{ name: 'Mr Abdallah Elhayad' }],
  openGraph: {
    type:      'website',
    locale:    'en_US',
    siteName:  'Mr Abdallah Elhayad',
    images:    [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mr Abdallah Elhayad' }],
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
