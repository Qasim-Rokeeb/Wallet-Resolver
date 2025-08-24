
"use client";

import { useState } from 'react';
import { Wallet, Menu, X, ChevronRight, LayoutDashboard, LogOut, LogInIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WalletConnectModal } from '../wallet-resolver/wallet-connect-modal';
import { useWallet } from '@/context/wallet-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { LogoutConfirmationModal } from '../auth/logout-confirmation-modal';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { walletAddress, connectWallet, disconnectWallet } = useWallet();
  const { isAuthenticated, logout } = useAuth();

  const handleConnect = (address: string) => {
    connectWallet(address);
  };
  
  const handleDisconnect = () => {
    disconnectWallet();
    logout();
  }
  
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-primary" onClick={() => setIsMenuOpen(false)}>
              <Wallet className="h-8 w-8" />
              <span className="text-2xl font-bold">Wallet Resolver</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors font-medium flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/#send" className="text-gray-600 hover:text-primary transition-colors font-medium">
              Send
            </Link>
            <Link href="/#register" className="text-gray-600 hover:text-primary transition-colors font-medium">
              Register
            </Link>
            {isAuthenticated && walletAddress ? (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Wallet className="mr-2 h-4 w-4" />
                      {truncateAddress(walletAddress)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{truncateAddress(walletAddress)}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <LogoutConfirmationModal onConfirm={handleDisconnect}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Disconnect</span>
                      </DropdownMenuItem>
                    </LogoutConfirmationModal>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : isAuthenticated ? (
                <WalletConnectModal onConnect={handleConnect}>
                    <Button>
                      <Wallet className="mr-2 h-4 w-4" />
                      Link Wallet
                    </Button>
                </WalletConnectModal>
            ) : (
                <Button asChild>
                  <Link href="/login">
                    <LogInIcon className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden",
          isMenuOpen ? "block" : "hidden",
          "border-t border-gray-200 bg-white"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between text-gray-600 hover:bg-gray-100 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Link>
          <Link
            href="/#send"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between text-gray-600 hover:bg-gray-100 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
          >
            <span>Send</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
          <Link
            href="/#register"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between text-gray-600 hover:bg-gray-100 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
          >
             <span>Register</span>
             <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="p-4 border-t border-gray-200">
           {isAuthenticated && walletAddress ? (
              <LogoutConfirmationModal onConfirm={handleDisconnect}>
                <Button variant="outline" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect ({truncateAddress(walletAddress)})
                </Button>
              </LogoutConfirmationModal>
           ) : isAuthenticated ? (
             <WalletConnectModal onConnect={handleConnect}>
                <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Link Wallet
                </Button>
              </WalletConnectModal>
           ) : (
             <Button asChild className="w-full">
               <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                 <LogInIcon className="mr-2 h-4 w-4" />
                 Login
               </Link>
             </Button>
           )}
        </div>
      </div>
    </header>
  );
}
