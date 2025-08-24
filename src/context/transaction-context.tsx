
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Transaction {
    id: string;
    type: 'sent' | 'received';
    phone: string;
    amount: number;
    date: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  recordTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'type'> & {type?: 'sent' | 'received', date?: string, id?: string}) => void;
  resetTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const TRANSACTIONS_KEY = 'transactions_history';

// Mock data for initial state
const initialMockTransactions: Transaction[] = [
    {
        id: 'tx_1',
        type: 'received',
        phone: '+1 (555) 987-6543',
        amount: 0.035, // Approx $120.50
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
        id: 'tx_2',
        type: 'sent',
        phone: '+1 (555) 555-5555',
        amount: 0.007, // Approx $25.00
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    }
];

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
        } else {
            // Set initial mock data if no history exists
            setTransactions(initialMockTransactions);
            localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialMockTransactions));
        }
    }
  }, []);

  const recordTransaction = (transaction: Omit<Transaction, 'id' | 'date' | 'type'> & {type?: 'sent' | 'received', date?: string, id?: string}) => {
    const newTransaction: Transaction = {
        id: transaction.id || `tx_${Date.now()}`,
        type: transaction.type || 'sent',
        phone: transaction.phone,
        amount: transaction.amount,
        date: transaction.date || new Date().toISOString(),
    };

    setTransactions(prevTransactions => {
        const updatedTransactions = [newTransaction, ...prevTransactions];
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
        return updatedTransactions;
    });
  };

  const resetTransactions = () => {
    setTransactions([]);
    localStorage.removeItem(TRANSACTIONS_KEY);
  }

  const hasSentTransaction = transactions.some(t => t.type === 'sent');

  return (
    <TransactionContext.Provider value={{ transactions, recordTransaction, resetTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  // Add hasSentTransaction to the returned context for OnboardingChecklist
  const hasSentTransaction = context.transactions.some(t => t.type === 'sent');
  return { ...context, hasSentTransaction };
};
