import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "../../components/Providers";
import TopBar from "../../components/TopBar";
import WhatsAppWidget from "../../components/WhatsAppWidget";
import NavigationProgress from "../../components/NavigationProgress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GOGREEN Nursery - Premium Plants for Your Home",
  description: "Shop beautiful, premium plants and gardening accessories at GOGREEN Nursery. Elevate your space with nature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <TopBar />
          {children}
          <WhatsAppWidget />
        </Providers>
      </body>
    </html>
  );
}
