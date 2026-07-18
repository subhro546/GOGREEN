"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../src/context/CartContext";
import { ThemeProvider } from "../src/context/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
