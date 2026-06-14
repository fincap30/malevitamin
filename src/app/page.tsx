"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Shield,
  Heart,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
  Flame,
  Trophy,
  Target,
  TrendingUp,
  Package,
  Clock,
  Award,
  Swords,
  Dumbbell,
  Crown,
  Fingerprint,
  Atom,
  Pill,
  Battery,
  Truck,
  Lock,
  ShieldCheck,
  Quote,
  Users,
} from "lucide-react";
import { PaymentModal } from "@/components/payment-modal";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const PRICE = "R 850.00";

const benefits = [
  {
    icon: Zap,
    title: "RELENTLESS STAMINA",
    subtitle: "Go The Distance",
    description:
      "When the moment demands more, you deliver more. Our formula fuels the blood flow and staying power you need to perform at your strongest — in the bedroom and beyond. Whether you're fighting erectile dysfunction or just want to last longer, no more finishing before you're ready. No more excuses.",
  },
  {
    icon: Swords,
    title: "ROCK-SOLID CONFIDENCE",
    subtitle: "Beat Erectile Dysfunction",
    description:
      "There's nothing more crippling than doubting your own body. Our blend supports firm, reliable erections so you never have to second-guess yourself again. Walk into every moment knowing you'll deliver — no hesitation, no doubt. L-Arginine and Ginseng work together to overcome ED naturally.",
  },
  {
    icon: Heart,
    title: "LIBIDO BOOST",
    subtitle: "Reignite Your Desire",
    description:
      "Lost your libido? Enhanced circulation and optimized testosterone don't just make you feel alive — they reignite the desire you thought was gone. Tribulus and Maca Root boost your sex drive naturally. Experience stronger libido, harder stamina, and the kind of satisfaction that keeps her coming back. Real results. No compromises.",
  },
];

const whyChoose = [
  {
    icon: Crown,
    title: "PREMIUM INGREDIENTS",
    description:
      "Every ingredient is meticulously selected for maximum purity and potency. We source only pharmaceutical-grade raw materials that pass the most rigorous quality standards — because what you put in your body determines what you get out of it.",
  },
  {
    icon: Shield,
    title: "PROVEN & SAFE",
    description:
      "Engineered with your health as the top priority. Every batch is third-party tested to guarantee safety, consistency, and results. No dangerous chemicals, no sketchy fillers — just powerful, natural ingredients you can trust with your most important performance.",
  },
  {
    icon: Flame,
    title: "REAL RESULTS WHERE IT MATTERS",
    description:
      "This isn't a band-aid solution. Our formula targets the root causes of erectile dysfunction and low libido — blood flow, testosterone, and stamina — so you get harder, last longer, and feel stronger. Not just in the gym, but where it matters most. Lasting, transformational results you can feel.",
  },
];

const ingredients = [
  {
    name: "L-ARGININE",
    description:
      "The cornerstone of performance. This amino acid boosts nitric oxide production, increasing blood flow where you need it most — for stronger, firmer, longer-lasting results when it counts.",
    icon: TrendingUp,
  },
  {
    name: "TRIBULUS TERRESTRIS",
    description:
      "A powerful plant extract used for centuries to ignite male drive, enhance libido, and support the raw sexual vitality every man was born with.",
    icon: Dumbbell,
  },
  {
    name: "MACA ROOT",
    description:
      "The ancient stamina secret. Known for supercharging endurance, fueling your sex drive, and keeping your hormones in the zone that makes you feel unstoppable.",
    icon: Zap,
  },
  {
    name: "GINSENG EXTRACT",
    description:
      "A battle-tested adaptogen that fights fatigue, sharpens performance under pressure, and keeps you going strong — round after round.",
    icon: Target,
  },
  {
    name: "ZINC",
    description:
      "The testosterone fuel. This essential mineral is the backbone of male hormonal health, keeping your drive, strength, and performance at peak levels.",
    icon: Atom,
  },
  {
    name: "FENUGREEK EXTRACT",
    description:
      "A proven testosterone supporter that ramps up your sex drive, enhances stamina, and helps you perform like the man you know you can be.",
    icon: Pill,
  },
];

