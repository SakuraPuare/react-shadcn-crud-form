import './globals.css';
import React from 'react';

export const metadata = {
  title: 'My Component Library with Next.js',
  description: 'Demonstrating components with Next.js App Router',
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