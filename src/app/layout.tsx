
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import { AlertBanner } from '@/components/layout/alert-banner';
import { Footer } from '@/components/layout/footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WelcomeModal } from '@/components/onboarding/welcome-modal';
import { WalletProvider } from '@/context/wallet-context';
import { PhoneVerificationProvider } from '@/context/phone-verification-context';
import { AuthProvider } from '@/context/auth-context';
import { TransactionProvider } from '@/context/transaction-context';
import { FavoritesProvider } from '@/context/favorites-context';

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
      <body className={`${inter.variable} flex flex-col min-h-screen`}>
        <AuthProvider>
          <PhoneVerificationProvider>
            <WalletProvider>
              <TransactionProvider>
                <FavoritesProvider>
                  <TooltipProvider>
                    <Navbar />
                    <AlertBanner 
                      title="Beta Notice:"
                      description="This is a demo application. Do not use real wallet information."
                      initiallyVisible={true}
                    />
                    <WelcomeModal />
                    <main className="flex-grow">{children}</main>
                    <Toaster />
                  </TooltipProvider>
                </FavoritesProvider>
              </TransactionProvider>
            </WalletProvider>
          </PhoneVerificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
