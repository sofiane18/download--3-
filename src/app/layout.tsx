
import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Updated import
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({ // Updated variable name
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Updated variable name
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DZD Control Panel',
  description: 'Financial control panel for e-commerce marketplace.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
