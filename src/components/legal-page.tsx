import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared layout for all legal / policy / support pages.             */
/*  Keeps the black & gold brand theme consistent across:            */
/*  privacy-policy, terms-of-service, disclaimer, faqs,              */
/*  shipping, returns.                                                */
/* ------------------------------------------------------------------ */

export const SUPPORT_EMAIL = "support@malevitamin.co.za";
export const PRIVACY_EMAIL = "privacy@malevitamin.co.za";
export const RETURNS_EMAIL = "returns@malevitamin.co.za";
export const SUPPORT_WHATSAPP_DISPLAY = "+27 83 390 7059";
export const SUPPORT_WHATSAPP_LINK = "https://wa.me/27833907059";

type LegalPageProps = {
  title: string;
  /** Short subtitle shown under the title. */
  intro?: string;
  /** ISO-ish display date, e.g. "10 June 2026". */
  lastUpdated?: string;
  children: React.ReactNode;
};

export function LegalPage({ title, intro, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gold/10 bg-background/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/api/logo"
              alt="Male Vitamin Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-base font-black tracking-widest text-gold uppercase">
              Male Vitamin
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground/50 hover:text-gold transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Title block */}
          <div className="mb-10 border-b border-gold/10 pb-8">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold/60 mb-3">
              Male Vitamin
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              {title}
            </h1>
            {intro && (
              <p className="mt-4 text-base sm:text-lg text-foreground/50 font-light leading-relaxed max-w-2xl">
                {intro}
              </p>
            )}
            {lastUpdated && (
              <p className="mt-4 text-xs font-bold tracking-widest uppercase text-foreground/30">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="legal-prose">{children}</div>

          {/* Back link */}
          <div className="mt-14 pt-8 border-t border-gold/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Male Vitamin
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <LegalFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable content primitives (kept simple + on-brand).             */
/* ------------------------------------------------------------------ */

export function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-9">
      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gold mb-4">
        {heading}
      </h2>
      <div className="space-y-4 text-foreground/70 font-light leading-relaxed text-[15px] sm:text-base">
        {children}
      </div>
    </section>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base sm:text-lg font-bold text-foreground/90 mt-6 mb-2">
      {children}
    </h3>
  );
}

export function Callout({
  variant = "gold",
  title,
  children,
}: {
  variant?: "gold" | "warning";
  title?: string;
  children: React.ReactNode;
}) {
  const styles =
    variant === "warning"
      ? "border-red-500/30 bg-red-500/[0.06]"
      : "border-gold/25 bg-gold/[0.05]";
  return (
    <div className={`my-6 rounded-xl border ${styles} p-5 sm:p-6`}>
      {title && (
        <p className="text-sm font-black tracking-widest uppercase text-gold mb-2">
          {title}
        </p>
      )}
      <div className="text-foreground/70 font-light leading-relaxed text-[15px] space-y-3">
        {children}
      </div>
    </div>
  );
}

export function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5 my-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-foreground/70 font-light leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact footer for legal pages.                                   */
/* ------------------------------------------------------------------ */

function LegalFooter() {
  const groups: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "Solutions",
      links: [
        { label: "Natural ED Supplement", href: "/ed-supplement" },
        { label: "Testosterone Booster", href: "/testosterone-booster" },
        { label: "Stamina Supplement", href: "/stamina-supplement" },
        { label: "Libido Enhancer", href: "/libido-enhancer" },
        { label: "Male Performance", href: "/male-performance" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "FAQs", href: "/faqs" },
        { label: "Shipping", href: "/shipping" },
        { label: "Returns", href: "/returns" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-service" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ];

  return (
    <footer className="bg-[#050504] border-t border-gold/10 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/api/logo"
                alt="Male Vitamin Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-black tracking-widest text-gold uppercase">
                Male Vitamin
              </span>
            </div>
            <p className="text-sm text-foreground/30 leading-relaxed font-light">
              Premium men&apos;s performance supplement — stronger stamina,
              harder results, and the confidence to back it up.
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.heading}>
              <h4 className="font-black text-xs tracking-widest uppercase text-gold/60 mb-4">
                {g.heading}
              </h4>
              <ul className="space-y-2 text-sm text-foreground/30 font-light">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-gold transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-gold/5 text-center text-xs text-foreground/20 font-bold tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} Male Vitamin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
