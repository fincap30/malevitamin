"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  type LucideIcon,
  Flame,
  ArrowRight,
  CheckCircle,
  Star,
  ChevronRight,
  Heart,
  Zap,
  Battery,
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Dumbbell,
  Atom,
  Pill,
  AlertTriangle,
  Activity,
  Gauge,
  Clock,
  RefreshCw,
  Brain,
  Eye,
  Swords,
  Shield,
  Crown,
} from "lucide-react";
import { PaymentModal } from "@/components/payment-modal";

/* ------------------------------------------------------------------ */
/*  ICON MAP                                                           */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, LucideIcon> = {
  Flame,
  ArrowRight,
  CheckCircle,
  Star,
  ChevronRight,
  Heart,
  Zap,
  Battery,
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Dumbbell,
  Atom,
  Pill,
  AlertTriangle,
  Activity,
  Gauge,
  Clock,
  RefreshCw,
  Brain,
  Eye,
  Swords,
  Shield,
  Crown,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] || Flame;
}

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface ProblemPoint {
  icon: string;
  title: string;
  description: string;
}

interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

interface KeyIngredient {
  name: string;
  description: string;
  icon: string;
  benefit: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export interface MiniSitePageProps {
  pageTitle: string;
  pageDescription: string;
  canonicalUrl: string;

  heroH1: string;
  heroSubheadline: string;
  heroBadge: string;

  problemTitle: string;
  problemDescription: string;
  problemPoints: ProblemPoint[];

  howItWorksTitle: string;
  howItWorksSteps: HowItWorksStep[];

  keyIngredients: KeyIngredient[];

  faqs: FAQ[];

  currentSlug: string;

  jsonLd: object;
}

/* ------------------------------------------------------------------ */
/*  MINI SITE DATA                                                     */
/* ------------------------------------------------------------------ */

const miniSites = [
  {
    slug: "ed-supplement",
    title: "Natural ED Supplement",
    iconName: "Heart",
    description: "Get harder, firmer erections naturally.",
  },
  {
    slug: "testosterone-booster",
    title: "Testosterone Booster",
    iconName: "Zap",
    description: "Restore your drive and T-levels.",
  },
  {
    slug: "stamina-supplement",
    title: "Stamina Supplement",
    iconName: "Battery",
    description: "Last longer and perform stronger.",
  },
  {
    slug: "libido-enhancer",
    title: "Libido Enhancer",
    iconName: "Flame",
    description: "Reignite your desire and passion.",
  },
  {
    slug: "male-performance",
    title: "Male Performance",
    iconName: "Trophy",
    description: "Total dominance in the bedroom.",
  },
];

/* ------------------------------------------------------------------ */
/*  NAVBAR                                                             */
/* ------------------------------------------------------------------ */

function MiniNavbar({ onOrderNow }: { onOrderNow: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg shadow-black/50 border-b border-gold/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Flame className="h-7 w-7 text-gold" />
          <span className="text-xl font-black tracking-widest text-gold uppercase">
            Male Vitamine
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-widest uppercase text-foreground/60">
          <a
            href="#problem"
            className="hover:text-gold transition-colors duration-200"
          >
            The Problem
          </a>
          <a
            href="#how-it-works"
            className="hover:text-gold transition-colors duration-200"
          >
            How It Works
          </a>
          <a
            href="#ingredients"
            className="hover:text-gold transition-colors duration-200"
          >
            Ingredients
          </a>
          <a
            href="#faq"
            className="hover:text-gold transition-colors duration-200"
          >
            FAQ
          </a>
          <Button
            size="sm"
            className="rounded-none bg-gold text-black font-black tracking-wider uppercase hover:bg-gold-light"
            onClick={onOrderNow}
          >
            Order Now
          </Button>
        </div>
        <Button
          size="sm"
          className="md:hidden rounded-none bg-gold text-black font-black tracking-wider uppercase hover:bg-gold-light"
          onClick={onOrderNow}
        >
          Order
        </Button>
      </div>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO SECTION                                                       */
/* ------------------------------------------------------------------ */

function HeroSection({
  heroH1,
  heroSubheadline,
  heroBadge,
  onOrderNow,
}: {
  heroH1: string;
  heroSubheadline: string;
  heroBadge: string;
  onOrderNow: () => void;
}) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a08]" />
      <div className="absolute inset-0 texture-overlay" />
      <div className="light-beam" style={{ top: "40%", left: "-20%" }} />
      <div
        className="light-beam"
        style={{ top: "60%", left: "-20%", opacity: 0.5 }}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/3 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Badge className="mb-6 bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs">
            {heroBadge}
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]">
            <span className="gold-gradient-text">{heroH1}</span>
          </h1>
          <p className="mt-8 text-lg text-foreground/60 leading-relaxed max-w-xl font-light">
            {heroSubheadline}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-14 px-10"
              onClick={onOrderNow}
            >
              Order Now — R 850.00{" "}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-none border-gold/30 text-gold font-bold tracking-wider uppercase text-sm hover:bg-gold/10 hover:border-gold/50 h-14 px-10"
              asChild
            >
              <a href="#how-it-works">Learn More</a>
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gold/20 border-2 border-[#0a0a08] flex items-center justify-center text-gold text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-gold text-gold"
                  />
                ))}
              </div>
              <p className="text-xs text-foreground/40 font-bold tracking-wider uppercase mt-1">
                Trusted by 2,000+ Men
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 bg-gold/5 rounded-2xl blur-3xl scale-90" />
          <div className="relative bg-gradient-to-br from-[#1a1a15] to-[#0d0d0a] rounded-2xl p-8 sm:p-12 border border-gold/15 gold-glow-strong">
            <img
              src="/product-image.webp"
              alt="Male Vitamine Premium Supplement"
              className="w-72 h-72 sm:w-80 sm:h-80 object-contain drop-shadow-2xl"
            />
            <div className="mt-8 text-center">
              <p className="text-4xl font-black text-gold tracking-wide">
                R 850.00
              </p>
              <Badge className="mt-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-none font-bold tracking-widest uppercase text-xs">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                In Stock
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PROBLEM SECTION                                                    */
/* ------------------------------------------------------------------ */

