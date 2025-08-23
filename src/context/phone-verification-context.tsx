
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PhoneVerificationContextType {
  isPhoneVerified: boolean;
  verifyPhone: () => void;
  unverifyPhone: () => void;
}

const PhoneVerificationContext = createContext<PhoneVerificationContextType | undefined>(undefined);

const PHONE_VERIFIED_KEY = 'phone_verified';

export const PhoneVerificationProvider = ({ children }: { children: ReactNode }) => {
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);

  useEffect(() => {
    const storedStatus = localStorage.getItem(PHONE_VERIFIED_KEY);
    if (storedStatus === 'true') {
      setIsPhoneVerified(true);
    }
  }, []);

  const verifyPhone = () => {
    setIsPhoneVerified(true);
    localStorage.setItem(PHONE_VERIFIED_KEY, 'true');
  };

  const unverifyPhone = () => {
    setIsPhoneVerified(false);
    localStorage.removeItem(PHONE_VERIFIED_KEY);
  };

  return (
    <PhoneVerificationContext.Provider value={{ isPhoneVerified, verifyPhone, unverifyPhone }}>
      {children}
    </PhoneVerificationContext.Provider>
  );
};

export const usePhoneVerification = () => {
  const context = useContext(PhoneVerificationContext);
  if (context === undefined) {
    throw new Error('usePhoneVerification must be used within a PhoneVerificationProvider');
  }
  return context;
};