const stats = [
  { value: "2,000+", label: "Men Transformed", icon: Users },
  { value: "4.8/5", label: "Average Rating", icon: Star },
  { value: "100%", label: "Natural Formula", icon: Atom },
  { value: "30-Day", label: "Money-Back Promise", icon: ShieldCheck },
];

const testimonials = [
  {
    name: "Thabo M.",
    location: "Johannesburg",
    rating: 5,
    text: "I was skeptical, but within two weeks the difference was undeniable. My confidence is back and so is my stamina. My wife noticed before I even said anything.",
  },
  {
    name: "Riaan V.",
    location: "Cape Town",
    rating: 5,
    text: "After 40 things started slipping. This turned it around completely — harder, lasting longer, and I actually want it again. Wish I'd found it sooner.",
  },
  {
    name: "Sipho D.",
    location: "Durban",
    rating: 5,
    text: "Discreet packaging, fast delivery, and it actually works. No weird side effects like the pharmacy stuff. This is the real deal for me now.",
  },
];

const trustBar = [
  { icon: Truck, label: "Free Discreet Shipping" },
  { icon: ShieldCheck, label: "30-Day Money-Back Guarantee" },
  { icon: Atom, label: "100% Natural Formula" },
  { icon: Lock, label: "Secure Checkout" },
  { icon: Users, label: "Trusted by 2,000+ Men" },
];

