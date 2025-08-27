
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from './wallet-context';
import { usePhoneVerification } from './phone-verification-context';
import { useTransaction } from './transaction-context';
import { SessionExpirationBanner } from '@/components/auth/session-expiration-banner';

const SESSION_DURATION = 15 * 60 * 1000; // 15 minutes
const WARNING_COUNTDOWN_SECONDS = 2 * 60; // 2 minutes

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

  const [showExpirationWarning, setShowExpirationWarning] = useState(false);
  const [sessionTimeoutId, setSessionTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [warningTimeoutId, setWarningTimeoutId] = useState<NodeJS.Timeout | null>(null);

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
        description: 'You have been successfully logged out for security reasons.',
    });
    
    if (sessionTimeoutId) clearTimeout(sessionTimeoutId);
    if (warningTimeoutId) clearTimeout(warningTimeoutId);
    setSessionTimeoutId(null);
    setWarningTimeoutId(null);
    setShowExpirationWarning(false);
  }, [walletContext, phoneVerificationContext, transactionContext, toast, sessionTimeoutId, warningTimeoutId]);

  const startSessionTimers = useCallback(() => {
    if (warningTimeoutId) clearTimeout(warningTimeoutId);
    if (sessionTimeoutId) clearTimeout(sessionTimeoutId);

    const warningTimeout = setTimeout(() => {
        setShowExpirationWarning(true);
        const logoutTimeout = setTimeout(logout, WARNING_COUNTDOWN_SECONDS * 1000);
        setWarningTimeoutId(logoutTimeout);
    }, SESSION_DURATION - (WARNING_COUNTDOWN_SECONDS * 1000));
    setSessionTimeoutId(warningTimeout);
  }, [logout, sessionTimeoutId, warningTimeoutId]);
  
  const extendSession = useCallback(() => {
    setShowExpirationWarning(false);
    startSessionTimers();
  }, [startSessionTimers]);


  useEffect(() => {
    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    
    const activityHandler = () => {
        if (isAuthenticated) {
            extendSession();
        }
    };

    activityEvents.forEach(event => window.addEventListener(event, activityHandler));

    return () => {
        activityEvents.forEach(event => window.removeEventListener(event, activityHandler));
        if (sessionTimeoutId) clearTimeout(sessionTimeoutId);
        if (warningTimeoutId) clearTimeout(warningTimeoutId);
    };
  }, [isAuthenticated, extendSession, sessionTimeoutId, warningTimeoutId]);

  useEffect(() => {
    const storedPhone = localStorage.getItem(AUTH_USER_PHONE_KEY) || sessionStorage.getItem(AUTH_USER_PHONE_KEY);
    if (storedPhone) {
      setUserPhone(storedPhone);
      setIsAuthenticated(true);
      startSessionTimers();
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (phone: string, rememberMe = false) => {
    setUserPhone(phone);
    setIsAuthenticated(true);
    if (rememberMe) {
        localStorage.setItem(AUTH_USER_PHONE_KEY, phone);
    } else {
        sessionStorage.setItem(AUTH_USER_PHONE_KEY, phone);
    }
    startSessionTimers();
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userPhone, login, logout }}>
      <SessionExpirationBanner
        isOpen={showExpirationWarning}
        onExtend={extendSession}
        onLogout={logout}
        countdownSeconds={WARNING_COUNTDOWN_SECONDS}
      />
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
