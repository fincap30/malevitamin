import type { Metadata } from "next";
import { MiniSitePage } from "@/components/mini-site-page";

export const metadata: Metadata = {
  title: "Male Stamina Supplement South Africa | Last Longer in Bed | Male Vitamin",
  description:
    "Finish too soon? Male Vitamin's stamina formula uses Maca Root, Ginseng & L-Arginine to help you last longer and perform stronger. R 850.00 — Order in South Africa.",
  keywords: [
    "male stamina supplement",
    "last longer in bed supplement",
    "stamina pills for men",
    "increase stamina naturally",
    "endurance supplement South Africa",
  ],
  openGraph: {
    title: "Male Stamina Supplement South Africa | Last Longer in Bed | Male Vitamin",
    description:
      "Finish too soon? Male Vitamin's stamina formula uses Maca Root, Ginseng & L-Arginine to help you last longer and perform stronger. R 850.00 — Order in South Africa.",
    url: "https://malevitamin.co.za/stamina-supplement",
  },
  alternates: {
    canonical: "https://malevitamin.co.za/stamina-supplement",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Male Vitamin — Stamina Supplement",
      description:
        "Natural male stamina supplement with Maca Root, Ginseng Extract, L-Arginine & Fenugreek to help you last longer and perform stronger.",
      image: "https://malevitamin.co.za/product-image.webp",
      brand: { "@type": "Brand", name: "Male Vitamin" },
      offers: {
        "@type": "Offer",
        price: "850.00",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
        url: "https://malevitamin.co.za/stamina-supplement",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How can I last longer naturally?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Lasting longer comes down to three things: blood flow control, fatigue resistance, and hormonal balance. Natural supplements that boost nitric oxide (like L-Arginine) improve blood flow for sustained erections. Adaptogens like Ginseng and Maca Root help your body resist fatigue — both physical and mental. And testosterone-supporting ingredients like Fenugreek ensure your hormonal environment is optimized for endurance. Unlike delay sprays that just numb you, this approach addresses the root causes of finishing too fast.",
          },
        },
        {
          "@type": "Question",
          name: "Does Maca Root really help stamina?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — Maca Root has been extensively studied for its effects on stamina and endurance. Indigenous Peruvians have used it for thousands of years to enhance physical endurance and sexual stamina. Modern research confirms these effects: a systematic review of clinical trials found that Maca significantly improved sexual desire and stamina in men. It works as an adaptogen, helping your body adapt to stress and maintain energy levels for longer periods — exactly what you need when the moment demands more.",
          },
        },
        {
          "@type": "Question",
          name: "How is this different from delay sprays?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delay sprays work by numbing your penis with lidocaine or benzocaine — they reduce sensation so you take longer to finish. The problem? They also reduce pleasure for both you and your partner, can cause transfer numbness, and don't address why you're finishing fast in the first place. Male Vitamin takes a completely different approach: it improves your body's natural stamina capacity through better blood flow, fatigue resistance, and hormonal support. You feel everything — you just last longer because your body is actually performing better.",
          },
        },
        {
          "@type": "Question",
          name: "Will it give me more energy overall?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. The ingredients in Male Vitamin that improve bedroom stamina also improve your overall energy and endurance. Maca Root is famous for boosting daily energy levels and reducing fatigue. Ginseng is one of the most well-researched adaptogens for improving physical and mental stamina. L-Arginine improves blood flow throughout your entire body, not just the bedroom. Many of our customers report better gym performance, sharper focus at work, and more energy throughout the day — the bedroom benefits are just the most noticeable.",
          },
        },
        {
          "@type": "Question",
          name: "How quickly will I notice a difference?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Many men notice improved energy and endurance within the first week. By week 2-3, most users report lasting noticeably longer in bed and having more stamina for round two. The full effects build over 4-8 weeks as the ingredients reach optimal levels in your system. Unlike quick-fix solutions that wear off, Male Vitamin's effects get stronger over time because you're building genuine physical stamina — not just masking a problem.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://malevitamin.co.za" },
        { "@type": "ListItem", position: 2, name: "Stamina Supplement", item: "https://malevitamin.co.za/stamina-supplement" },
      ],
    },
  ],
};

