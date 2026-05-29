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
  metadataBase: new URL("https://malevitamin.co.za"),
  title: "Male Vitamin - Erectile Dysfunction & Libido Supplement South Africa",
  description:
    "Struggling with erectile dysfunction or low libido? Male Vitamin's natural supplement uses L-Arginine, Tribulus, Maca Root & Ginseng for harder erections, stronger libido and lasting stamina. R 850.00 — South Africa.",
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
  openGraph: {
    type: "website",
    siteName: "Male Vitamin",
    title: "Male Vitamin - Erectile Dysfunction & Libido Supplement South Africa",
    description:
      "Struggling with erectile dysfunction or low libido? Male Vitamin's natural supplement uses L-Arginine, Tribulus, Maca Root & Ginseng for harder erections, stronger libido and lasting stamina. R 850.00 — South Africa.",
    url: "https://malevitamin.co.za",
    images: [
      {
        url: "/product-image.webp",
        width: 1200,
        height: 630,
        alt: "Male Vitamin - Premium Erectile Dysfunction & Libido Supplement",
      },
    ],
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Male Vitamin - Erectile Dysfunction & Libido Supplement South Africa",
    description:
      "Struggling with erectile dysfunction or low libido? Male Vitamin's natural supplement uses L-Arginine, Tribulus, Maca Root & Ginseng for harder erections, stronger libido and lasting stamina.",
    images: ["/product-image.webp"],
  },
  alternates: {
    canonical: "https://malevitamin.co.za",
  },
  robots: {
    index: true,
    follow: true,
  googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
