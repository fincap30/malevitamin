import type { Metadata } from "next";
import { MiniSitePage } from "@/components/mini-site-page";

export const metadata: Metadata = {
  title: "Natural Libido Enhancer for Men South Africa | Boost Your Sex Drive | Male Vitamin",
  description:
    "Lost your sex drive? Male Vitamin's natural libido enhancer uses Tribulus, Maca & Fenugreek to reignite your desire and passion. R 850.00 — South Africa.",
  keywords: [
    "libido enhancer for men",
    "increase sex drive naturally",
    "low libido treatment",
    "male libido supplement South Africa",
    "boost sex drive",
  ],
  openGraph: {
    title: "Natural Libido Enhancer for Men South Africa | Boost Your Sex Drive | Male Vitamin",
    description:
      "Lost your sex drive? Male Vitamin's natural libido enhancer uses Tribulus, Maca & Fenugreek to reignite your desire and passion. R 850.00 — South Africa.",
    url: "https://malevitamin.co.za/libido-enhancer",
    images: [
      {
        url: "/product-image.webp",
        width: 1200,
        height: 630,
        alt: "Male Vitamin Libido Enhancer — Reignite Your Desire Naturally",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Natural Libido Enhancer for Men South Africa | Boost Your Sex Drive | Male Vitamin",
    description: "Lost your sex drive? Reignite your desire and passion naturally. R 850.00 — South Africa.",
    images: ["/product-image.webp"],
  },
  alternates: {
    canonical: "https://malevitamin.co.za/libido-enhancer",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Male Vitamin — Libido Enhancer",
      description:
        "Natural libido enhancer with Tribulus Terrestris, Maca Root, Fenugreek Extract & Ginseng to reignite your desire and passion.",
      image: "https://malevitamin.co.za/product-image.webp",
      brand: { "@type": "Brand", name: "Male Vitamin" },
      offers: {
        "@type": "Offer",
        price: "850.00",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
        url: "https://malevitamin.co.za/libido-enhancer",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why has my sex drive decreased?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Libido loss is rarely caused by just one thing — it's usually a combination of factors that build up over time. Declining testosterone levels (which drop about 1% per year after 30), chronic stress and elevated cortisol, poor sleep quality, relationship issues, certain medications, and nutritional deficiencies all contribute. The good news is that most of these factors are addressable through proper nutritional support. When you give your body the right ingredients, it can restore the hormonal balance and energy levels that drive a healthy sex drive.",
          },
        },
        {
          "@type": "Question",
          name: "Does Tribulus really increase libido?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — Tribulus Terrestris is one of the most well-researched herbs for male libido enhancement. It works primarily by supporting luteinizing hormone (LH) production, which signals your testes to produce more testosterone — the primary hormone driving male sex drive. Multiple clinical studies have shown significant improvements in sexual desire and satisfaction in men taking Tribulus. It's been used in Ayurvedic and Traditional Chinese Medicine for centuries specifically for this purpose, and modern science has validated what traditional healers knew all along.",
          },
        },
        {
          "@type": "Question",
          name: "How long before my drive comes back?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most men start feeling the first sparks of returning desire within 1-2 weeks. By week 3-4, you'll typically notice a significant increase in spontaneous sexual thoughts and a stronger urge to initiate intimacy. The full libido-restoring effects usually peak around 6-8 weeks as your hormonal balance recalibrates. Your sex drive didn't disappear overnight, and it won't return overnight either — but with consistent daily use, you can expect a steady, noticeable improvement that keeps building.",
          },
        },
        {
          "@type": "Question",
          name: "Is this safe with other medications?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Male Vitamin uses natural ingredients with strong safety profiles. However, if you're taking prescription medications — particularly blood pressure medications, antidepressants, or hormone therapies — you should consult your healthcare provider before starting any supplement. Some ingredients like Tribulus can have mild interactions with certain medications. We always recommend being transparent with your doctor about any supplements you're taking. That said, our formula is designed to work with your body's natural systems, not against them.",
          },
        },
        {
          "@type": "Question",
          name: "Will this help with desire or just performance?",
          answeredAnswer: {
            "@type": "Answer",
            text: "Male Vitamin specifically targets both desire AND performance — but the libido-enhancing effects are where this formula really shines. Tribulus Terrestris and Maca Root are both clinically shown to increase sexual desire specifically, not just physical capability. You'll notice more spontaneous sexual thoughts, a stronger urge to initiate intimacy, and a renewed sense of passion that goes beyond just 'being able to perform.' This is about reigniting the fire, not just fixing the plumbing.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://malevitamin.co.za" },
        { "@type": "ListItem", position: 2, name: "Libido Enhancer", item: "https://malevitamin.co.za/libido-enhancer" },
      ],
    },
  ],
};

