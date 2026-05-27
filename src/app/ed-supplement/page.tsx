import type { Metadata } from "next";
import { MiniSitePage } from "@/components/mini-site-page";

export const metadata: Metadata = {
  title: "Natural ED Supplement South Africa | Get Harder, Firmer Erections | Male Vitamin",
  description:
    "Struggling with ED? Male Vitamin's natural formula uses L-Arginine, Ginseng & Tribulus to boost blood flow for stronger, firmer erections. R 850.00 — Order now in South Africa.",
  keywords: [
    "natural ED supplement",
    "erectile dysfunction supplement South Africa",
    "ED treatment natural",
    "get harder erections",
    "firm erection supplement",
  ],
  openGraph: {
    title: "Natural ED Supplement South Africa | Get Harder, Firmer Erections | Male Vitamin",
    description:
      "Struggling with ED? Male Vitamin's natural formula uses L-Arginine, Ginseng & Tribulus to boost blood flow for stronger, firmer erections. R 850.00 — Order now in South Africa.",
    url: "https://malevitamin.co.za/ed-supplement",
  },
  alternates: {
    canonical: "https://malevitamin.co.za/ed-supplement",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Male Vitamin — Natural ED Supplement",
      description:
        "Natural erectile dysfunction supplement with L-Arginine, Ginseng Extract, Tribulus Terrestris & Zinc for stronger, firmer erections.",
      image: "https://malevitamin.co.za/product-image.webp",
      brand: { "@type": "Brand", name: "Male Vitamin" },
      offers: {
        "@type": "Offer",
        price: "850.00",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
        url: "https://malevitamin.co.za/ed-supplement",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does L-Arginine help with ED?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L-Arginine is an amino acid that your body converts into nitric oxide, a molecule that relaxes and widens blood vessels. This process, called vasodilation, increases blood flow to the penile tissue — which is the exact mechanism needed for achieving and maintaining a firm erection. Studies have shown that men taking L-Arginine experienced significant improvements in erectile function compared to placebo. It works with your body's natural systems rather than forcing a temporary response.",
          },
        },
        {
          "@type": "Question",
          name: "Is this a Viagra alternative?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Male Vitamin is a natural dietary supplement, not a pharmaceutical drug like Viagra. While Viagra works by blocking an enzyme for a temporary effect, our formula supports your body's natural blood flow and circulatory health over time. Many men prefer this approach because it works with their body rather than forcing a response, and it doesn't require a prescription. That said, if you have a medical condition causing your ED, you should consult your doctor.",
          },
        },
        {
          "@type": "Question",
          name: "How fast does it work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most men begin noticing improved blood flow and firmer erections within 2-4 weeks of consistent daily use. The L-Arginine starts working on nitric oxide production from day one, but the full effects build as the ingredients accumulate in your system. Unlike prescription medications that work in 30-60 minutes, this is a long-term approach that gets better with time. By month two, most users report significantly stronger and more reliable performance.",
          },
        },
        {
          "@type": "Question",
          name: "Is it safe to take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Male Vitamin is made from well-researched, natural ingredients that have been used safely for decades. L-Arginine, Ginseng, Tribulus Terrestris, and Zinc are all naturally occurring compounds with extensive safety data. Every batch is third-party tested for purity and potency. As with any supplement, if you're taking blood pressure medication or have a heart condition, consult your healthcare provider first since L-Arginine affects blood vessel dilation.",
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
        { "@type": "ListItem", position: 2, name: "Natural ED Supplement", item: "https://malevitamin.co.za/ed-supplement" },
      ],
    },
  ],
};

