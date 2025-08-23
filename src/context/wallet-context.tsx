
"use client";

import { useToast } from '@/hooks/use-toast';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface WalletContextType {
  walletAddress: string | null;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WALLET_ADDRESS_KEY = 'wallet_address';

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedAddress = localStorage.getItem(WALLET_ADDRESS_KEY);
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  const connectWallet = (address: string) => {
    setWalletAddress(address);
    localStorage.setItem(WALLET_ADDRESS_KEY, address);
    toast({
        variant: 'success',
        title: 'Wallet Linked!',
        description: `Your wallet has been successfully linked.`
    })
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem(WALLET_ADDRESS_KEY);
    toast({
        title: 'Wallet Disconnected',
        description: 'Your wallet has been disconnected.',
    });
  };

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
