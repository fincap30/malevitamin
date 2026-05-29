import type { Metadata } from "next";
import { MiniSitePage } from "@/components/mini-site-page";

/* ------------------------------------------------------------------ */
/*  TOWN DATA                                                          */
/* ------------------------------------------------------------------ */

interface TownData {
  slug: string;
  name: string;
  province: string;
}

const towns: TownData[] = [
  { slug: "pretoria", name: "Pretoria", province: "Gauteng" },
  { slug: "johannesburg", name: "Johannesburg", province: "Gauteng" },
  { slug: "cape-town", name: "Cape Town", province: "Western Cape" },
  { slug: "durban", name: "Durban", province: "KwaZulu-Natal" },
  { slug: "centurion", name: "Centurion", province: "Gauteng" },
  { slug: "sandton", name: "Sandton", province: "Gauteng" },
  { slug: "randburg", name: "Randburg", province: "Gauteng" },
  { slug: "midrand", name: "Midrand", province: "Gauteng" },
  { slug: "roodepoort", name: "Roodepoort", province: "Gauteng" },
  { slug: "germiston", name: "Germiston", province: "Gauteng" },
  { slug: "benoni", name: "Benoni", province: "Gauteng" },
  { slug: "boksburg", name: "Boksburg", province: "Gauteng" },
  { slug: "springs", name: "Springs", province: "Gauteng" },
  { slug: "alberton", name: "Alberton", province: "Gauteng" },
  { slug: "vereeniging", name: "Vereeniging", province: "Gauteng" },
  { slug: "vanderbijlpark", name: "Vanderbijlpark", province: "Gauteng" },
  { slug: "bloemfontein", name: "Bloemfontein", province: "Free State" },
  { slug: "pietermaritzburg", name: "Pietermaritzburg", province: "KwaZulu-Natal" },
  { slug: "port-elizabeth", name: "Port Elizabeth", province: "Eastern Cape" },
  { slug: "east-london", name: "East London", province: "Eastern Cape" },
];

const slugs = ["ed-supplement", "libido-enhancer"] as const;
type SlugType = (typeof slugs)[number];

function getTown(slug: string): TownData | undefined {
  return towns.find((t) => t.slug === slug);
}

/* ------------------------------------------------------------------ */
/*  STATIC PARAMS                                                      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return towns.flatMap((town) =>
    slugs.map((slug) => ({
      town: town.slug,
      slug,
    }))
  );
}

/* ------------------------------------------------------------------ */
/*  METADATA                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string; slug: string }>;
}): Promise<Metadata> {
  const { town: townSlug, slug } = await params;
  const town = getTown(townSlug);
  if (!town) return {};

  const isED = slug === "ed-supplement";

  const title = isED
    ? `Erectile Dysfunction Supplement ${town.name} | Male Vitamin`
    : `Libido Enhancer ${town.name} | Male Vitamin`;

  const description = isED
    ? `Struggling with ED in ${town.name}? Male Vitamin's natural erectile dysfunction supplement uses L-Arginine, Ginseng & Tribulus to boost blood flow for stronger, firmer erections. R 850.00 — Delivered to ${town.name}, ${town.province}, South Africa.`
    : `Lost your sex drive in ${town.name}? Male Vitamin's natural libido enhancer uses Tribulus, Maca & Fenugreek to reignite your desire and passion. R 850.00 — Delivered to ${town.name}, ${town.province}, South Africa.`;

  const keywords = isED
    ? [
        `erectile dysfunction supplement ${town.name}`,
        `ED supplement ${town.name} South Africa`,
        `erectile dysfunction treatment ${town.name}`,
        `natural ED remedy ${town.name}`,
        `get harder erections ${town.name}`,
      ]
    : [
        `libido enhancer ${town.name}`,
        `increase sex drive ${town.name}`,
        `low libido treatment ${town.name}`,
        `male libido supplement ${town.name} South Africa`,
        `boost sex drive ${town.name}`,
      ];

  const canonicalUrl = `https://malevitamin.co.za/${townSlug}/${slug}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: "/product-image.webp",
          width: 1200,
          height: 630,
          alt: isED
            ? `Male Vitamin ED Supplement in ${town.name} — Natural Erectile Dysfunction Solution`
            : `Male Vitamin Libido Enhancer in ${town.name} — Natural Sex Drive Booster`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: isED
        ? `Natural ED supplement in ${town.name}. Boost blood flow for stronger, firmer erections. R 850.00 — Delivered to ${town.name}.`
        : `Natural libido enhancer in ${town.name}. Reignite your desire and passion. R 850.00 — Delivered to ${town.name}.`,
      images: ["/product-image.webp"],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  ED SUPPLEMENT DATA FACTORY                                         */
