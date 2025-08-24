
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
    id: string;
    type: 'sent' | 'received';
    phone: string;
    amount: number;
    date: string;
    status: TransactionStatus;
    hash?: string;
    notes?: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  recordTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'type' | 'status'> & {type?: 'sent' | 'received', date?: string, id?: string, status?: TransactionStatus}) => string;
  updateTransactionStatus: (id: string, status: TransactionStatus, hash?: string) => void;
  resetTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const TRANSACTIONS_KEY = 'transactions_history';

// Mock data for initial state
const initialMockTransactions: Transaction[] = [
    {
        id: 'tx_today_1',
        type: 'received',
        phone: '+1 (555) 111-2222',
        amount: 0.1, // Approx $350
        date: new Date().toISOString(),
        status: 'completed',
        hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        notes: 'Invoice #123 payment'
    },
    {
        id: 'tx_1',
        type: 'received',
        phone: '+1 (555) 987-6543',
        amount: 0.035, // Approx $120.50
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        status: 'completed',
        hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    },
    {
        id: 'tx_2',
        type: 'sent',
        phone: '+1 (555) 555-5555',
        amount: 0.007, // Approx $25.00
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        status: 'completed',
        hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        notes: 'Coffee with Sarah'
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
  
  const updateLocalStorage = (updatedTransactions: Transaction[]) => {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
  }

  const recordTransaction = (transaction: Omit<Transaction, 'id' | 'date' | 'type' | 'status'> & {type?: 'sent' | 'received', date?: string, id?: string, status?: TransactionStatus}) => {
    const newTransaction: Transaction = {
        id: transaction.id || `tx_${Date.now()}`,
        type: transaction.type || 'sent',
        phone: transaction.phone,
        amount: transaction.amount,
        date: transaction.date || new Date().toISOString(),
        status: transaction.status || 'pending',
        notes: transaction.notes,
    };

    setTransactions(prevTransactions => {
        const updatedTransactions = [newTransaction, ...prevTransactions];
        updateLocalStorage(updatedTransactions);
        return updatedTransactions;
    });

    return newTransaction.id;
  };

  const updateTransactionStatus = (id: string, status: TransactionStatus, hash?: string) => {
      setTransactions(prev => {
          const updated = prev.map(tx => {
              if (tx.id === id) {
                  return { ...tx, status, hash: hash || tx.hash };
              }
              return tx;
          });
          updateLocalStorage(updated);
          return updated;
      })
  }

  const resetTransactions = () => {
    setTransactions([]);
    localStorage.removeItem(TRANSACTIONS_KEY);
  }

  return (
    <TransactionContext.Provider value={{ transactions, recordTransaction, updateTransactionStatus, resetTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }

  const hasSentTransaction = context.transactions.some(t => t.type === 'sent');
  
  const recentRecipients = useMemo(() => {
      const sentTransactions = context.transactions.filter(t => t.type === 'sent' && t.status === 'completed');
      const uniquePhones = [...new Set(sentTransactions.map(t => t.phone))];
      return uniquePhones.slice(0, 5); // Return the top 5 most recent unique recipients
  }, [context.transactions]);
  
  return { ...context, hasSentTransaction, recentRecipients };
};
