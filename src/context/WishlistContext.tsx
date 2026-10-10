"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  mrp?: number | null;
  image?: string;
  category: string;
  description?: string | null;
  stock?: number;
  isIndoor?: boolean;
  shippingCharge?: number | null;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => boolean;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage
  useEffect(() => {
    setIsMounted(true);
    const savedWishlist = localStorage.getItem("gogreen_wishlist");
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist from local storage", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("gogreen_wishlist", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = (item: WishlistItem) => {
    setItems((prevItems) => {
      if (prevItems.some((i) => i.id === item.id)) return prevItems;
      return [item, ...prevItems];
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const toggleWishlist = (item: WishlistItem): boolean => {
    const exists = items.some((i) => i.id === item.id);
    if (exists) {
      removeItem(item.id);
      return false;
    } else {
      addItem(item);
      return true;
    }
  };

  const isInWishlist = (id: string): boolean => {
    return items.some((i) => i.id === id);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