/* ------------------------------------------------------------------ */

function getEdData(town: TownData) {
  const canonicalUrl = `https://malevitamin.co.za/${town.slug}/ed-supplement`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: `Male Vitamin — Erectile Dysfunction Supplement in ${town.name}`,
        description: `Natural erectile dysfunction supplement with L-Arginine, Ginseng Extract, Tribulus Terrestris & Zinc for stronger, firmer erections. Delivered to ${town.name}, ${town.province}.`,
        image: "https://malevitamin.co.za/product-image.webp",
        brand: { "@type": "Brand", name: "Male Vitamin" },
        offers: {
          "@type": "Offer",
          price: "850.00",
          priceCurrency: "ZAR",
          availability: "https://schema.org/InStock",
          url: canonicalUrl,
          areaServed: {
            "@type": "City",
            name: town.name,
            containedInPlace: {
              "@type": "State",
              name: town.province,
            },
          },
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
          {
            "@type": "Question",
            name: `Can I get this delivered to ${town.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Yes! We deliver Male Vitamin directly to ${town.name} and all surrounding areas in ${town.province}. Orders are shipped in discreet, unmarked packaging so your privacy is fully protected. Delivery to ${town.name} typically takes 2-5 business days depending on your exact location. Whether you're in the ${town.name} CBD or surrounding suburbs, we've got you covered with fast, discreet delivery across South Africa.`,
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://malevitamin.co.za" },
          { "@type": "ListItem", position: 2, name: "ED Supplement", item: "https://malevitamin.co.za/ed-supplement" },
          { "@type": "ListItem", position: 3, name: town.name, item: canonicalUrl },
        ],
      },
    ],
  };

  return {
    pageTitle: `Erectile Dysfunction Supplement ${town.name}`,
    pageDescription: `Struggling with ED in ${town.name}? Male Vitamin's natural formula uses L-Arginine, Ginseng & Tribulus to boost blood flow for stronger, firmer erections. Delivered to ${town.name}, ${town.province}.`,
    canonicalUrl,
    heroH1: `ERECTILE DYSFUNCTION SUPPLEMENT IN ${town.name.toUpperCase()}`,
    heroSubheadline: `Men in ${town.name} are discovering a powerful, natural solution for erectile dysfunction. Male Vitamin's clinically-backed formula supercharges nitric oxide production and blood flow, giving you stronger, firmer, longer-lasting erections without a prescription. Whether you're in the ${town.name} CBD or the surrounding ${town.province} suburbs, this is the ED supplement that delivers real results — discreetly delivered right to your door.`,
    heroBadge: `${town.name} ED Solution`,
    problemTitle: `MEN IN ${town.name.toUpperCase()} ARE STRUGGLING — AND STAYING SILENT`,
    problemDescription: `Erectile dysfunction is affecting thousands of men across ${town.name} and ${town.province}. The stress of daily life, aging, and declining health are destroying bedroom performance — and most men are too embarrassed to seek help. The longer you ignore it, the worse it gets.`,
    problemPoints: [
      {
        icon: "AlertTriangle",
        title: "CAN'T GET FIRM ENOUGH",
        description: `Weak or inconsistent erections aren't just frustrating — they're a sign that blood flow to your penile tissue is compromised. Without proper circulation, achieving the firmness you need is nearly impossible, no matter how aroused you are. Men across ${town.name} are dealing with this silently every day.`,
      },
      {
        icon: "Activity",
        title: "CAN'T STAY HARD",
        description: `Losing your erection midway through is one of the most confidence-crushing experiences a man can face. It's usually caused by insufficient nitric oxide levels and poor vascular health — problems that get worse with age and stress. If this is happening to you in ${town.name}, you're not alone.`,
      },
      {
        icon: "Gauge",
        title: "PERFORMANCE ANXIETY LOOP",
        description: `Every time you fail to perform, the anxiety compounds. You start anticipating failure before you even begin, which triggers stress hormones that actively work against erection quality. It's a vicious cycle that feeds itself — and it's ruining relationships throughout ${town.name} and ${town.province}.`,
      },
    ],
    howItWorksTitle: "HOW MALE VITAMINE RESTORES YOUR FIRMNESS",
    howItWorksSteps: [
      {
        step: 1,
        title: "BOOST NITRIC OXIDE PRODUCTION",
        description: "L-Arginine converts directly into nitric oxide in your body — the molecule responsible for relaxing and widening blood vessels. More nitric oxide means more blood can flow into the erectile tissue when you need it most, creating the conditions for rock-solid erections.",
      },
      {
        step: 2,
        title: "ENHANCE BLOOD VESSEL HEALTH",
        description: "Ginseng Extract improves endothelial function — the lining of your blood vessels that controls dilation and contraction. Healthier vessels respond faster and more effectively to arousal signals, giving you firmer, more reliable erections on demand.",
      },
      {
        step: 3,
        title: "SUPPORT HORMONAL FOUNDATION",
        description: "Tribulus Terrestris and Zinc work together to optimize your testosterone levels and support the hormonal environment your body needs for strong sexual response. Low testosterone is a major contributor to ED — addressing it is essential for lasting results.",
      },
    ],
    keyIngredients: [
      {
        name: "L-ARGININE",
        description: "The cornerstone of erection quality. This amino acid directly boosts nitric oxide production, increasing blood flow where you need it most — for stronger, firmer, longer-lasting results when it counts.",
        icon: "TrendingUp",
        benefit: "Nitric Oxide Booster",
      },
      {
        name: "GINSENG EXTRACT",
        description: "A battle-tested adaptogen that improves endothelial function and blood vessel health. Ginseng has been shown in studies to significantly improve erectile function by enhancing the body's natural vasodilation response.",
        icon: "Target",
        benefit: "Vascular Health",
      },
      {
        name: "TRIBULUS TERRESTRIS",
        description: "A powerful plant extract used for centuries to ignite male drive and support sexual function. Tribulus enhances libido and works synergistically with other ingredients to support the hormonal foundation needed for strong erections.",
        icon: "Dumbbell",
        benefit: "Libido & Hormonal Support",
      },
      {
        name: "ZINC",
        description: "The testosterone fuel. Zinc is essential for maintaining healthy testosterone levels — and low testosterone is one of the leading causes of erectile dysfunction. This mineral ensures your hormonal engine runs at full capacity.",
        icon: "Atom",
        benefit: "Testosterone Support",
      },
    ],
    faqs: [
      {
        question: "How does L-Arginine help with ED?",
        answer: "L-Arginine is an amino acid that your body converts into nitric oxide, a molecule that relaxes and widens blood vessels. This process, called vasodilation, increases blood flow to the penile tissue — which is the exact mechanism needed for achieving and maintaining a firm erection. Studies have shown that men taking L-Arginine experienced significant improvements in erectile function compared to placebo. It works with your body's natural systems rather than forcing a temporary response.",
      },
      {
        question: "Is this a Viagra alternative?",
        answer: "Male Vitamin is a natural dietary supplement, not a pharmaceutical drug like Viagra. While Viagra works by blocking an enzyme for a temporary effect, our formula supports your body's natural blood flow and circulatory health over time. Many men prefer this approach because it works with their body rather than forcing a response, and it doesn't require a prescription. That said, if you have a medical condition causing your ED, you should consult your doctor.",
      },
      {
        question: "How fast does it work?",
        answer: "Most men begin noticing improved blood flow and firmer erections within 2-4 weeks of consistent daily use. The L-Arginine starts working on nitric oxide production from day one, but the full effects build as the ingredients accumulate in your system. Unlike prescription medications that work in 30-60 minutes, this is a long-term approach that gets better with time. By month two, most users report significantly stronger and more reliable performance.",
      },
      {
        question: "Is it safe to take?",
        answer: "Yes. Male Vitamin is made from well-researched, natural ingredients that have been used safely for decades. L-Arginine, Ginseng, Tribulus Terrestris, and Zinc are all naturally occurring compounds with extensive safety data. Every batch is third-party tested for purity and potency. As with any supplement, if you're taking blood pressure medication or have a heart condition, consult your healthcare provider first since L-Arginine affects blood vessel dilation.",
      },
      {
        question: "Do I need a prescription?",
        answer: "No. Male Vitamin is a natural dietary supplement available without a prescription. All our ingredients are classified as food supplements in South Africa. You can order directly from our website and have it delivered discreetly to your door. No doctor visits, no pharmacy queues, no awkward conversations — just a straightforward online order with discreet packaging.",
      },
      {
        question: `Can I get this delivered to ${town.name}?`,
        answer: `Yes! We deliver Male Vitamin directly to ${town.name} and all surrounding areas in ${town.province}. Orders are shipped in discreet, unmarked packaging so your privacy is fully protected. Delivery to ${town.name} typically takes 2-5 business days depending on your exact location. Whether you're in the ${town.name} CBD or surrounding suburbs, we've got you covered with fast, discreet delivery across South Africa.`,
      },
    ],
    currentSlug: "ed-supplement",
    productImageAlt: `Male Vitamin ED Supplement available in ${town.name} — natural erectile dysfunction formula for men in ${town.name}, ${town.province}`,
    jsonLd,
  };
}

