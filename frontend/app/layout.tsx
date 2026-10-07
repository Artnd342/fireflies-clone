import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fireflies.ai Clone',
  description: 'Meeting Notes & Transcription Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}