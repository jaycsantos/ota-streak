import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OTA Streak',
  description: 'OTA Code Challenge',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/euclid-circular-b"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
