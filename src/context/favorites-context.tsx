
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export interface Favorite {
    phone: string;
    name?: string; // Optional: for users to add a nickname
}

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (phone: string) => void;
  isFavorite: (phone: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = 'favorites_contacts';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_KEY);
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error("Failed to parse favorites from localStorage", error);
            setFavorites([]);
        }
    }
  }, []);

  const updateLocalStorage = (updatedFavorites: Favorite[]) => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  }

  const addFavorite = useCallback((favorite: Favorite) => {
    setFavorites(prevFavorites => {
        // Avoid adding duplicates
        if (prevFavorites.some(f => f.phone === favorite.phone)) {
            return prevFavorites;
        }
        const updatedFavorites = [...prevFavorites, favorite];
        updateLocalStorage(updatedFavorites);
        return updatedFavorites;
    });
  }, []);

  const removeFavorite = useCallback((phone: string) => {
    setFavorites(prevFavorites => {
        const updatedFavorites = prevFavorites.filter(f => f.phone !== phone);
        updateLocalStorage(updatedFavorites);
        return updatedFavorites;
    });
  }, []);

  const isFavorite = useCallback((phone: string) => {
    return favorites.some(f => f.phone === phone);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
