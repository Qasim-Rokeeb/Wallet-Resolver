
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from './wallet-context';
import { usePhoneVerification } from './phone-verification-context';
import { useTransaction } from './transaction-context';
import { SessionExpirationModal } from '@/components/auth/session-expiration-modal';

const SESSION_DURATION = 15 * 60 * 1000; // 15 minutes
const MODAL_TIMEOUT = 2 * 60 * 1000; // 2 minutes

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
  
  const walletContext = useWallet();
  const phoneVerificationContext = usePhoneVerification();
  const transactionContext = useTransaction();

  const [showExpirationModal, setShowExpirationModal] = useState(false);
  const [sessionTimeoutId, setSessionTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [modalTimeoutId, setModalTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserPhone(null);
    localStorage.removeItem(AUTH_USER_PHONE_KEY);
    sessionStorage.removeItem(AUTH_USER_PHONE_KEY);

    walletContext?.disconnectWallet(false);
    phoneVerificationContext?.unverifyPhone();
    transactionContext?.resetTransactions();

    toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
    });
    
    // Cleanup timers
    if (sessionTimeoutId) clearTimeout(sessionTimeoutId);
    if (modalTimeoutId) clearTimeout(modalTimeoutId);
    setShowExpirationModal(false);
  }, [walletContext, phoneVerificationContext, transactionContext, toast, sessionTimeoutId, modalTimeoutId]);

  const resetSession = useCallback(() => {
    if (sessionTimeoutId) clearTimeout(sessionTimeoutId);
    if (modalTimeoutId) clearTimeout(modalTimeoutId);
    
    setShowExpirationModal(false);

    if (isAuthenticated) {
        const newSessionTimeout = setTimeout(() => {
            setShowExpirationModal(true);
            const newModalTimeout = setTimeout(logout, MODAL_TIMEOUT);
            setModalTimeoutId(newModalTimeout);
        }, SESSION_DURATION);
        setSessionTimeoutId(newSessionTimeout);
    }
  }, [isAuthenticated, sessionTimeoutId, modalTimeoutId, logout]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    
    const reset = () => resetSession();

    if (isAuthenticated) {
        events.forEach(event => window.addEventListener(event, reset));
        resetSession();
    } else {
        events.forEach(event => window.removeEventListener(event, reset));
    }

    return () => {
        events.forEach(event => window.removeEventListener(event, reset));
        if (sessionTimeoutId) clearTimeout(sessionTimeoutId);
        if (modalTimeoutId) clearTimeout(modalTimeoutId);
    };
  }, [isAuthenticated, resetSession]);

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


  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userPhone, login, logout }}>
      {children}
      <SessionExpirationModal 
        isOpen={showExpirationModal}
        onExtend={resetSession}
        onLogout={logout}
      />
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
