import type { Metadata } from "next";
import { MiniSitePage } from "@/components/mini-site-page";

export const metadata: Metadata = {
  title: "Libido Upliftment South Africa | Restore Your Sex Drive Naturally | Male Vitamin",
  description:
    "Need libido upliftment? Male Vitamin's natural formula uses Tribulus, Maca Root & Fenugreek to uplift your sex drive, reignite passion, and restore desire naturally. R 850.00 — Order now in South Africa.",
  keywords: [
    "libido upliftment",
    "upliftment of libido",
    "libido upliftment supplement South Africa",
    "restore sex drive",
    "increase libido naturally",
    "libido upliftment for men",
    "low libido treatment",
  ],
  openGraph: {
    title: "Libido Upliftment South Africa | Restore Your Sex Drive Naturally | Male Vitamin",
    description:
      "Need libido upliftment? Male Vitamin's natural formula uses Tribulus, Maca Root & Fenugreek to uplift your sex drive, reignite passion, and restore desire naturally. R 850.00 — Order now in South Africa.",
    url: "https://malevitamin.co.za/libido-upliftment",
  },
  alternates: {
    canonical: "https://malevitamin.co.za/libido-upliftment",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Male Vitamin — Libido Upliftment",
      description:
        "Natural libido upliftment supplement with Tribulus Terrestris, Maca Root, Fenugreek Extract & Ginseng to uplift your sex drive, reignite passion, and restore desire.",
      image: "https://malevitamin.co.za/product-image.webp",
      brand: { "@type": "Brand", name: "Male Vitamin" },
      offers: {
        "@type": "Offer",
        price: "850.00",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
        url: "https://malevitamin.co.za/libido-upliftment",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is libido upliftment and how does it work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Libido upliftment is the process of restoring and elevating your natural sex drive using targeted nutritional support. Unlike temporary stimulants, libido upliftment works by addressing the root causes of low desire: declining testosterone, disrupted hormonal signaling, stress-induced cortisol elevation, and neurochemical imbalances. Male Vitamin's libido upliftment formula uses Tribulus Terrestris to restore the LH-testosterone signal, Maca Root to activate desire centers in the brain, Fenugreek to support the hormonal environment, and Ginseng to reduce stress hormones that kill libido. The result is a genuine, sustained upliftment of your sex drive — not a temporary spike.",
          },
        },
        {
          "@type": "Question",
          name: "How long does libido upliftment take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Libido upliftment is a gradual process, not an overnight fix — but you'll start feeling the first changes within 1-2 weeks. Most men notice more spontaneous sexual thoughts and a mild increase in desire by the end of week one. By weeks 3-4, the upliftment becomes significant — you'll feel a genuine return of the urge and passion that you thought was gone. The full libido upliftment effects typically peak around 6-8 weeks as your hormonal balance fully recalibrates. This is a sustainable approach that builds real, lasting desire rather than a temporary chemical spike.",
          },
        },
        {
          "@type": "Question",
          name: "Is libido upliftment different from just taking a stimulant?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. Stimulants force a temporary response by artificially spiking certain chemicals in your body, then you crash back down. Libido upliftment is fundamentally different — it works by restoring the natural hormonal and neurochemical environment that drives healthy desire. Think of it like this: a stimulant is like revving an engine with the clutch in — lots of noise, no movement. Libido upliftment is like fixing the engine so it runs properly on its own. Male Vitamin's formula gives your body the raw materials it needs to produce testosterone, activate desire pathways, and manage stress — so your sex drive returns naturally and sustainably.",
          },
        },
        {
          "@type": "Question",
          name: "Can libido upliftment help my relationship?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Libido upliftment can be transformational for relationships affected by desire mismatch. When one partner loses their sex drive, both people suffer — the higher-drive partner feels rejected and unattractive, while the lower-drive partner feels guilty and pressured. Libido upliftment addresses this at the source by restoring your natural desire. Men who have experienced libido upliftment with Male Vitamin report not just better sex lives, but better communication, more affection, and a deeper emotional connection with their partners. When the desire returns, everything else improves too.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need a prescription?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Male Vitamin is a natural dietary supplement available without a prescription. All our ingredients are classified as food supplements in South Africa. You can order directly from our website and have it delivered discreetly to your door. No doctor visits, no pharmacy queues, no awkward conversations — just a straightforward online order with discreet packaging.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://malevitamin.co.za" },
        { "@type": "ListItem", position: 2, name: "Libido Upliftment", item: "https://malevitamin.co.za/libido-upliftment" },
      ],
    },
  ],
};