export default function EDSupplementPage() {
  return (
    <MiniSitePage
      pageTitle="Natural ED Supplement South Africa"
      pageDescription="Struggling with ED? Male Vitamin's natural formula uses L-Arginine, Ginseng & Tribulus to boost blood flow for stronger, firmer erections."
      canonicalUrl="https://malevitamin.co.za/ed-supplement"
      heroH1="NATURAL ED SUPPLEMENT THAT ACTUALLY WORKS"
      heroSubheadline="Struggling to get or stay firm? You're far from alone — and it doesn't have to be this way. Male Vitamin's clinically-backed formula supercharges nitric oxide production and blood flow, giving you stronger, firmer, longer-lasting erections without a prescription. The solution is natural, powerful, and built for men who refuse to underperform."
      heroBadge="ED Solution"
      problemTitle="THE SILENT CRISIS KILLING YOUR CONFIDENCE"
      problemDescription="Erectile dysfunction doesn't just affect your bedroom performance — it destroys your self-esteem, your relationships, and your sense of masculinity. The longer you ignore it, the worse it gets."
      problemPoints={[
        {
          icon: "AlertTriangle",
          title: "CAN'T GET FIRM ENOUGH",
          description:
            "Weak or inconsistent erections aren't just frustrating — they're a sign that blood flow to your penile tissue is compromised. Without proper circulation, achieving the firmness you need is nearly impossible, no matter how aroused you are.",
        },
        {
          icon: "Activity",
          title: "CAN'T STAY HARD",
          description:
            "Losing your erection midway through is one of the most confidence-crushing experiences a man can face. It's usually caused by insufficient nitric oxide levels and poor vascular health — problems that get worse with age and stress.",
        },
        {
          icon: "Gauge",
          title: "PERFORMANCE ANXIETY LOOP",
          description:
            "Every time you fail to perform, the anxiety compounds. You start anticipating failure before you even begin, which triggers stress hormones that actively work against erection quality. It's a vicious cycle that feeds itself.",
        },
      ]}
      howItWorksTitle="HOW MALE VITAMINE RESTORES YOUR FIRMNESS"
      howItWorksSteps={[
        {
          step: 1,
          title: "BOOST NITRIC OXIDE PRODUCTION",
          description:
            "L-Arginine converts directly into nitric oxide in your body — the molecule responsible for relaxing and widening blood vessels. More nitric oxide means more blood can flow into the erectile tissue when you need it most, creating the conditions for rock-solid erections.",
        },
        {
          step: 2,
          title: "ENHANCE BLOOD VESSEL HEALTH",
          description:
            "Ginseng Extract improves endothelial function — the lining of your blood vessels that controls dilation and contraction. Healthier vessels respond faster and more effectively to arousal signals, giving you firmer, more reliable erections on demand.",
        },
        {
          step: 3,
          title: "SUPPORT HORMONAL FOUNDATION",
          description:
            "Tribulus Terrestris and Zinc work together to optimize your testosterone levels and support the hormonal environment your body needs for strong sexual response. Low testosterone is a major contributor to ED — addressing it is essential for lasting results.",
        },
      ]}
      keyIngredients={[
        {
          name: "L-ARGININE",
          description:
            "The cornerstone of erection quality. This amino acid directly boosts nitric oxide production, increasing blood flow where you need it most — for stronger, firmer, longer-lasting results when it counts.",
          icon: "TrendingUp",
          benefit: "Nitric Oxide Booster",
        },
        {
          name: "GINSENG EXTRACT",
          description:
            "A battle-tested adaptogen that improves endothelial function and blood vessel health. Ginseng has been shown in studies to significantly improve erectile function by enhancing the body's natural vasodilation response.",
          icon: "Target",
          benefit: "Vascular Health",
        },
        {
          name: "TRIBULUS TERRESTRIS",
          description:
            "A powerful plant extract used for centuries to ignite male drive and support sexual function. Tribulus enhances libido and works synergistically with other ingredients to support the hormonal foundation needed for strong erections.",
          icon: "Dumbbell",
          benefit: "Libido & Hormonal Support",
        },
        {
          name: "ZINC",
          description:
            "The testosterone fuel. Zinc is essential for maintaining healthy testosterone levels — and low testosterone is one of the leading causes of erectile dysfunction. This mineral ensures your hormonal engine runs at full capacity.",
          icon: "Atom",
          benefit: "Testosterone Support",
        },
      ]}
      faqs={[
        {
          question: "How does L-Arginine help with ED?",
          answer:
            "L-Arginine is an amino acid that your body converts into nitric oxide, a molecule that relaxes and widens blood vessels. This process, called vasodilation, increases blood flow to the penile tissue — which is the exact mechanism needed for achieving and maintaining a firm erection. Studies have shown that men taking L-Arginine experienced significant improvements in erectile function compared to placebo. It works with your body's natural systems rather than forcing a temporary response.",
        },
        {
          question: "Is this a Viagra alternative?",
          answer:
            "Male Vitamin is a natural dietary supplement, not a pharmaceutical drug like Viagra. While Viagra works by blocking an enzyme for a temporary effect, our formula supports your body's natural blood flow and circulatory health over time. Many men prefer this approach because it works with their body rather than forcing a response, and it doesn't require a prescription. That said, if you have a medical condition causing your ED, you should consult your doctor.",
        },
        {
          question: "How fast does it work?",
          answer:
            "Most men begin noticing improved blood flow and firmer erections within 2-4 weeks of consistent daily use. The L-Arginine starts working on nitric oxide production from day one, but the full effects build as the ingredients accumulate in your system. Unlike prescription medications that work in 30-60 minutes, this is a long-term approach that gets better with time. By month two, most users report significantly stronger and more reliable performance.",
        },
        {
          question: "Is it safe to take?",
          answer:
            "Yes. Male Vitamin is made from well-researched, natural ingredients that have been used safely for decades. L-Arginine, Ginseng, Tribulus Terrestris, and Zinc are all naturally occurring compounds with extensive safety data. Every batch is third-party tested for purity and potency. As with any supplement, if you're taking blood pressure medication or have a heart condition, consult your healthcare provider first since L-Arginine affects blood vessel dilation.",
        },
        {
          question: "Do I need a prescription?",
          answer:
            "No. Male Vitamin is a natural dietary supplement available without a prescription. All our ingredients are classified as food supplements in South Africa. You can order directly from our website and have it delivered discreetly to your door. No doctor visits, no pharmacy queues, no awkward conversations — just a straightforward online order with discreet packaging.",
        },
      ]}
      currentSlug="ed-supplement"
      jsonLd={jsonLd}
    />
  );
}