const quizQuestions = [
  {
    id: 1,
    question: "HOW WOULD YOU RATE YOUR STAMINA AND LIBIDO IN THE BEDROOM?",
    options: [
      { label: "LOW — I DON'T LAST AS LONG AS I WANT TO", value: "low" },
      { label: "MODERATE — SOMETIMES I STRUGGLE", value: "medium" },
      { label: "STRONG — I GO THE DISTANCE", value: "high" },
    ],
  },
  {
    id: 2,
    question:
      "DO YOU EVER STRUGGLE WITH ERECTILE DYSFUNCTION — GETTING OR STAYING FIRM?",
    options: [
      { label: "OFTEN — IT'S A REAL PROBLEM FOR ME", value: "low" },
      { label: "SOMETIMES — UNDER STRESS OR PRESSURE", value: "medium" },
      { label: "RARELY — I'M ROCK SOLID", value: "high" },
    ],
  },
  {
    id: 3,
    question: "HOW'S YOUR LIBIDO AND SEX DRIVE COMPARED TO A FEW YEARS AGO?",
    options: [
      { label: "WAY DOWN — I BARELY THINK ABOUT IT", value: "low" },
      { label: "SOMEWHAT LOWER — NOT WHAT IT USED TO BE", value: "medium" },
      { label: "STRONG — MY DRIVE IS STILL INTACT", value: "high" },
    ],
  },
  {
    id: 4,
    question: "DOES STRESS OR FATIGUE KILL YOUR PERFORMANCE?",
    options: [
      { label: "ALWAYS — STRESS DESTROYS MY PERFORMANCE", value: "low" },
      { label: "SOMETIMES — IT DEPENDS ON THE DAY", value: "medium" },
      { label: "RARELY — I PERFORM NO MATTER WHAT", value: "high" },
    ],
  },
  {
    id: 5,
    question: "ARE YOU READY TO TAKE BACK CONTROL IN THE BEDROOM?",
    options: [
      { label: "ABSOLUTELY — I'M DONE SETTLING", value: "low" },
      { label: "MAYBE — I WANT TO SEE WHAT'S POSSIBLE", value: "medium" },
      { label: "I'M GOOD — BUT I WANT TO LEVEL UP", value: "high" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  SHARED PRIMITIVES                                                  */
/* ------------------------------------------------------------------ */

/** High-conversion gold CTA with animated sheen + optional pulsing glow */
function GoldCTA({
  children,
  onClick,
  href,
  pulse = false,
  className = "",
  size = "lg",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  pulse?: boolean;
  className?: string;
  size?: "lg" | "default";
}) {
  const classes = `btn-shimmer rounded-none bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black font-black tracking-wider uppercase hover:brightness-110 transition-all ${
    size === "lg" ? "h-14 px-10 text-sm" : "h-11 px-6 text-xs"
  } ${pulse ? "animate-pulse-glow" : ""} ${className}`;

  if (href) {
    return (
      <Button asChild size={size} className={classes}>
        <a href={href}>{children}</a>
      </Button>
    );
  }
  return (
    <Button size={size} className={classes} onClick={onClick}>
      {children}
    </Button>
  );
}

function SectionHeading({
  badge,
  badgeIcon: BadgeIcon,
  children,
  subtitle,
}: {
  badge: string;
  badgeIcon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16 lg:mb-20"
    >
      <Badge className="mb-4 bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs">
        {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5 mr-1.5" />}
        {badge}
      </Badge>
      <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
        {children}
      </h2>
      {subtitle && (
        <p className="mt-6 text-foreground/50 max-w-2xl mx-auto text-lg font-light">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  STRUCTURE                                                          */
/* ------------------------------------------------------------------ */

function AnnouncementBar() {
  const items = [...trustBar, ...trustBar];
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-gradient-to-r from-gold-dark via-gold to-gold-dark overflow-hidden flex items-center">
      <div className="animate-marquee flex shrink-0 items-center gap-10 whitespace-nowrap pl-10">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-black/80"
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Navbar({ onOrderNow }: { onOrderNow: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-9 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg shadow-black/50 border-b border-gold/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src="/api/logo"
            alt="Male Vitamin Logo"
            className="h-9 w-9 object-contain"
          />
          <span className="text-xl font-black tracking-widest text-gold uppercase">
            Male Vitamin
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-foreground/60">
          <a href="#benefits" className="hover:text-gold transition-colors duration-200">
            Benefits
          </a>
          <a href="#ingredients" className="hover:text-gold transition-colors duration-200">
            Ingredients
          </a>
          <a href="#reviews" className="hover:text-gold transition-colors duration-200">
            Reviews
          </a>
          <a href="#quiz" className="hover:text-gold transition-colors duration-200">
            Take Quiz
          </a>
          <GoldCTA size="default" onClick={onOrderNow}>
            Order Now
          </GoldCTA>
        </div>
        <Button
          size="sm"
          className="md:hidden btn-shimmer rounded-none bg-gold text-black font-black tracking-wider uppercase hover:bg-gold-light"
          onClick={onOrderNow}
        >
          Order
        </Button>
      </div>
    </motion.nav>
  );
}

function HeroSection({ onOrderNow }: { onOrderNow: () => void }) {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden pt-24"
    >
      {/* Deep black background with texture */}
      <div className="absolute inset-0 bg-[#0a0a08]" />
      <div className="absolute inset-0 texture-overlay" />

      {/* Diagonal gold light beams */}
      <div className="light-beam" style={{ top: "40%", left: "-20%" }} />
      <div className="light-beam" style={{ top: "60%", left: "-20%", opacity: 0.5 }} />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/[0.03] rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <Badge className="mb-6 bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs">
            <Crown className="h-3.5 w-3.5 mr-1.5" />
            Libido & Erectile Dysfunction Supplement
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]">
            <span className="gold-gradient-text">RECLAIM</span>
            <br />
            <span className="gold-gradient-text">YOUR LIBIDO</span>
          </h1>
          <p className="mt-8 text-lg text-foreground/60 leading-relaxed max-w-xl font-light">
            Struggling with erectile dysfunction or lost libido? You&apos;re not
            alone — and it doesn&apos;t have to be this way. Our formula is
            engineered for men who refuse to settle — harder erections, stronger
            libido, lasting stamina, and the confidence to back it up. In the
            bedroom and everywhere else.
          </p>

          {/* Rating row */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
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
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
                <span className="ml-1.5 text-sm font-black text-gold">4.8</span>
              </div>
              <p className="text-xs text-foreground/40 font-bold tracking-wider uppercase mt-1">
                Trusted by 2,000+ Men
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <GoldCTA onClick={onOrderNow} pulse>
              Order Now — {PRICE}
              <ArrowRight className="ml-2 h-5 w-5" />
            </GoldCTA>
            <Button
              size="lg"
              variant="outline"
              className="rounded-none border-gold/30 text-gold font-bold tracking-wider uppercase text-sm hover:bg-gold/10 hover:border-gold/50 h-14 px-10"
              asChild
            >
              <a href="#quiz">Take The Quiz</a>
            </Button>
          </div>

          {/* Micro trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground/40 font-bold tracking-widest uppercase">
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-gold/50" /> Free Shipping
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-gold/50" /> 30-Day Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4 text-gold/50" /> Discreet Packaging
            </span>
          </div>
        </motion.div>

        {/* Product image */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 bg-gold/5 rounded-2xl blur-3xl scale-90" />
          <div className="relative bg-gradient-to-br from-[#1a1a15] to-[#0d0d0a] rounded-2xl p-8 sm:p-12 border border-gold/15 gold-glow-strong">
            {/* Scarcity ribbon */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1.5 bg-gold text-black text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-none shadow-lg">
                <Flame className="h-3.5 w-3.5" /> Selling Fast
              </span>
            </div>
            <div className="animate-float">
              <Image
                src="/product-image.webp"
                alt="Male Vitamin Premium Supplement"
                width={320}
                height={320}
                priority
                className="w-72 h-72 sm:w-80 sm:h-80 object-contain drop-shadow-2xl mx-auto"
              />
            </div>
            <div className="mt-8 text-center">
              <p className="text-4xl font-black text-gold tracking-wide">
                {PRICE}
              </p>
              <Badge className="mt-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-none font-bold tracking-widest uppercase text-xs">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                In Stock — Ships Today
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsStrip() {
  return (
    <section className="relative bg-[#0d0d0a] border-y border-gold/10 texture-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="h-6 w-6 text-gold mx-auto mb-3" />
              <p className="text-3xl sm:text-4xl font-black gold-gradient-text">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-foreground/40 font-bold tracking-widest uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="py-24 lg:py-32 bg-[#0a0a08] texture-overlay relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Key Benefits"
          subtitle="Real results where they matter most. Our formula doesn't just make promises — it delivers transformation you can feel from day one."
        >
          <span className="gold-gradient-text">WHAT YOU&apos;LL</span>{" "}
          <span className="text-foreground">EXPERIENCE</span>
        </SectionHeading>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 group gold-glow">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-none bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors border border-gold/20">
                    <benefit.icon className="h-7 w-7 text-gold" />
                  </div>
                  <p className="text-xs text-gold/60 font-bold tracking-widest uppercase mb-1">
                    {benefit.subtitle}
                  </p>
                  <CardTitle className="text-xl font-black tracking-wider text-foreground">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/50 leading-relaxed font-light">
                    {benefit.description}
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

function WhyChooseSection() {
  return (
    <section
      id="why-choose"
      className="py-24 lg:py-32 bg-[#0d0d0a] texture-overlay relative overflow-hidden"
    >
      <div className="light-beam" style={{ top: "50%", left: "-20%" }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="The Standard"
          subtitle="We don't compromise. Every element of our supplement is engineered for men who demand the best."
        >
          <span className="text-foreground">WHY CHOOSE</span>{" "}
          <span className="gold-gradient-text">OURS?</span>
        </SectionHeading>

        <div className="grid md:grid-cols-3 gap-6">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 group gold-glow">
                <CardHeader>
                  <div className="w-14 h-14 rounded-none bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors border border-gold/20">
                    <item.icon className="h-7 w-7 text-gold" />
                  </div>
                  <CardTitle className="text-xl font-black tracking-wider text-foreground">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/50 leading-relaxed font-light">
                    {item.description}
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

function IngredientsSection() {
  return (
    <section
      id="ingredients"
      className="py-24 lg:py-32 bg-[#0a0a08] texture-overlay relative"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="The Arsenal"
          subtitle="Every ingredient chosen for one purpose: to make you stronger, harder, and more unstoppable where it counts."
        >
          <span className="gold-gradient-text">POWERED BY</span>{" "}
          <span className="text-foreground">NATURE&apos;S BEST</span>
        </SectionHeading>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ingredients.map((ingredient, i) => (
            <motion.div
              key={ingredient.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-none bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors border border-gold/15">
                      <ingredient.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm tracking-wider text-foreground">
                        {ingredient.name}
                      </h3>
                      <p className="mt-2 text-foreground/45 text-sm leading-relaxed font-light">
                        {ingredient.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section
      id="reviews"
      className="py-24 lg:py-32 bg-[#0d0d0a] texture-overlay relative overflow-hidden"
    >
      <div className="light-beam" style={{ top: "40%", left: "-20%" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold/[0.04] rounded-full blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Real Men, Real Results"
          badgeIcon={Star}
          subtitle="Thousands of South African men have already taken back control. Here's what they're saying."
        >
          <span className="text-foreground">WHAT MEN ARE</span>{" "}
          <span className="gold-gradient-text">SAYING</span>
        </SectionHeading>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/30 transition-all duration-300 gold-glow relative">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-gold/30 mb-4" />
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-foreground/60 leading-relaxed font-light italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-6 pt-5 border-t border-gold/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-black">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-sm tracking-wider text-foreground">
                        {t.name}
                      </p>
                      <p className="text-xs text-foreground/40 font-bold tracking-widest uppercase flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                        Verified · {t.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuizSection({ onOrderNow }: { onOrderNow: () => void }) {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const progress = showResult
    ? 100
    : (currentQuestion / quizQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const getRecommendation = () => {
    const lowCount = Object.values(answers).filter((v) => v === "low").length;
    const medCount = Object.values(answers).filter((v) => v === "medium").length;

    if (lowCount >= 3) {
      return {
        title: "YOUR PERFORMANCE NEEDS REINFORCEMENT",
        description:
          "Based on your answers, you're not where you want to be — and that ends now. L-Arginine supercharges blood flow for stronger, firmer results. Tribulus and Maca reignite your drive and stamina. This is the exact stack to get you performing like you were built to.",
        match: "EXTREMELY HIGH MATCH",
        matchPercent: 97,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
      };
    }
    if (lowCount >= 1 || medCount >= 2) {
      return {
        title: "YOU'VE GOT THE BASE — NOW UNLOCK YOUR PEAK",
        description:
          "You're not struggling, but you're not dominating either. Ginseng Extract fights the fatigue that kills your second wind. Zinc and Fenugreek push your testosterone and stamina into the zone where you perform on command — not just when the stars align.",
        match: "HIGH MATCH",
        matchPercent: 85,
        color: "text-gold",
        bgColor: "bg-gold/10",
        borderColor: "border-gold/30",
      };
    }
    return {
      title: "STRONG BASE — NOW MAKE IT UNSTOPPABLE",
      description:
        "You're already performing well, but why settle for good? Our formula keeps your edge razor-sharp for the long haul — protecting your drive, your stamina, and your ability to deliver every single time. Think of it as armor for your performance.",
      match: "GOOD MATCH",
      matchPercent: 72,
      color: "text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/30",
    };
  };

  const resetQuiz = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  return (
    <section
      id="quiz"
      className="py-24 lg:py-32 bg-[#0a0a08] texture-overlay relative overflow-hidden"
    >
      <div className="light-beam" style={{ top: "30%", left: "-20%" }} />
      <div className="light-beam" style={{ top: "70%", left: "-20%", opacity: 0.3 }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[150px]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading badge="Free Assessment" badgeIcon={Trophy}>
          <span className="gold-gradient-text">DISCOVER YOUR</span>
          <br />
          <span className="text-foreground">VITALITY SCORE</span>
        </SectionHeading>

        {!started ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-[#111110] border border-gold/20 gold-glow-strong">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 rounded-none bg-gold/10 flex items-center justify-center mx-auto mb-6 border border-gold/20">
                  <Target className="h-10 w-10 text-gold" />
                </div>
                <h3 className="text-2xl font-black tracking-wide text-foreground mb-3">
                  READY TO RECLAIM YOUR EDGE?
                </h3>
                <p className="text-foreground/50 mb-8 max-w-md mx-auto font-light">
                  5 honest questions about your stamina, performance, and drive.
                  Completely private. Takes less than 2 minutes — and you&apos;ll
                  get a personalized recommendation instantly.
                </p>
                <GoldCTA onClick={() => setStarted(true)} pulse>
                  Start The Assessment
                  <ChevronRight className="ml-1 h-5 w-5" />
                </GoldCTA>
                <div className="mt-8 flex items-center justify-center gap-6 text-xs text-foreground/30 font-bold tracking-widest uppercase">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> 2 Min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Fingerprint className="h-3.5 w-3.5" /> 100% Private
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" /> Free
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="bg-[#111110] border border-gold/20 gold-glow overflow-hidden">
            <div className="h-1.5 bg-[#1a1a15]">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            <CardContent className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div
                    key={`q-${currentQuestion}`}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="mb-2 text-xs font-black tracking-widest text-gold/60 uppercase">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-wide text-foreground mb-8">
                      {quizQuestions[currentQuestion].question}
                    </h3>

                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, idx) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleAnswer(option.value)}
                          className={`group w-full text-left p-4 sm:p-5 border transition-all duration-200 cursor-pointer rounded-none flex items-center gap-4
                            ${
                              answers[currentQuestion] === option.value
                                ? "border-gold bg-gold/10 text-gold"
                                : "border-gold/10 bg-[#0d0d0a] text-foreground/60 hover:border-gold/40 hover:bg-gold/5 hover:text-foreground"
                            }`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-gold/30 text-xs font-black text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="font-bold text-sm tracking-wider">
                            {option.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {(() => {
                      const rec = getRecommendation();
                      return (
                        <div className="text-center">
                          <div
                            className={`w-20 h-20 rounded-none ${rec.bgColor} flex items-center justify-center mx-auto mb-6 border ${rec.borderColor}`}
                          >
                            <Trophy className="h-10 w-10 text-gold" />
                          </div>

                          <Badge
                            className={`${rec.bgColor} ${rec.color} border ${rec.borderColor} rounded-none font-black tracking-widest uppercase text-xs mb-4`}
                          >
                            {rec.match}
                          </Badge>

                          <h3 className="text-2xl sm:text-3xl font-black tracking-wide text-foreground mb-4">
                            {rec.title}
                          </h3>

                          <p className="text-foreground/50 leading-relaxed max-w-lg mx-auto mb-8 font-light">
                            {rec.description}
                          </p>

                          <div className="max-w-sm mx-auto mb-10">
                            <div className="flex justify-between text-xs mb-2 font-black tracking-widest uppercase">
                              <span className="text-foreground/40">Your Match</span>
                              <span className={`font-black ${rec.color}`}>
                                {rec.matchPercent}%
                              </span>
                            </div>
                            <Progress
                              value={rec.matchPercent}
                              className="h-3 bg-[#1a1a15]"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <GoldCTA onClick={onOrderNow} pulse>
                              <Package className="mr-2 h-5 w-5" />
                              Order Now — {PRICE}
                            </GoldCTA>
                            <Button
                              size="lg"
                              variant="outline"
                              className="rounded-none border-gold/20 text-gold/70 font-bold tracking-wider uppercase text-sm hover:bg-gold/5 hover:border-gold/40 h-14 px-10"
                              onClick={resetQuiz}
                            >
                              Retake Quiz
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

function ExploreSolutionsSection() {
  const solutions = [
    {
      icon: Heart,
      title: "Natural ED Supplement",
      description:
        "Get harder, firmer erections naturally with our blood flow optimizing formula.",
      href: "/ed-supplement",
    },
    {
      icon: Zap,
      title: "Testosterone Booster",
      description:
        "Restore your T-levels, drive and confidence with Zinc, Tribulus & Fenugreek.",
      href: "/testosterone-booster",
    },
    {
      icon: Battery,
      title: "Stamina Supplement",
      description:
        "Last longer and perform stronger with Maca Root, Ginseng & L-Arginine.",
      href: "/stamina-supplement",
    },
    {
      icon: Flame,
      title: "Libido Enhancer",
      description:
        "Reignite your desire and passion with Tribulus, Maca & Fenugreek.",
      href: "/libido-enhancer",
    },
    {
      icon: Trophy,
      title: "Male Performance",
      description:
        "Total bedroom dominance — all 6 ingredients for comprehensive performance.",
      href: "/male-performance",
    },
  ];

  return (
    <section
      id="solutions"
      className="py-24 lg:py-32 bg-[#0a0a08] texture-overlay relative overflow-hidden"
    >
      <div className="light-beam" style={{ top: "30%", left: "-20%" }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Targeted Solutions"
          subtitle="Every man's needs are different. Find the targeted solution that addresses your specific challenge — or go all-in with our comprehensive performance formula."
        >
          <span className="gold-gradient-text">EXPLORE OUR</span>{" "}
          <span className="text-foreground">SOLUTIONS</span>
        </SectionHeading>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, i) => (
            <motion.div
              key={solution.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={solution.href}>
                <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 group gold-glow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 rounded-none bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors border border-gold/20">
                      <solution.icon className="h-7 w-7 text-gold" />
                    </div>
                    <CardTitle className="text-xl font-black tracking-wider text-foreground">
                      {solution.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/50 leading-relaxed font-light mb-4">
                      {solution.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-gold text-xs font-bold tracking-widest uppercase group-hover:gap-2 transition-all">
                      Learn More <ChevronRight className="h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ onOrderNow }: { onOrderNow: () => void }) {
  return (
    <section
      id="order"
      className="py-24 lg:py-32 bg-[#0d0d0a] texture-overlay relative overflow-hidden"
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
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/[0.03] rounded-full translate-y-1/2 -translate-x-1/2 blur-[60px]" />
            <CardContent className="relative p-8 sm:p-16 text-center">
              <Badge className="mb-6 bg-gold/15 text-gold border border-gold/40 rounded-none font-black tracking-widest uppercase text-xs">
                <Flame className="h-3.5 w-3.5 mr-1.5" />
                Limited Stock — Order Today
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                <span className="gold-gradient-text">ELEVATE YOUR</span>
                <br />
                <span className="gold-gradient-text">VITALITY TODAY</span>
              </h2>
              <p className="text-foreground/50 max-w-2xl mx-auto text-lg mb-6 font-light">
                Join thousands of men who stopped accepting mediocre performance.
                Stronger stamina. Harder results. The confidence of knowing
                you&apos;ll deliver every time. One decision changes everything.
              </p>

              <p className="text-5xl font-black gold-gradient-text mb-8 tracking-wide">
                {PRICE}
              </p>

              <GoldCTA onClick={onOrderNow} pulse className="!px-12">
                Order Now — Secure Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </GoldCTA>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-foreground/40 font-bold tracking-widest uppercase">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-gold/50" /> Free Shipping
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-gold/50" /> 30-Day Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-gold/50" /> Discreet Packaging
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-gold/50" /> Secure Payment
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function StickyMobileCTA({ onOrderNow }: { onOrderNow: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-gold/30 px-4 py-3 flex items-center justify-between gap-3"
        >
          <div>
            <p className="text-[10px] text-foreground/40 font-bold tracking-widest uppercase">
              Male Vitamin
            </p>
            <p className="text-lg font-black text-gold leading-none">{PRICE}</p>
          </div>
          <Button
            onClick={onOrderNow}
            className="btn-shimmer flex-1 max-w-[200px] rounded-none bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black font-black tracking-wider uppercase text-sm h-12 hover:brightness-110"
          >
            Order Now
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  return (
    <footer className="bg-[#050504] border-t border-gold/10 py-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
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
          <div>
            <h4 className="font-black text-xs tracking-widest uppercase text-gold/60 mb-4">
              Solutions
            </h4>
            <ul className="space-y-2 text-sm text-foreground/30 font-light">
              <li>
                <Link href="/ed-supplement" className="hover:text-gold transition-colors">
                  Natural ED Supplement
                </Link>
              </li>
              <li>
                <Link href="/testosterone-booster" className="hover:text-gold transition-colors">
                  Testosterone Booster
                </Link>
              </li>
              <li>
                <Link href="/stamina-supplement" className="hover:text-gold transition-colors">
                  Stamina Supplement
                </Link>
              </li>
              <li>
                <Link href="/libido-enhancer" className="hover:text-gold transition-colors">
                  Libido Enhancer
                </Link>
              </li>
              <li>
                <Link href="/male-performance" className="hover:text-gold transition-colors">
                  Male Performance
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs tracking-widest uppercase text-gold/60 mb-4">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-foreground/30 font-light">
              <li>
                <a href="#benefits" className="hover:text-gold transition-colors">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#ingredients" className="hover:text-gold transition-colors">
                  Ingredients
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-gold transition-colors">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#quiz" className="hover:text-gold transition-colors">
                  Vitality Quiz
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs tracking-widest uppercase text-gold/60 mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-foreground/30 font-light">
              <li>
                <Link href="/faqs" className="hover:text-gold transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-gold transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-gold transition-colors">
                  Returns
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
                <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-gold transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-foreground/15 hover:text-gold/50 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gold/5 text-center text-xs text-foreground/20 font-bold tracking-widest uppercase">
          <p>
            &copy; {new Date().getFullYear()} Male Vitamin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Male Vitamin",
      url: "https://malevitamin.co.za",
      logo: "https://malevitamin.co.za/api/logo",
      description:
        "South Africa's premium natural male supplement for erectile dysfunction and low libido. L-Arginine, Tribulus, Maca Root & Ginseng formula.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        areaServed: "ZA",
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
        "Natural supplement for harder erections, stronger libido and lasting stamina. Contains L-Arginine, Tribulus Terrestris, Maca Root, Ginseng Extract, Zinc & Fenugreek.",
      image: "https://m.media-amazon.com/images/I/71xRshg7h8L._AC_UF1000,1000_QL80_.jpg",
      brand: { "@type": "Brand", name: "Male Vitamin" },
      offers: {
        "@type": "Offer",
        price: "850.00",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
        url: "https://malevitamin.co.za",
        priceValidUntil: "2027-12-31",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "2000",
      },
    },
  ],
};

export default function Home() {
  const [showPayment, setShowPayment] = useState(false);
  const openPayment = () => setShowPayment(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a08]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <AnnouncementBar />
      <Navbar onOrderNow={openPayment} />
      <main className="flex-1">
        <HeroSection onOrderNow={openPayment} />
        <StatsStrip />
        <BenefitsSection />
        <WhyChooseSection />
        <IngredientsSection />
        <TestimonialsSection />
        <QuizSection onOrderNow={openPayment} />
        <ExploreSolutionsSection />
        <CTASection onOrderNow={openPayment} />
      </main>
      <Footer />
      <StickyMobileCTA onOrderNow={openPayment} />
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
    </div>
  );
}
