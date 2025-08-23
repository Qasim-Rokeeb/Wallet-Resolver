import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import { AlertBanner } from '@/components/layout/alert-banner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Wallet Resolver',
  description: 'Send crypto using just a phone number.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Navbar />
        <AlertBanner 
          title="Beta Notice:"
          description="This is a demo application. Do not use real wallet information."
          initiallyVisible={true}
        />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
