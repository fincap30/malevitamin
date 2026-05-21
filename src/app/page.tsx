"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Package,
  Clock,
  Award,
  Swords,
  Dumbbell,
  Crown,
  Fingerprint,
  Atom,
  Pill,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const benefits = [
  {
    icon: Zap,
    title: "ENHANCED ENERGY",
    subtitle: "Dominate Your Day",
    description:
      "Power through with sustained, relentless energy. Our formula obliterates fatigue at its source so you stay sharp and unstoppable from morning to night — no crashes, no excuses.",
  },
  {
    icon: Swords,
    title: "UNSHAKEABLE CONFIDENCE",
    subtitle: "Own Every Room",
    description:
      "When your body gets what it craves, confidence isn't optional — it's automatic. Step into every situation knowing you're at your peak, in the boardroom, the gym, and beyond.",
  },
  {
    icon: Heart,
    title: "TOTAL SATISFACTION",
    subtitle: "No Compromises",
    description:
      "Balanced hormones and maximized circulation deliver a level of satisfaction most men only dream about. Experience what it means to be truly fulfilled — in every area of life.",
  },
];

const whyChoose = [
  {
    icon: Crown,
    title: "PREMIUM INGREDIENTS",
    description:
      "Every ingredient is meticulously selected for maximum purity and potency. We source only pharmaceutical-grade raw materials that pass the most rigorous quality standards — because you deserve nothing less.",
  },
  {
    icon: Shield,
    title: "PROVEN & SAFE",
    description:
      "Engineered with your health as the top priority. Every batch is third-party tested to guarantee safety, consistency, and results. No shortcuts, no compromises, no exceptions.",
  },
  {
    icon: Flame,
    title: "TOTAL OPTIMIZATION",
    description:
      "This isn't a band-aid solution. Our holistic approach optimizes your entire system — energy, hormones, circulation, and vitality — for lasting, transformational results you can feel.",
  },
];

const ingredients = [
  {
    name: "L-ARGININE",
    description:
      "An amino acid that supports blood flow and overall circulation, promoting improved performance and stamina.",
    icon: TrendingUp,
  },
  {
    name: "TRIBULUS TERRESTRIS",
    description:
      "A powerful plant extract traditionally used to enhance vitality and overall well-being.",
    icon: Dumbbell,
  },
  {
    name: "MACA ROOT",
    description:
      "Known for its energy-boosting properties, this root increases endurance and supports hormonal balance.",
    icon: Zap,
  },
  {
    name: "GINSENG EXTRACT",
    description:
      "A natural adaptogen that reduces fatigue and enhances physical performance under pressure.",
    icon: Target,
  },
  {
    name: "ZINC",
    description:
      "An essential mineral crucial for supporting immune function and maintaining healthy testosterone levels.",
    icon: Atom,
  },
  {
    name: "FENUGREEK EXTRACT",
    description:
      "Known to support hormonal health, boost vitality, and enhance overall male performance.",
    icon: Pill,
  },
];

