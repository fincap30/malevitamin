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

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Male Vitamin",
      url: "https://malevitamin.co.za",
      logo: "https://malevitamin.co.za/product-image.webp",
      description:
        "Male Vitamin offers natural male enhancement supplements for erectile dysfunction, low libido, and stamina — delivered across South Africa.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        areaServed: "ZA",
        availableLanguage: "English",
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      name: "Male Vitamin",
      url: "https://malevitamin.co.za",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://malevitamin.co.za/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Product",
      name: "Male Vitamin — Erectile Dysfunction & Libido Supplement",
      description:
        "Natural male supplement with L-Arginine, Tribulus Terrestris, Maca Root, Ginseng Extract, Zinc & Fenugreek for harder erections, stronger libido and lasting stamina. R 850.00 — South Africa.",
      image: "https://malevitamin.co.za/product-image.webp",
      brand: { "@type": "Brand", name: "Male Vitamin" },
      offers: {
        "@type": "Offer",
        price: "850.00",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
        url: "https://malevitamin.co.za",
        priceValidUntil: "2027-12-31",
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "ZA",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
            transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
          },
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "247",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