export default function LibidoEnhancerPage() {
  return (
    <MiniSitePage
      pageTitle="Natural Libido Enhancer South Africa"
      pageDescription="Lost your sex drive? Male Vitamin's natural libido enhancer uses Tribulus, Maca & Fenugreek to reignite your desire and passion."
      canonicalUrl="https://malevitamin.co.za/libido-enhancer"
      heroH1="LIBIDO ENHANCER THAT REIGNITES YOUR DESIRE"
      heroSubheadline="Remember when you couldn't stop thinking about sex? When desire hit you like a wave and you actually acted on it? That fire doesn't have to be gone — it's just been smothered by stress, aging, and hormonal decline. Male Vitamin's libido formula combines Tribulus, Maca, Fenugreek, and Ginseng to wake up your desire from the inside out. Not a temporary stimulant — a genuine reignition of your natural drive."
      heroBadge="Desire Restorer"
      problemTitle="THE DESIRE THAT DISAPPEARED"
      problemDescription="A declining sex drive doesn't just affect your bedroom life — it changes how you feel about yourself as a man. The passion you once took for granted has been replaced by indifference, and it's eroding your relationship and your identity."
      problemPoints={[
        {
          icon: "Flame",
          title: "THE FIRE IS OUT",
          description:
            "You used to think about sex constantly. Now it barely crosses your mind. Your partner initiates and you make excuses — you're tired, you're stressed, you're not in the mood. But deep down, you know the real reason: your body's desire mechanism has been switched off, and you don't know how to turn it back on.",
        },
        {
          icon: "Heart",
          title: "YOUR RELATIONSHIP IS SUFFERING",
          description:
            "When one partner loses their sex drive, both people suffer. Your partner feels rejected, unattractive, and confused. You feel guilty, defensive, and inadequate. The distance grows, the intimacy fades, and what was once a passionate relationship becomes a polite coexistence. This is not what either of you signed up for.",
        },
        {
          icon: "Eye",
          title: "YOU'VE LOST THAT SPARK",
          description:
            "It's not just about wanting sex — it's about the spark that makes you feel alive. That magnetic attraction, that hunger, that primal drive that made you feel like a man. When your libido disappears, you lose a piece of your identity. You stop feeling desirable, you stop pursuing, and you settle into a version of yourself you don't even recognize.",
        },
      ]}
      howItWorksTitle="HOW MALE VITAMINE REIGNITES YOUR DESIRE"
      howItWorksSteps={[
        {
          step: 1,
          title: "RESTORE THE HORMONAL SIGNAL",
          description:
            "Tribulus Terrestris supports luteinizing hormone production — the signal your brain sends to your testes to produce testosterone. More LH means more T, and more T means a stronger, more consistent sex drive. This is the foundational signal that drives male desire, and it's the first thing we restore.",
        },
        {
          step: 2,
          title: "WAKE UP THE DESIRE CENTERS",
          description:
            "Maca Root and Fenugreek Extract work on the neurochemical pathways that control sexual desire. Maca has been shown to increase dopamine and noradrenaline in the brain's pleasure centers, while Fenugreek supports the hormonal environment that keeps those desire signals firing. Together, they reignite the mental and physical urge for intimacy.",
        },
        {
          step: 3,
          title: "SUSTAIN PASSION LONG-TERM",
          description:
            "Ginseng Extract rounds out the formula by reducing stress hormones (which kill libido) and improving overall energy and vitality. Chronic stress is the #1 libido killer in men — Ginseng helps your body manage it so your desire can stay turned on. The result is not a temporary spike but a sustained, reliable sex drive you can count on.",
        },
      ]}
      keyIngredients={[
        {
          name: "TRIBULUS TERRESTRIS",
          description:
            "A powerful plant extract used for centuries to ignite male drive and enhance libido. Tribulus supports the LH-testosterone pathway that is the hormonal foundation of male sexual desire. Without adequate signaling here, your body simply won't produce the urge for intimacy.",
          icon: "Dumbbell",
          benefit: "Primary Libido Activator",
        },
        {
          name: "MACA ROOT",
          description:
            "The ancient desire secret from the Peruvian highlands. Maca Root has been shown to increase sexual desire by influencing dopamine and other neurochemicals in the brain's pleasure centers. It doesn't just make you physically capable — it makes you genuinely want it.",
          icon: "Zap",
          benefit: "Desire Neurochemical Support",
        },
        {
          name: "FENUGREEK EXTRACT",
          description:
            "A proven testosterone supporter that directly impacts sex drive. Studies show Fenugreek significantly improves libido and sexual function in men by supporting the hormonal environment needed for a healthy, active sex drive. It also helps maintain testosterone levels that fuel desire.",
          icon: "Pill",
          benefit: "Hormonal Desire Support",
        },
        {
          name: "GINSENG EXTRACT",
          description:
            "An adaptogen that reduces cortisol and stress hormones — the primary libido killers in modern men. By helping your body manage stress, Ginseng creates the mental and physical space for desire to return. It also improves energy and vitality, so you have the drive to act on your urges.",
          icon: "Target",
          benefit: "Stress & Desire Manager",
        },
      ]}
      faqs={[
        {
          question: "Why has my sex drive decreased?",
          answer:
            "Libido loss is rarely caused by just one thing — it's usually a combination of factors that build up over time. Declining testosterone levels (which drop about 1% per year after 30), chronic stress and elevated cortisol, poor sleep quality, relationship issues, certain medications, and nutritional deficiencies all contribute. The good news is that most of these factors are addressable through proper nutritional support. When you give your body the right ingredients, it can restore the hormonal balance and energy levels that drive a healthy sex drive.",
        },
        {
          question: "Does Tribulus really increase libido?",
          answer:
            "Yes — Tribulus Terrestris is one of the most well-researched herbs for male libido enhancement. It works primarily by supporting luteinizing hormone (LH) production, which signals your testes to produce more testosterone — the primary hormone driving male sex drive. Multiple clinical studies have shown significant improvements in sexual desire and satisfaction in men taking Tribulus. It's been used in Ayurvedic and Traditional Chinese Medicine for centuries specifically for this purpose, and modern science has validated what traditional healers knew all along.",
        },
        {
          question: "How long before my drive comes back?",
          answer:
            "Most men start feeling the first sparks of returning desire within 1-2 weeks. By week 3-4, you'll typically notice a significant increase in spontaneous sexual thoughts and a stronger urge to initiate intimacy. The full libido-restoring effects usually peak around 6-8 weeks as your hormonal balance recalibrates. Your sex drive didn't disappear overnight, and it won't return overnight either — but with consistent daily use, you can expect a steady, noticeable improvement that keeps building.",
        },
        {
          question: "Is this safe with other medications?",
          answer:
            "Male Vitamin uses natural ingredients with strong safety profiles. However, if you're taking prescription medications — particularly blood pressure medications, antidepressants, or hormone therapies — you should consult your healthcare provider before starting any supplement. Some ingredients like Tribulus can have mild interactions with certain medications. We always recommend being transparent with your doctor about any supplements you're taking. That said, our formula is designed to work with your body's natural systems, not against them.",
        },
        {
          question: "Will this help with desire or just performance?",
          answer:
            "Male Vitamin specifically targets both desire AND performance — but the libido-enhancing effects are where this formula really shines. Tribulus Terrestris and Maca Root are both clinically shown to increase sexual desire specifically, not just physical capability. You'll notice more spontaneous sexual thoughts, a stronger urge to initiate intimacy, and a renewed sense of passion that goes beyond just 'being able to perform.' This is about reigniting the fire, not just fixing the plumbing.",
        },
      ]}
      currentSlug="libido-enhancer"
      jsonLd={jsonLd}
    />
  );
}
