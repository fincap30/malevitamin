import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Male Vitamine - Erectile Dysfunction & Libido Supplement South Africa",
  description:
    "Struggling with erectile dysfunction or low libido? Male Vitamine's natural supplement uses L-Arginine, Tribulus, Maca Root & Ginseng for harder erections, stronger libido and lasting stamina. R 850.00 — South Africa.",
  keywords: [
    "erectile dysfunction supplement",
    "ED supplement South Africa",
    "libido enhancer",
    "low libido treatment",
    "male performance supplement",
    "men's vitality",
    "harder erections",
    "sex drive booster",
    "natural ED treatment",
    "testosterone booster South Africa",
    "stamina supplement",
    "male enhancement",
    "wellness",
    "energy",
    "confidence",
  ],
  icons: {
    icon: "/product-image.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
