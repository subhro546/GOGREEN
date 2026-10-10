"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../src/context/CartContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import { WishlistProvider } from "../src/context/WishlistContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
