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
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col relative`}
      >
        {/* Subtle pattern background */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/pattern-bg.png)',
            backgroundSize: '600px',
            backgroundRepeat: 'repeat',
            opacity: 0.04,
            filter: 'blur(1px)',
          }}
          aria-hidden="true"
        />
        <Providers>
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
