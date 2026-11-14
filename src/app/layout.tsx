import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GATE Command Center · 90-Day Rescue Plan',
  description: 'The definitive command dashboard for GATE CSE 2027 based on 1,840 past questions and the 90-Day Rescue Plan.',
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink min-h-screen selection:bg-brand-redLight selection:text-brand-redDark">
        {children}
      </body>
    </html>
  );
}
