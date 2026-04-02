import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'REX CMA CGM — Devoteam',
  description: 'Retour sur Expérience — Mission Devoteam × CMA CGM 2024–2025',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a1628',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full bg-[#0a1628] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