/* ------------------------------------------------------------------ */
/*  LIBIDO ENHANCER DATA FACTORY                                       */
/* ------------------------------------------------------------------ */

function getLibidoData(town: TownData) {
  const canonicalUrl = `https://malevitamin.co.za/${town.slug}/libido-enhancer`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: `Male Vitamin — Libido Enhancer in ${town.name}`,
        description: `Natural libido enhancer with Tribulus Terrestris, Maca Root, Fenugreek Extract & Ginseng to reignite your desire and passion. Delivered to ${town.name}, ${town.province}.`,
        image: "https://malevitamin.co.za/product-image.webp",
        brand: { "@type": "Brand", name: "Male Vitamin" },
        offers: {
          "@type": "Offer",
          price: "850.00",
          priceCurrency: "ZAR",
          availability: "https://schema.org/InStock",
          url: canonicalUrl,
          areaServed: {
            "@type": "City",
            name: town.name,
            containedInPlace: {
              "@type": "State",
              name: town.province,
            },
          },
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
            acceptedAnswer: {
              "@type": "Answer",
              text: "Male Vitamin specifically targets both desire AND performance — but the libido-enhancing effects are where this formula really shines. Tribulus Terrestris and Maca Root are both clinically shown to increase sexual desire specifically, not just physical capability. You'll notice more spontaneous sexual thoughts, a stronger urge to initiate intimacy, and a renewed sense of passion that goes beyond just 'being able to perform.' This is about reigniting the fire, not just fixing the plumbing.",
            },
          },
          {
            "@type": "Question",
            name: `Can I get this delivered to ${town.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Absolutely! We deliver Male Vitamin directly to ${town.name} and all surrounding areas in ${town.province}. Your order ships in plain, unmarked packaging — no one will know what's inside. Delivery to ${town.name} typically takes 2-5 business days. Whether you're in the ${town.name} city centre or the outskirts, we ensure fast and discreet delivery throughout South Africa.`,
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://malevitamin.co.za" },
          { "@type": "ListItem", position: 2, name: "Libido Enhancer", item: "https://malevitamin.co.za/libido-enhancer" },
          { "@type": "ListItem", position: 3, name: town.name, item: canonicalUrl },
        ],
      },
    ],
  };

  return {
    pageTitle: `Libido Enhancer ${town.name}`,
    pageDescription: `Lost your sex drive in ${town.name}? Male Vitamin's natural libido enhancer uses Tribulus, Maca & Fenugreek to reignite your desire and passion. Delivered to ${town.name}, ${town.province}.`,
    canonicalUrl,
    heroH1: `LIBIDO ENHANCER IN ${town.name.toUpperCase()}`,
    heroSubheadline: `Men in ${town.name} no longer have to accept a fading sex drive. Male Vitamin's libido formula combines Tribulus, Maca, Fenugreek, and Ginseng to wake up your desire from the inside out. Not a temporary stimulant — a genuine reignition of your natural drive. Available now with discreet delivery to ${town.name} and all of ${town.province}.`,
    heroBadge: `${town.name} Desire Restorer`,
    problemTitle: `THE DESIRE THAT DISAPPEARED FROM MEN IN ${town.name.toUpperCase()}`,
    problemDescription: `A declining sex drive doesn't just affect your bedroom life — it changes how you feel about yourself as a man. Across ${town.name} and ${town.province}, thousands of men have lost the passion they once took for granted. It's been replaced by indifference, and it's eroding relationships and self-worth.`,
    problemPoints: [
      {
        icon: "Flame",
        title: "THE FIRE IS OUT",
        description: `You used to think about sex constantly. Now it barely crosses your mind. Your partner initiates and you make excuses — you're tired, you're stressed, you're not in the mood. But deep down, you know the real reason: your body's desire mechanism has been switched off, and you don't know how to turn it back on. You're not alone in ${town.name} — this is more common than anyone talks about.`,
      },
      {
        icon: "Heart",
        title: "YOUR RELATIONSHIP IS SUFFERING",
        description: `When one partner loses their sex drive, both people suffer. Your partner feels rejected, unattractive, and confused. You feel guilty, defensive, and inadequate. The distance grows, the intimacy fades, and what was once a passionate relationship becomes a polite coexistence. This is happening in homes across ${town.name} right now — and it doesn't have to be this way.`,
      },
      {
        icon: "Eye",
        title: "YOU'VE LOST THAT SPARK",
        description: `It's not just about wanting sex — it's about the spark that makes you feel alive. That magnetic attraction, that hunger, that primal drive that made you feel like a man. When your libido disappears, you lose a piece of your identity. You stop feeling desirable, you stop pursuing, and you settle into a version of yourself you don't even recognize. Men in ${town.name} deserve better.`,
      },
    ],
    howItWorksTitle: "HOW MALE VITAMINE REIGNITES YOUR DESIRE",
    howItWorksSteps: [
      {
        step: 1,
        title: "RESTORE THE HORMONAL SIGNAL",
        description: "Tribulus Terrestris supports luteinizing hormone production — the signal your brain sends to your testes to produce testosterone. More LH means more T, and more T means a stronger, more consistent sex drive. This is the foundational signal that drives male desire, and it's the first thing we restore.",
      },
      {
        step: 2,
        title: "WAKE UP THE DESIRE CENTERS",
        description: "Maca Root and Fenugreek Extract work on the neurochemical pathways that control sexual desire. Maca has been shown to increase dopamine and noradrenaline in the brain's pleasure centers, while Fenugreek supports the hormonal environment that keeps those desire signals firing. Together, they reignite the mental and physical urge for intimacy.",
      },
      {
        step: 3,
        title: "SUSTAIN PASSION LONG-TERM",
        description: "Ginseng Extract rounds out the formula by reducing stress hormones (which kill libido) and improving overall energy and vitality. Chronic stress is the #1 libido killer in men — Ginseng helps your body manage it so your desire can stay turned on. The result is not a temporary spike but a sustained, reliable sex drive you can count on.",
      },
    ],
    keyIngredients: [
      {
        name: "TRIBULUS TERRESTRIS",
        description: "A powerful plant extract used for centuries to ignite male drive and enhance libido. Tribulus supports the LH-testosterone pathway that is the hormonal foundation of male sexual desire. Without adequate signaling here, your body simply won't produce the urge for intimacy.",
        icon: "Dumbbell",
        benefit: "Primary Libido Activator",
      },
      {
        name: "MACA ROOT",
        description: "The ancient desire secret from the Peruvian highlands. Maca Root has been shown to increase sexual desire by influencing dopamine and other neurochemicals in the brain's pleasure centers. It doesn't just make you physically capable — it makes you genuinely want it.",
        icon: "Zap",
        benefit: "Desire Neurochemical Support",
      },
      {
        name: "FENUGREEK EXTRACT",
        description: "A proven testosterone supporter that directly impacts sex drive. Studies show Fenugreek significantly improves libido and sexual function in men by supporting the hormonal environment needed for a healthy, active sex drive. It also helps maintain testosterone levels that fuel desire.",
        icon: "Pill",
        benefit: "Hormonal Desire Support",
      },
      {
        name: "GINSENG EXTRACT",
        description: "An adaptogen that reduces cortisol and stress hormones — the primary libido killers in modern men. By helping your body manage stress, Ginseng creates the mental and physical space for desire to return. It also improves energy and vitality, so you have the drive to act on your urges.",
        icon: "Target",
        benefit: "Stress & Desire Manager",
      },
    ],
    faqs: [
      {
        question: "Why has my sex drive decreased?",
        answer: "Libido loss is rarely caused by just one thing — it's usually a combination of factors that build up over time. Declining testosterone levels (which drop about 1% per year after 30), chronic stress and elevated cortisol, poor sleep quality, relationship issues, certain medications, and nutritional deficiencies all contribute. The good news is that most of these factors are addressable through proper nutritional support. When you give your body the right ingredients, it can restore the hormonal balance and energy levels that drive a healthy sex drive.",
      },
      {
        question: "Does Tribulus really increase libido?",
        answer: "Yes — Tribulus Terrestris is one of the most well-researched herbs for male libido enhancement. It works primarily by supporting luteinizing hormone (LH) production, which signals your testes to produce more testosterone — the primary hormone driving male sex drive. Multiple clinical studies have shown significant improvements in sexual desire and satisfaction in men taking Tribulus. It's been used in Ayurvedic and Traditional Chinese Medicine for centuries specifically for this purpose, and modern science has validated what traditional healers knew all along.",
      },
      {
        question: "How long before my drive comes back?",
        answer: "Most men start feeling the first sparks of returning desire within 1-2 weeks. By week 3-4, you'll typically notice a significant increase in spontaneous sexual thoughts and a stronger urge to initiate intimacy. The full libido-restoring effects usually peak around 6-8 weeks as your hormonal balance recalibrates. Your sex drive didn't disappear overnight, and it won't return overnight either — but with consistent daily use, you can expect a steady, noticeable improvement that keeps building.",
      },
      {
        question: "Is this safe with other medications?",
        answer: "Male Vitamin uses natural ingredients with strong safety profiles. However, if you're taking prescription medications — particularly blood pressure medications, antidepressants, or hormone therapies — you should consult your healthcare provider before starting any supplement. Some ingredients like Tribulus can have mild interactions with certain medications. We always recommend being transparent with your doctor about any supplements you're taking. That said, our formula is designed to work with your body's natural systems, not against them.",
      },
      {
        question: "Will this help with desire or just performance?",
        answer: "Male Vitamin specifically targets both desire AND performance — but the libido-enhancing effects are where this formula really shines. Tribulus Terrestris and Maca Root are both clinically shown to increase sexual desire specifically, not just physical capability. You'll notice more spontaneous sexual thoughts, a stronger urge to initiate intimacy, and a renewed sense of passion that goes beyond just 'being able to perform.' This is about reigniting the fire, not just fixing the plumbing.",
      },
      {
        question: `Can I get this delivered to ${town.name}?`,
        answer: `Absolutely! We deliver Male Vitamin directly to ${town.name} and all surrounding areas in ${town.province}. Your order ships in plain, unmarked packaging — no one will know what's inside. Delivery to ${town.name} typically takes 2-5 business days. Whether you're in the ${town.name} city centre or the outskirts, we ensure fast and discreet delivery throughout South Africa.`,
      },
    ],
    currentSlug: "libido-enhancer",
    productImageAlt: `Male Vitamin Libido Enhancer available in ${town.name} — natural sex drive booster for men in ${town.name}, ${town.province}`,
    jsonLd,
  };
}

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default async function TownSlugPage({
  params,
}: {
  params: Promise<{ town: string; slug: string }>;
}) {
  const { town: townSlug, slug } = await params;
  const town = getTown(townSlug);
  if (!town) return null;

  const isED = slug === "ed-supplement";
  const data = isED ? getEdData(town) : getLibidoData(town);

  return <MiniSitePage {...data} />;
}