const quizQuestions = [
  {
    id: 1,
    question: "HOW WOULD YOU RATE YOUR CURRENT ENERGY LEVELS?",
    options: [
      { label: "LOW — I'M RUNNING ON EMPTY", value: "low" },
      { label: "MODERATE — INCONSISTENT AT BEST", value: "medium" },
      { label: "HIGH — I'M CHARGED UP", value: "high" },
    ],
  },
  {
    id: 2,
    question: "HOW CONFIDENT ARE YOU IN YOUR DAILY PERFORMANCE?",
    options: [
      { label: "NOT CONFIDENT — I KNOW I CAN DO BETTER", value: "low" },
      { label: "SOMEWHAT — ROOM FOR IMPROVEMENT", value: "medium" },
      { label: "VERY CONFIDENT — I'M AT MY PEAK", value: "high" },
    ],
  },
  {
    id: 3,
    question: "HOW SATISFIED ARE YOU WITH YOUR OVERALL WELLNESS?",
    options: [
      { label: "UNSATISFIED — I NEED REAL CHANGE", value: "low" },
      { label: "IT'S OKAY — BUT I WANT MORE", value: "medium" },
      { label: "VERY SATISFIED — I FEEL GREAT", value: "high" },
    ],
  },
  {
    id: 4,
    question: "DOES STRESS AFFECT YOUR PERFORMANCE?",
    options: [
      { label: "OFTEN — STRESS CRUSHES ME", value: "low" },
      { label: "SOMETIMES — I MANAGE BUT NEED SUPPORT", value: "medium" },
      { label: "RARELY — I HANDLE IT", value: "high" },
    ],
  },
  {
    id: 5,
    question: "ARE YOU READY FOR A NATURAL VITALITY SOLUTION?",
    options: [
      { label: "ABSOLUTELY — I'M READY TO DOMINATE", value: "low" },
      { label: "MAYBE — I WANT TO LEARN MORE", value: "medium" },
      { label: "NOT REALLY — I PREFER OTHER WAYS", value: "high" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                         */
/* ------------------------------------------------------------------ */

function Navbar() {
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
        <div className="flex items-center gap-2.5">
          <Flame className="h-7 w-7 text-gold" />
          <span className="text-xl font-black tracking-widest text-gold uppercase">
            Male Vitamine
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-foreground/60">
          <a
            href="#benefits"
            className="hover:text-gold transition-colors duration-200"
          >
            Benefits
          </a>
          <a
            href="#ingredients"
            className="hover:text-gold transition-colors duration-200"
          >
            Ingredients
          </a>
          <a
            href="#quiz"
            className="hover:text-gold transition-colors duration-200"
          >
            Take Quiz
          </a>
          <Button
            size="sm"
            className="rounded-none bg-gold text-black font-black tracking-wider uppercase hover:bg-gold-light"
          >
            Order Now
          </Button>
        </div>
        <Button
          size="sm"
          className="md:hidden rounded-none bg-gold text-black font-black tracking-wider uppercase hover:bg-gold-light"
        >
          Order
        </Button>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Deep black background with texture */}
      <div className="absolute inset-0 bg-[#0a0a08]" />
      <div className="absolute inset-0 texture-overlay" />

      {/* Diagonal gold light beam */}
      <div className="light-beam" style={{ top: "40%", left: "-20%" }} />
      <div
        className="light-beam"
        style={{ top: "60%", left: "-20%", opacity: 0.5 }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/3 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Badge className="mb-6 bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs">
            <Crown className="h-3.5 w-3.5 mr-1.5" />
            Premium Performance Supplement
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]">
            <span className="gold-gradient-text">RECLAIM</span>
            <br />
            <span className="gold-gradient-text">YOUR EDGE</span>
          </h1>
          <p className="mt-8 text-lg text-foreground/60 leading-relaxed max-w-xl font-light">
            Discover our unique formula for men&apos;s vitality, libido and
            wellness. Crafted with high-quality, safe ingredients to ensure you
            feel your best and achieve peak performance — even under
            pressure.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-14 px-10"
              asChild
            >
              <a href="#quiz">
                Take The Quiz <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-none border-gold/30 text-gold font-bold tracking-wider uppercase text-sm hover:bg-gold/10 hover:border-gold/50 h-14 px-10"
              asChild
            >
              <a href="#benefits">Learn More</a>
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

        {/* Product image */}
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

function BenefitsSection() {
  return (
    <section
      id="benefits"
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
            Key Benefits
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="gold-gradient-text">WHAT YOU&apos;LL</span>{" "}
            <span className="text-foreground">EXPERIENCE</span>
          </h2>
          <p className="mt-6 text-foreground/50 max-w-2xl mx-auto text-lg font-light">
            Real results. No compromises. Our formula delivers transformational
            benefits you can feel from day one.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/30 transition-all duration-300 group gold-glow">
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
    <section className="py-24 lg:py-32 bg-[#0d0d0a] texture-overlay relative overflow-hidden">
      {/* Diagonal light beam */}
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
            The Standard
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="text-foreground">WHY CHOOSE</span>{" "}
            <span className="gold-gradient-text">OURS?</span>
          </h2>
          <p className="mt-6 text-foreground/50 max-w-2xl mx-auto text-lg font-light">
            We don&apos;t compromise. Every element of our supplement is
            engineered for men who demand the best.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/30 transition-all duration-300 group gold-glow">
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
            <span className="gold-gradient-text">POWERED BY</span>{" "}
            <span className="text-foreground">NATURE&apos;S BEST</span>
          </h2>
          <p className="mt-6 text-foreground/50 max-w-2xl mx-auto text-lg font-light">
            Every ingredient hand-picked for its proven benefits and
            synergistic effects within our formula.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ingredients.map((ingredient, i) => (
            <motion.div
              key={ingredient.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full bg-[#111110] border border-gold/10 hover:border-gold/25 transition-all duration-300 group">
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

function QuizSection() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const progress = showResult
    ? 100
    : ((currentQuestion) / quizQuestions.length) * 100;

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
    const medCount = Object.values(answers).filter(
      (v) => v === "medium"
    ).length;

    if (lowCount >= 3) {
      return {
        title: "YOUR VITALITY NEEDS A BOOST",
        description:
          "Based on your answers, you could greatly benefit from our premium supplement. The combination of L-Arginine, Tribulus Terrestris, and Maca Root is specifically designed to address the areas where you need the most support — energy, confidence, and overall satisfaction.",
        match: "EXTREMELY HIGH MATCH",
        matchPercent: 97,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
      };
    }
    if (lowCount >= 1 || medCount >= 2) {
      return {
        title: "YOU'RE ON THE RIGHT TRACK — LET'S OPTIMIZE",
        description:
          "You have a solid foundation, but there's room to elevate your vitality. Our supplement's blend of Ginseng Extract, Zinc, and Fenugreek can help you break through plateaus and achieve the peak performance you're striving for.",
        match: "HIGH MATCH",
        matchPercent: 85,
        color: "text-gold",
        bgColor: "bg-gold/10",
        borderColor: "border-gold/30",
      };
    }
    return {
      title: "STRONG FOUNDATION — MAINTAIN YOUR EDGE",
      description:
        "You're already performing well! Our supplement can help you maintain and protect your vitality long-term. Think of it as insurance for your energy, confidence, and wellness — keeping you at your peak for years to come.",
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
      className="py-24 lg:py-32 bg-[#0d0d0a] texture-overlay relative overflow-hidden"
    >
      {/* Diagonal light beams */}
      <div className="light-beam" style={{ top: "30%", left: "-20%" }} />
      <div className="light-beam" style={{ top: "70%", left: "-20%", opacity: 0.3 }} />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[150px]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs">
            <Trophy className="h-3.5 w-3.5 mr-1.5" />
            Free Assessment
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="gold-gradient-text">DISCOVER YOUR</span>
            <br />
            <span className="text-foreground">VITALITY SCORE</span>
          </h2>
          <p className="mt-6 text-foreground/50 max-w-xl mx-auto text-lg font-light">
            Take this quick 5-question assessment and get a personalized
            recommendation based on your unique needs.
          </p>
        </motion.div>

        {!started ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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
                  Answer 5 quick questions about your energy, confidence, and
                  wellness goals. Takes less than 2 minutes.
                </p>
                <Button
                  size="lg"
                  className="rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-14 px-10"
                  onClick={() => setStarted(true)}
                >
                  Start The Assessment{" "}
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
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
            {/* Progress bar */}
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
                      Question {currentQuestion + 1} of{" "}
                      {quizQuestions.length}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-wide text-foreground mb-8">
                      {quizQuestions[currentQuestion].question}
                    </h3>

                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map(
                        (option) => (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleAnswer(option.value)}
                            className={`w-full text-left p-4 sm:p-5 border transition-all duration-200 cursor-pointer rounded-none
                              ${
                                answers[currentQuestion] === option.value
                                  ? "border-gold bg-gold/10 text-gold"
                                  : "border-gold/10 bg-[#0d0d0a] text-foreground/60 hover:border-gold/30 hover:bg-gold/5 hover:text-foreground"
                              }`}
                          >
                            <span className="font-bold text-sm tracking-wider">
                              {option.label}
                            </span>
                          </motion.button>
                        )
                      )}
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

                          {/* Match meter */}
                          <div className="max-w-sm mx-auto mb-10">
                            <div className="flex justify-between text-xs mb-2 font-black tracking-widest uppercase">
                              <span className="text-foreground/40">
                                Your Match
                              </span>
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
                            <Button
                              size="lg"
                              className="rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-14 px-10"
                            >
                              <Package className="mr-2 h-5 w-5" />
                              Order Now — R 850.00
                            </Button>
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

function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-[#0a0a08] texture-overlay relative overflow-hidden">
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
                <span className="gold-gradient-text">ELEVATE YOUR</span>
                <br />
                <span className="gold-gradient-text">VITALITY TODAY</span>
              </h2>
              <p className="text-foreground/50 max-w-2xl mx-auto text-lg mb-10 font-light">
                Join thousands of men who have already transformed their energy,
                confidence, and satisfaction. Your best self is one decision
                away.
              </p>
              <Button
                size="lg"
                className="rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-14 px-12"
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

function Footer() {
  return (
    <footer className="bg-[#050504] border-t border-gold/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Flame className="h-6 w-6 text-gold" />
              <span className="text-lg font-black tracking-widest text-gold uppercase">
                Male Vitamine
              </span>
            </div>
            <p className="text-sm text-foreground/30 leading-relaxed font-light">
              Premium men&apos;s vitality supplement crafted with high-quality,
              safe ingredients for peak performance.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs tracking-widest uppercase text-gold/60 mb-4">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-foreground/30 font-light">
              <li>
                <a
                  href="#benefits"
                  className="hover:text-gold transition-colors"
                >
                  Benefits
                </a>
              </li>
              <li>
                <a
                  href="#ingredients"
                  className="hover:text-gold transition-colors"
                >
                  Ingredients
                </a>
              </li>
              <li>
                <a
                  href="#quiz"
                  className="hover:text-gold transition-colors"
                >
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
                <a href="#" className="hover:text-gold transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs tracking-widest uppercase text-gold/60 mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-foreground/30 font-light">
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gold/5 text-center text-xs text-foreground/20 font-bold tracking-widest uppercase">
          <p>
            &copy; {new Date().getFullYear()} Male Vitamine. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a08]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <BenefitsSection />
        <WhyChooseSection />
        <IngredientsSection />
        <QuizSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
