import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "../../components/Providers";
import TopBar from "../../components/TopBar";
import WhatsAppWidget from "../../components/WhatsAppWidget";
import NavigationProgress from "../../components/NavigationProgress";
import BackgroundGrainient from "../../components/BackgroundGrainient";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col relative`}
      >
        <Providers>
          {/* Animated Grainient Background (Light green-to-white / Dark green-to-black) */}
          <BackgroundGrainient />
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <TopBar />
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
          <WhatsAppWidget />
        </Providers>
      </body>
    </html>
  );
}