export default function LibidoUpliftmentPage() {
  return (
    <MiniSitePage
      pageTitle="Libido Upliftment South Africa"
      pageDescription="Need libido upliftment? Male Vitamin's natural formula uses Tribulus, Maca Root & Fenugreek to uplift your sex drive, reignite passion, and restore desire."
      canonicalUrl="https://malevitamin.co.za/libido-upliftment"
      heroH1="LIBIDO UPLIFTMENT THAT RESTORES YOUR DRIVE"
      heroSubheadline="Your sex drive doesn't have to fade away. Male Vitamin's libido upliftment formula doesn't just mask the problem — it genuinely uplifts your natural desire from the inside out. Tribulus Terrestris restores the hormonal signal for drive. Maca Root activates the brain's desire centers. Fenugreek supports the hormonal environment. Ginseng eliminates the stress that kills libido. This is true libido upliftment — not a temporary fix. Delivered discreetly anywhere in South Africa."
      heroBadge="Libido Upliftment"
      problemTitle="THE DRIVE THAT DISAPPEARED"
      problemDescription="A declining sex drive doesn't just affect your bedroom life — it changes how you feel about yourself as a man. Across South Africa, thousands of men have lost the passion they once took for granted. The desire that used to define them has been replaced by indifference, and it's eroding relationships, self-worth, and identity. Libido upliftment is not a luxury — it's a necessity for men who refuse to accept less."
      problemPoints={[
        {
          icon: "Flame",
          title: "YOUR DESIRE HAS FLATLINED",
          description:
            "You used to think about sex constantly. Now it barely crosses your mind. Your partner initiates and you make excuses — you're tired, you're stressed, you're not in the mood. But deep down, you know the real reason: your libido has flatlined, and you don't know how to revive it. This is the silent crisis that men don't talk about. Libido upliftment is the answer you've been looking for.",
        },
        {
          icon: "Heart",
          title: "YOUR RELATIONSHIP IS SUFFERING",
          description:
            "When your sex drive disappears, your relationship suffers on every level. Your partner feels rejected and unattractive. You feel guilty and defensive. The distance grows, the intimacy fades, and what was once a passionate relationship becomes a polite coexistence. This is happening in homes across South Africa right now — and libido upliftment can change it. When desire returns, everything else improves too.",
        },
        {
          icon: "Eye",
          title: "YOU'VE LOST A PIECE OF YOURSELF",
          description:
            "It's not just about wanting sex — it's about the primal drive that makes you feel alive and masculine. When your libido disappears, you lose a piece of your identity. You stop feeling desirable, you stop pursuing, and you settle into a version of yourself you don't even recognize. You deserve libido upliftment — because you deserve to feel like yourself again.",
        },
      ]}
      howItWorksTitle="HOW MALE VITAMINE UPLIFTS YOUR LIBIDO"
      howItWorksSteps={[
        {
          step: 1,
          title: "RESTORE THE DESIRE SIGNAL",
          description:
            "Libido upliftment starts with the LH-testosterone pathway. Tribulus Terrestris supports luteinizing hormone production — the signal your brain sends to your testes to produce testosterone. More LH means more T, and more T means a stronger, more consistent sex drive. This is the foundational signal that drives male desire, and it's the first thing we restore for genuine libido upliftment.",
        },
        {
          step: 2,
          title: "ACTIVATE THE DESIRE CENTERS",
          description:
            "Maca Root and Fenugreek Extract are the neurochemical engines of libido upliftment. Maca has been shown to increase dopamine and noradrenaline in the brain's pleasure and desire centers, while Fenugreek supports the hormonal environment that keeps those desire signals firing. Together, they create the mental and physical urge for intimacy — the hallmark of true libido upliftment.",
        },
        {
          step: 3,
          title: "ELIMINATE THE LIBIDO KILLERS",
          description:
            "Ginseng Extract is the final piece of the libido upliftment puzzle. Chronic stress and elevated cortisol are the #1 libido killers in modern men — they actively suppress testosterone production and shut down desire pathways. Ginseng is an adaptogen that helps your body manage stress, creating the mental and physical space for your uplifted libido to thrive long-term.",
        },
      ]}
      keyIngredients={[
        {
          name: "TRIBULUS TERRESTRIS",
          description:
            "The cornerstone of libido upliftment. Tribulus directly supports the LH-testosterone pathway that is the hormonal foundation of male sexual desire. Without this signaling pathway functioning properly, your body simply won't produce the urge for intimacy. Tribulus activates it naturally, making it the most important ingredient for sustained libido upliftment.",
          icon: "Dumbbell",
          benefit: "Libido Upliftment Activator",
        },
        {
          name: "MACA ROOT",
          description:
            "The desire activator from the Peruvian highlands. Maca Root is essential for libido upliftment because it works on the brain's desire centers, increasing dopamine and other neurochemicals that create the mental urge for sex. It doesn't just make you physically capable — it makes you genuinely want it. This is what separates true libido upliftment from mere performance enhancement.",
          icon: "Zap",
          benefit: "Desire Neurochemical Activator",
        },
        {
          name: "FENUGREEK EXTRACT",
          description:
            "A proven testosterone supporter that directly drives libido upliftment. Studies show Fenugreek significantly improves libido and sexual function in men by supporting the hormonal environment needed for a healthy, active sex drive. When your hormones are balanced, your natural desire returns — and that's the essence of libido upliftment.",
          icon: "Pill",
          benefit: "Hormonal Desire Support",
        },
        {
          name: "GINSENG EXTRACT",
          description:
            "The stress eliminator that protects your libido upliftment. Cortisol and stress hormones are the primary enemies of a healthy sex drive — they suppress testosterone and shut down desire pathways. Ginseng reduces cortisol and helps your body manage stress, creating the conditions for your uplifted libido to thrive sustainably.",
          icon: "Target",
          benefit: "Stress & Libido Protector",
        },
      ]}
      faqs={[
        {
          question: "What is libido upliftment and how does it work?",
          answer:
            "Libido upliftment is the process of restoring and elevating your natural sex drive using targeted nutritional support. Unlike temporary stimulants, libido upliftment works by addressing the root causes of low desire: declining testosterone, disrupted hormonal signaling, stress-induced cortisol elevation, and neurochemical imbalances. Male Vitamin's libido upliftment formula uses Tribulus Terrestris to restore the LH-testosterone signal, Maca Root to activate desire centers in the brain, Fenugreek to support the hormonal environment, and Ginseng to reduce stress hormones that kill libido. The result is a genuine, sustained upliftment of your sex drive — not a temporary spike.",
        },
        {
          question: "How long does libido upliftment take?",
          answer:
            "Libido upliftment is a gradual process, not an overnight fix — but you'll start feeling the first changes within 1-2 weeks. Most men notice more spontaneous sexual thoughts and a mild increase in desire by the end of week one. By weeks 3-4, the upliftment becomes significant — you'll feel a genuine return of the urge and passion that you thought was gone. The full libido upliftment effects typically peak around 6-8 weeks as your hormonal balance fully recalibrates. This is a sustainable approach that builds real, lasting desire rather than a temporary chemical spike.",
        },
        {
          question: "Is libido upliftment different from just taking a stimulant?",
          answer:
            "Absolutely. Stimulants force a temporary response by artificially spiking certain chemicals in your body, then you crash back down. Libido upliftment is fundamentally different — it works by restoring the natural hormonal and neurochemical environment that drives healthy desire. Think of it like this: a stimulant is like revving an engine with the clutch in — lots of noise, no movement. Libido upliftment is like fixing the engine so it runs properly on its own. Male Vitamin's formula gives your body the raw materials it needs to produce testosterone, activate desire pathways, and manage stress — so your sex drive returns naturally and sustainably.",
        },
        {
          question: "Can libido upliftment help my relationship?",
          answer:
            "Libido upliftment can be transformational for relationships affected by desire mismatch. When one partner loses their sex drive, both people suffer — the higher-drive partner feels rejected and unattractive, while the lower-drive partner feels guilty and pressured. Libido upliftment addresses this at the source by restoring your natural desire. Men who have experienced libido upliftment with Male Vitamin report not just better sex lives, but better communication, more affection, and a deeper emotional connection with their partners. When the desire returns, everything else improves too.",
        },
        {
          question: "Do I need a prescription?",
          answer:
            "No. Male Vitamin is a natural dietary supplement available without a prescription. All our ingredients are classified as food supplements in South Africa. You can order directly from our website and have it delivered discreetly to your door. No doctor visits, no pharmacy queues, no awkward conversations — just a straightforward online order with discreet packaging.",
        },
      ]}
      currentSlug="libido-upliftment"
      jsonLd={jsonLd}
    />
  );
}