function ProblemSection({
  problemTitle,
  problemDescription,
  problemPoints,
}: {
  problemTitle: string;
  problemDescription: string;
  problemPoints: ProblemPoint[];
}) {
  return (
    <section
      id="problem"
      className="py-24 lg:py-32 bg-[#0a0a08] texture-overlay relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge className="mb-4 bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs">
            The Problem
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="gold-gradient-text">{problemTitle}</span>
          </h2>
          <p className="mt-6 text-foreground/50 max-w-2xl mx-auto text-lg font-light">
            {problemDescription}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problemPoints.map((point, i) => {
            const Icon = getIcon(point.icon);
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/30 transition-all duration-300 group gold-glow">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 rounded-none bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors border border-gold/20">
                      <Icon className="h-7 w-7 text-gold" />
                    </div>
                    <CardTitle className="text-xl font-black tracking-wider text-foreground">
                      {point.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/50 leading-relaxed font-light">
                      {point.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  HOW IT WORKS SECTION                                               */
/* ------------------------------------------------------------------ */

function HowItWorksSection({
  howItWorksTitle,
  howItWorksSteps,
}: {
  howItWorksTitle: string;
  howItWorksSteps: HowItWorksStep[];
}) {
  return (
    <section
      id="how-it-works"
      className="py-24 lg:py-32 bg-[#0d0d0a] texture-overlay relative overflow-hidden"
    >
      <div className="light-beam" style={{ top: "50%", left: "-20%" }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge className="mb-4 bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs">
            The Solution
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="gold-gradient-text">{howItWorksTitle}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {howItWorksSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/30 transition-all duration-300 group gold-glow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-none bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors border border-gold/20">
                    <span className="text-2xl font-black text-gold">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-black tracking-wider text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-foreground/50 leading-relaxed font-light">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  KEY INGREDIENTS SECTION                                            */
/* ------------------------------------------------------------------ */

function KeyIngredientsSection({
  keyIngredients,
}: {
  keyIngredients: KeyIngredient[];
}) {
  return (
    <section
      id="ingredients"
      className="py-24 lg:py-32 bg-[#0a0a08] texture-overlay relative"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge className="mb-4 bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs">
            The Arsenal
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="gold-gradient-text">KEY INGREDIENTS</span>{" "}
            <span className="text-foreground">THAT DELIVER</span>
          </h2>
          <p className="mt-6 text-foreground/50 max-w-2xl mx-auto text-lg font-light">
            Each ingredient is selected for maximum potency and proven results
            — because what you put in your body matters.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {keyIngredients.map((ingredient, i) => {
            const Icon = getIcon(ingredient.icon);
            return (
              <motion.div
                key={ingredient.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/25 transition-all duration-300 group gold-glow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-none bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors border border-gold/15">
                        <Icon className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-black text-sm tracking-wider text-foreground">
                          {ingredient.name}
                        </h3>
                        <p className="mt-2 text-foreground/45 text-sm leading-relaxed font-light">
                          {ingredient.description}
                        </p>
                        <Badge className="mt-3 bg-gold/10 text-gold border border-gold/20 rounded-none font-bold tracking-widest uppercase text-[10px]">
                          {ingredient.benefit}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ SECTION                                                        */
/* ------------------------------------------------------------------ */

function FAQSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section
      id="faq"
      className="py-24 lg:py-32 bg-[#0d0d0a] texture-overlay relative overflow-hidden"
    >
      <div className="light-beam" style={{ top: "30%", left: "-20%" }} />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs">
            FAQ
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="gold-gradient-text">COMMON</span>{" "}
            <span className="text-foreground">QUESTIONS</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-[#111110] border border-gold/20 gold-glow">
            <CardContent className="p-6 sm:p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border-gold/10"
                  >
                    <AccordionTrigger className="text-left font-black tracking-wider text-sm text-foreground hover:text-gold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/50 leading-relaxed font-light text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CROSS-LINKS SECTION                                                */
/* ------------------------------------------------------------------ */

function CrossLinksSection({ currentSlug }: { currentSlug: string }) {
  const otherSites = miniSites.filter((s) => s.slug !== currentSlug);

  return (
    <section className="py-24 lg:py-32 bg-[#0a0a08] texture-overlay relative">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge className="mb-4 bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs">
            Explore More
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="gold-gradient-text">OTHER SOLUTIONS</span>{" "}
            <span className="text-foreground">FOR YOU</span>
          </h2>
          <p className="mt-6 text-foreground/50 max-w-2xl mx-auto text-lg font-light">
            Male Vitamine is engineered for every aspect of male performance.
            Explore our targeted solutions and find the one that fits your
            specific needs.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/">
              <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/30 transition-all duration-300 group gold-glow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-none bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors border border-gold/15">
                      <Flame className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm tracking-wider text-foreground">
                        MAIN PAGE
                      </h3>
                      <p className="mt-2 text-foreground/45 text-sm leading-relaxed font-light">
                        Full overview of Male Vitamine — benefits, quiz, and
                        everything you need to reclaim your edge.
                      </p>
                      <span className="inline-flex items-center gap-1 mt-3 text-gold text-xs font-bold tracking-widest uppercase group-hover:gap-2 transition-all">
                        Learn More <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {otherSites.map((site, i) => {
            const SiteIcon = getIcon(site.iconName);
            return (
              <motion.div
                key={site.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i + 1) * 0.1 }}
              >
                <Link href={`/${site.slug}`}>
                  <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/30 transition-all duration-300 group gold-glow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-none bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors border border-gold/15">
                          <SiteIcon className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <h3 className="font-black text-sm tracking-wider text-foreground">
                            {site.title}
                          </h3>
                          <p className="mt-2 text-foreground/45 text-sm leading-relaxed font-light">
                            {site.description}
                          </p>
                          <span className="inline-flex items-center gap-1 mt-3 text-gold text-xs font-bold tracking-widest uppercase group-hover:gap-2 transition-all">
                            Learn More <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA SECTION                                                        */
/* ------------------------------------------------------------------ */

function CTASection({ onOrderNow }: { onOrderNow: () => void }) {
  return (
    <section
      id="order"
      className="py-24 lg:py-32 bg-[#0a0a08] texture-overlay relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.03] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-[#111110] border border-gold/20 gold-glow-strong overflow-hidden relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/3 rounded-full translate-y-1/2 -translate-x-1/2 blur-[60px]" />
            <CardContent className="relative p-8 sm:p-16 text-center">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                <span className="gold-gradient-text">TAKE ACTION</span>
                <br />
                <span className="gold-gradient-text">TODAY</span>
              </h2>
              <p className="text-foreground/50 max-w-2xl mx-auto text-lg mb-10 font-light">
                Join thousands of men across South Africa who stopped accepting
                mediocre performance. Stronger stamina. Harder results. The
                confidence of knowing you&apos;ll deliver every time. One
                decision changes everything.
              </p>
              <Button
                size="lg"
                className="rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-14 px-12"
                onClick={onOrderNow}
              >
                Order Now — R 850.00{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-foreground/30 font-bold tracking-widest uppercase">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-gold/40" /> Free
                  Shipping
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-gold/40" /> 30-Day
                  Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-gold/40" /> Discreet
                  Packaging
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */

function MiniFooter({ currentSlug }: { currentSlug: string }) {
  const otherSites = miniSites.filter((s) => s.slug !== currentSlug);

  return (
    <footer className="bg-[#050504] border-t border-gold/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Flame className="h-6 w-6 text-gold" />
              <span className="text-lg font-black tracking-widest text-gold uppercase">
                Male Vitamine
              </span>
            </Link>
            <p className="text-sm text-foreground/30 leading-relaxed font-light">
              Premium men&apos;s performance supplement — stronger stamina,
              harder results, and the confidence to back it up.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs tracking-widest uppercase text-gold/60 mb-4">
              Solutions
            </h4>
            <ul className="space-y-2 text-sm text-foreground/30 font-light">
              <li>
                <Link
                  href="/ed-supplement"
                  className="hover:text-gold transition-colors"
                >
                  Natural ED Supplement
                </Link>
              </li>
              <li>
                <Link
                  href="/testosterone-booster"
                  className="hover:text-gold transition-colors"
                >
                  Testosterone Booster
                </Link>
              </li>
              <li>
                <Link
                  href="/stamina-supplement"
                  className="hover:text-gold transition-colors"
                >
                  Stamina Supplement
                </Link>
              </li>
              <li>
                <Link
                  href="/libido-enhancer"
                  className="hover:text-gold transition-colors"
                >
                  Libido Enhancer
                </Link>
              </li>
              <li>
                <Link
                  href="/male-performance"
                  className="hover:text-gold transition-colors"
                >
                  Male Performance
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs tracking-widest uppercase text-gold/60 mb-4">
              More
            </h4>
            <ul className="space-y-2 text-sm text-foreground/30 font-light">
              {otherSites.map((site) => (
                <li key={site.slug}>
                  <Link
                    href={`/${site.slug}`}
                    className="hover:text-gold transition-colors"
                  >
                    {site.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/"
                  className="hover:text-gold transition-colors"
                >
                  Main Page
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs tracking-widest uppercase text-gold/60 mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-foreground/30 font-light">
              <li>
                <span className="cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-default">Terms of Service</span>
              </li>
              <li>
                <span className="cursor-default">Disclaimer</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gold/5 text-center text-xs text-foreground/20 font-bold tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} Male Vitamine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function MiniSitePage(props: MiniSitePageProps) {
  const [showPayment, setShowPayment] = useState(false);

  const onOrderNow = () => setShowPayment(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a08]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(props.jsonLd) }}
      />
      <MiniNavbar onOrderNow={onOrderNow} />
      <main className="flex-1">
        <HeroSection
          heroH1={props.heroH1}
          heroSubheadline={props.heroSubheadline}
          heroBadge={props.heroBadge}
          onOrderNow={onOrderNow}
        />
        <ProblemSection
          problemTitle={props.problemTitle}
          problemDescription={props.problemDescription}
          problemPoints={props.problemPoints}
        />
        <HowItWorksSection
          howItWorksTitle={props.howItWorksTitle}
          howItWorksSteps={props.howItWorksSteps}
        />
        <KeyIngredientsSection keyIngredients={props.keyIngredients} />
        <FAQSection faqs={props.faqs} />
        <CrossLinksSection currentSlug={props.currentSlug} />
        <CTASection onOrderNow={onOrderNow} />
      </main>
      <MiniFooter currentSlug={props.currentSlug} />
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
      />
    </div>
  );
}
