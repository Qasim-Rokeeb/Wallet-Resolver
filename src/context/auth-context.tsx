
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from './wallet-context';
import { usePhoneVerification } from './phone-verification-context';
import { useTransaction } from './transaction-context';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userPhone: string | null;
  login: (phone: string, rememberMe?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_PHONE_KEY = 'auth_user_phone';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const { toast } = useToast();
  
  // We need to clear other contexts on logout
  const walletContext = useWallet();
  const phoneVerificationContext = usePhoneVerification();
  const transactionContext = useTransaction();

  useEffect(() => {
    const storedPhone = localStorage.getItem(AUTH_USER_PHONE_KEY) || sessionStorage.getItem(AUTH_USER_PHONE_KEY);
    if (storedPhone) {
      setUserPhone(storedPhone);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (phone: string, rememberMe = false) => {
    setUserPhone(phone);
    setIsAuthenticated(true);
    if (rememberMe) {
        localStorage.setItem(AUTH_USER_PHONE_KEY, phone);
    } else {
        sessionStorage.setItem(AUTH_USER_PHONE_KEY, phone);
    }
  };

  const logout = () => {
    setUserPhone(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_USER_PHONE_KEY);
    sessionStorage.removeItem(AUTH_USER_PHONE_KEY);

    // Clear related contexts
    walletContext?.disconnectWallet(false); // Pass false to prevent toast
    phoneVerificationContext?.unverifyPhone();
    transactionContext?.resetTransactions();

    toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userPhone, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