export default function StaminaSupplementPage() {
  return (
    <MiniSitePage
      pageTitle="Male Stamina Supplement South Africa"
      pageDescription="Finish too soon? Male Vitamin's stamina formula uses Maca Root, Ginseng & L-Arginine to help you last longer and perform stronger."
      canonicalUrl="https://malevitamin.co.za/stamina-supplement"
      heroH1="STAMINA SUPPLEMENT FOR MEN WHO GO THE DISTANCE"
      heroSubheadline="Finishing before you're ready is not just embarrassing — it's robbing you and your partner of the experience you both deserve. Male Vitamin's stamina formula combines Maca Root, Ginseng, L-Arginine, and Fenugreek to supercharge your endurance so you can last longer, go harder, and deliver the performance she'll remember. No numbing sprays, no band-aids — just real, natural stamina."
      heroBadge="Endurance Formula"
      problemTitle="FINISHING TOO SOON DESTROYS EVERYTHING"
      problemDescription="Premature finishing isn't just a physical problem — it's an intimacy killer. Every time you cut things short, you're chipping away at your confidence, your partner's satisfaction, and your own self-respect."
      problemPoints={[
        {
          icon: "Clock",
          title: "OVER BEFORE IT STARTS",
          description:
            "You know the feeling — the excitement builds, and before you know it, it's over. You're left frustrated, she's left unsatisfied, and the awkward silence says everything. The root cause is usually a combination of poor ejaculatory control and fatigue that your body hasn't been trained to overcome.",
        },
        {
          icon: "Activity",
          title: "NO STAMINA FOR ROUND TWO",
          description:
            "Even when you manage to perform the first time, your body has nothing left for an encore. Recovery takes too long, and by the time you're ready again, the moment has passed. This isn't how it's supposed to be — your body should be capable of more.",
        },
        {
          icon: "RefreshCw",
          title: "FATIGUE KILLS PERFORMANCE",
          description:
            "Physical and mental fatigue are the silent killers of bedroom performance. When your energy reserves are depleted, your body prioritizes survival over performance. Stress, poor sleep, and nutritional deficiencies all contribute to the exhaustion that makes you finish fast and recover slow.",
        },
      ]}
      howItWorksTitle="HOW MALE VITAMINE BUILDS YOUR ENDURANCE"
      howItWorksSteps={[
        {
          step: 1,
          title: "SUPERCHARGE BLOOD FLOW FOR STAYING POWER",
          description:
            "L-Arginine boosts nitric oxide production, improving blood flow and helping you maintain stronger erections for longer. Better circulation means your body can sustain the physical demands of extended performance without losing firmness or control.",
        },
        {
          step: 2,
          title: "RESIST FATIGUE WITH ADAPTOGENS",
          description:
            "Ginseng Extract is a proven adaptogen that fights both physical and mental fatigue. It helps your body manage stress hormones and maintain energy reserves, so you can push through the moments where you'd normally tire out. More stamina means more control, and more control means you last longer.",
        },
        {
          step: 3,
          title: "BUILD DEEP ENDURANCE WITH MACA",
          description:
            "Maca Root has been used for millennia to build stamina from the ground up. It supports your body's energy production at the cellular level, improves hormonal balance, and helps you maintain peak performance for extended periods. This isn't a quick fix — it's genuine endurance that gets stronger with consistent use.",
        },
      ]}
      keyIngredients={[
        {
          name: "MACA ROOT",
          description:
            "The ancient stamina secret. Used for thousands of years in the Andes, Maca Root supercharges endurance, fuels your sex drive, and keeps your hormones in the zone that makes you feel unstoppable. It's the foundation of any real stamina formula.",
          icon: "Zap",
          benefit: "Endurance Builder",
        },
        {
          name: "GINSENG EXTRACT",
          description:
            "A battle-tested adaptogen that fights fatigue, sharpens performance under pressure, and keeps you going strong — round after round. Ginseng is one of the most researched herbs for improving physical and mental stamina in men.",
          icon: "Target",
          benefit: "Fatigue Fighter",
        },
        {
          name: "L-ARGININE",
          description:
            "The cornerstone of sustained performance. This amino acid boosts nitric oxide production, increasing blood flow for stronger, firmer erections that last. Better circulation means your body can maintain performance without losing intensity or control.",
          icon: "TrendingUp",
          benefit: "Blood Flow Optimizer",
        },
        {
          name: "FENUGREEK EXTRACT",
          description:
            "A proven testosterone supporter that ramps up your sex drive and enhances overall stamina. Fenugreek helps maintain the hormonal environment your body needs for sustained sexual performance, keeping your energy and desire at peak levels.",
          icon: "Pill",
          benefit: "Stamina Hormone Support",
        },
      ]}
      faqs={[
        {
          question: "How can I last longer naturally?",
          answer:
            "Lasting longer comes down to three things: blood flow control, fatigue resistance, and hormonal balance. Natural supplements that boost nitric oxide (like L-Arginine) improve blood flow for sustained erections. Adaptogens like Ginseng and Maca Root help your body resist fatigue — both physical and mental. And testosterone-supporting ingredients like Fenugreek ensure your hormonal environment is optimized for endurance. Unlike delay sprays that just numb you, this approach addresses the root causes of finishing too fast.",
        },
        {
          question: "Does Maca Root really help stamina?",
          answer:
            "Yes — Maca Root has been extensively studied for its effects on stamina and endurance. Indigenous Peruvians have used it for thousands of years to enhance physical endurance and sexual stamina. Modern research confirms these effects: a systematic review of clinical trials found that Maca significantly improved sexual desire and stamina in men. It works as an adaptogen, helping your body adapt to stress and maintain energy levels for longer periods — exactly what you need when the moment demands more.",
        },
        {
          question: "How is this different from delay sprays?",
          answer:
            "Delay sprays work by numbing your penis with lidocaine or benzocaine — they reduce sensation so you take longer to finish. The problem? They also reduce pleasure for both you and your partner, can cause transfer numbness, and don't address why you're finishing fast in the first place. Male Vitamin takes a completely different approach: it improves your body's natural stamina capacity through better blood flow, fatigue resistance, and hormonal support. You feel everything — you just last longer because your body is actually performing better.",
        },
        {
          question: "Will it give me more energy overall?",
          answer:
            "Absolutely. The ingredients in Male Vitamin that improve bedroom stamina also improve your overall energy and endurance. Maca Root is famous for boosting daily energy levels and reducing fatigue. Ginseng is one of the most well-researched adaptogens for improving physical and mental stamina. L-Arginine improves blood flow throughout your entire body, not just the bedroom. Many of our customers report better gym performance, sharper focus at work, and more energy throughout the day — the bedroom benefits are just the most noticeable.",
        },
        {
          question: "How quickly will I notice a difference?",
          answer:
            "Many men notice improved energy and endurance within the first week. By week 2-3, most users report lasting noticeably longer in bed and having more stamina for round two. The full effects build over 4-8 weeks as the ingredients reach optimal levels in your system. Unlike quick-fix solutions that wear off, Male Vitamin's effects get stronger over time because you're building genuine physical stamina — not just masking a problem.",
        },
      ]}
      currentSlug="stamina-supplement"
      jsonLd={jsonLd}
    />
  );
}
