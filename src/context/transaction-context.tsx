
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface TransactionContextType {
  hasSentTransaction: boolean;
  recordTransaction: () => void;
  resetTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const TRANSACTION_SENT_KEY = 'transaction_sent';

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [hasSentTransaction, setHasSentTransaction] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedStatus = localStorage.getItem(TRANSACTION_SENT_KEY);
        if (storedStatus === 'true') {
            setHasSentTransaction(true);
        }
    }
  }, []);

  const recordTransaction = () => {
    setHasSentTransaction(true);
    localStorage.setItem(TRANSACTION_SENT_KEY, 'true');
  };

  const resetTransactions = () => {
    setHasSentTransaction(false);
    localStorage.removeItem(TRANSACTION_SENT_KEY);
  }

  return (
    <TransactionContext.Provider value={{ hasSentTransaction, recordTransaction, resetTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};
