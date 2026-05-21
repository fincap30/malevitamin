"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Shield,
  Heart,
  Leaf,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
  Flame,
  Trophy,
  Target,
  TrendingUp,
  Sparkles,
  CircleCheck,
  Package,
  Clock,
  Award,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const benefits = [
  {
    icon: Zap,
    title: "Enhanced Energy Levels",
    description:
      "Power through your day with sustained, natural energy. Our formula combats fatigue at its source, so you stay sharp and active from morning to night without the crash of stimulants.",
  },
  {
    icon: Shield,
    title: "Improved Confidence",
    description:
      "Feel assured in your performance and presence. When your body gets the nutrients it craves, confidence follows naturally — in the boardroom, the gym, and your personal life.",
  },
  {
    icon: Heart,
    title: "Greater Overall Satisfaction",
    description:
      "Experience a renewed sense of fulfillment across every area of life. Balanced hormones and improved circulation translate to deeper satisfaction in your intimate moments and daily activities.",
  },
];

const whyChoose = [
  {
    icon: Star,
    title: "High-Quality Ingredients",
    description:
      "Each ingredient is carefully selected for its purity and effectiveness, ensuring you get the best possible results. We source only premium-grade raw materials that meet rigorous quality standards.",
  },
  {
    icon: Shield,
    title: "Safe and Effective",
    description:
      "Our formula is designed with your health in mind, providing a safe way to enhance your vitality. Every batch is third-party tested to guarantee safety and consistency.",
  },
  {
    icon: Leaf,
    title: "Holistic Wellness",
    description:
      "Supports overall health and well-being, helping you feel more confident and satisfied in all areas of life. Our approach goes beyond a single benefit to nurture your whole system.",
  },
];

const ingredients = [
  {
    name: "L-Arginine",
    description:
      "An amino acid that supports blood flow and overall circulation, promoting improved performance and stamina.",
    icon: TrendingUp,
  },
  {
    name: "Tribulus Terrestris",
    description:
      "A plant extract traditionally used to enhance vitality and overall well-being.",
    icon: Flame,
  },
  {
    name: "Maca Root",
    description:
      "Known for its energy-boosting properties, this root helps increase endurance and support hormonal balance.",
    icon: Zap,
  },
  {
    name: "Ginseng Extract",
    description:
      "A natural adaptogen that helps reduce fatigue and enhance physical performance.",
    icon: Target,
  },
  {
    name: "Zinc",
    description:
      "An essential mineral that plays a crucial role in supporting immune function and maintaining healthy testosterone levels.",
    icon: Shield,
  },
  {
    name: "Fenugreek Extract",
    description:
      "Known to support hormonal health and overall vitality.",
    icon: Sparkles,
  },
];

const quizQuestions = [
  {
    id: 1,
    question: "How would you rate your current energy levels throughout the day?",
    options: [
      { label: "Low — I often feel sluggish and tired", value: "low" },
      { label: "Moderate — I have good and bad days", value: "medium" },
      { label: "High — I feel energized most of the time", value: "high" },
    ],
  },
  {
    id: 2,
    question:
      "How confident do you feel in your daily performance and vitality?",
    options: [
      { label: "Not very confident — I know I can do better", value: "low" },
      {
        label: "Somewhat confident — Room for improvement",
        value: "medium",
      },
      { label: "Very confident — I feel at my peak", value: "high" },
    ],
  },
  {
    id: 3,
    question: "How would you describe your overall satisfaction with your wellness?",
    options: [
      { label: "Unsatisfied — I'm looking for real change", value: "low" },
      { label: "It's okay — But I want more", value: "medium" },
      { label: "Very satisfied — I feel great", value: "high" },
    ],
  },
  {
    id: 4,
    question: "Does stress affect your daily performance?",
    options: [
      { label: "Often — Stress takes a heavy toll on me", value: "low" },
      { label: "Sometimes — I manage but could use support", value: "medium" },
      { label: "Rarely — I handle stress well", value: "high" },
    ],
  },
  {
    id: 5,
    question: "Are you open to a natural supplement to support your vitality?",
    options: [
      { label: "Absolutely — I'm ready for a solution", value: "low" },
      { label: "Maybe — I'd like to learn more first", value: "medium" },
      { label: "Not really — I prefer other approaches", value: "high" },
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
          ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Flame className="h-7 w-7 text-amber-600" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Male Vitamine
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#benefits" className="hover:text-foreground transition-colors">
            Benefits
          </a>
          <a href="#ingredients" className="hover:text-foreground transition-colors">
            Ingredients
          </a>
          <a href="#quiz" className="hover:text-foreground transition-colors">
            Take Quiz
          </a>
          <Button size="sm" className="rounded-full">
            Shop Now
          </Button>
        </div>
        <Button size="sm" className="md:hidden rounded-full">
          Shop Now
        </Button>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-white" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Badge className="mb-6 bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Premium Men&apos;s Supplement
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Elevate Your{" "}
            <span className="text-amber-600">Vitality</span> with Our Premium
            Supplement
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
            Discover our unique formula for men&apos;s vitality, libido and
            wellness. Crafted with high-quality, safe ingredients, our supplement
            ensures you feel your best and achieve peak performance even under
            stress.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="rounded-full bg-amber-600 hover:bg-amber-700 text-white text-base px-8"
              asChild
            >
              <a href="#quiz">
                Take the Quiz <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full text-base px-8"
              asChild
            >
              <a href="#benefits">Learn More</a>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-amber-700 text-xs font-bold"
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
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by 2,000+ men
              </p>
            </div>
          </div>
        </motion.div>

        {/* Product image */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-3xl blur-2xl scale-95" />
          <div className="relative bg-gradient-to-br from-amber-50 to-white rounded-3xl p-8 shadow-2xl border border-amber-100">
            <img
              src="/product-image.webp"
              alt="Male Vitamine Premium Supplement"
              className="w-72 h-72 sm:w-80 sm:h-80 object-contain drop-shadow-2xl"
            />
            <div className="mt-6 text-center">
              <p className="text-3xl font-bold text-foreground">
                R 850.00
              </p>
              <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                <CircleCheck className="h-3.5 w-3.5 mr-1" />
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
    <section id="benefits" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 border-amber-300 text-amber-700"
          >
            Key Benefits
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            What You&apos;ll Experience
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Our premium supplement is formulated to deliver real, noticeable
            results that transform your daily life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-amber-50/50 group">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                    <benefit.icon className="h-7 w-7 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
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
    <section className="py-20 lg:py-28 bg-gradient-to-br from-amber-50 via-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 border-amber-300 text-amber-700"
          >
            Why Us
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Why Choose Our Supplement?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            We don&apos;t compromise on quality. Every aspect of our supplement
            is designed with your well-being in mind.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                    <item.icon className="h-7 w-7 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
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
    <section id="ingredients" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 border-amber-300 text-amber-700"
          >
            Ingredients
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Powered by Nature&apos;s Best
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Every ingredient is hand-picked for its proven benefits and
            synergistic effects within our formula.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredients.map((ingredient, i) => (
            <motion.div
              key={ingredient.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full border border-border/50 hover:border-amber-300 transition-colors duration-300 group hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
                      <ingredient.icon className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {ingredient.name}
                      </h3>
                      <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
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
        title: "Your Vitality Needs a Boost!",
        description:
          "Based on your answers, you could greatly benefit from our premium supplement. The combination of L-Arginine, Tribulus Terrestris, and Maca Root is specifically designed to address the areas where you need the most support — energy, confidence, and overall satisfaction.",
        match: "Very High Match",
        matchPercent: 97,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    }
    if (lowCount >= 1 || medCount >= 2) {
      return {
        title: "You're on the Right Track — Let's Optimize!",
        description:
          "You have a solid foundation, but there's room to elevate your vitality. Our supplement's blend of Ginseng Extract, Zinc, and Fenugreek can help you break through plateaus and achieve the peak performance you're striving for.",
        match: "High Match",
        matchPercent: 85,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      };
    }
    return {
      title: "Great Foundation — Maintain Your Edge!",
      description:
        "You're already performing well! Our supplement can help you maintain and protect your vitality long-term. Think of it as an insurance policy for your energy, confidence, and wellness — keeping you at your peak for years to come.",
      match: "Good Match",
      matchPercent: 72,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
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
      className="py-20 lg:py-28 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/30"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-amber-200 text-amber-900 hover:bg-amber-200 border-amber-300">
            <Trophy className="h-3.5 w-3.5 mr-1" />
            Free Assessment
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Find Out If Our Supplement Is Right for You
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            Take this quick 5-question quiz and get a personalized
            recommendation based on your unique needs.
          </p>
        </motion.div>

        {!started ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Ready to Discover Your Vitality Score?
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Answer 5 quick questions about your energy, confidence, and
                  wellness goals. It takes less than 2 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="rounded-full bg-amber-600 hover:bg-amber-700 text-white text-base px-8"
                    onClick={() => setStarted(true)}
                  >
                    Start the Quiz <ChevronRight className="ml-1 h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> 2 min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4" /> 100% Private
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4 w-4" /> Free
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="border-0 shadow-xl bg-white overflow-hidden">
            {/* Progress bar */}
            <div className="h-1.5 bg-muted">
              <motion.div
                className="h-full bg-amber-500"
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
                    <div className="mb-2 text-sm font-medium text-amber-600">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-8">
                      {quizQuestions[currentQuestion].question}
                    </h3>

                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleAnswer(option.value)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                            ${
                              answers[currentQuestion] === option.value
                                ? "border-amber-500 bg-amber-50"
                                : "border-border hover:border-amber-300 hover:bg-amber-50/50"
                            }`}
                        >
                          <span className="text-foreground font-medium">
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
                            className={`w-20 h-20 rounded-full ${rec.bgColor} flex items-center justify-center mx-auto mb-6`}
                          >
                            <Trophy className="h-10 w-10 text-amber-600" />
                          </div>

                          <Badge
                            className={`${rec.bgColor} ${rec.color} border ${rec.borderColor} mb-4`}
                          >
                            {rec.match}
                          </Badge>

                          <h3 className="text-2xl font-bold text-foreground mb-3">
                            {rec.title}
                          </h3>

                          <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto mb-8">
                            {rec.description}
                          </p>

                          {/* Match meter */}
                          <div className="max-w-sm mx-auto mb-8">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">Your Match</span>
                              <span className={`font-bold ${rec.color}`}>
                                {rec.matchPercent}%
                              </span>
                            </div>
                            <Progress value={rec.matchPercent} className="h-3" />
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                              size="lg"
                              className="rounded-full bg-amber-600 hover:bg-amber-700 text-white text-base px-8"
                            >
                              <Package className="mr-2 h-5 w-5" />
                              Order Now — R 850.00
                            </Button>
                            <Button
                              size="lg"
                              variant="outline"
                              className="rounded-full text-base px-8"
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
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-600 to-orange-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <CardContent className="relative p-8 sm:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Elevate Your Vitality Today
              </h2>
              <p className="text-amber-100 max-w-2xl mx-auto text-lg mb-8">
                Join thousands of men who have already transformed their energy,
                confidence, and satisfaction. Your best self is just one
                supplement away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-amber-700 hover:bg-amber-50 text-base px-8 font-semibold"
                >
                  Order Now — R 850.00 <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-amber-100 text-sm">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> Free Shipping
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> 30-Day Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> Discreet Packaging
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
    <footer className="bg-foreground text-background/70 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-amber-400" />
              <span className="text-lg font-bold text-background">
                Male Vitamine
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Premium men&apos;s vitality supplement crafted with high-quality,
              safe ingredients for peak performance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#benefits" className="hover:text-background transition-colors">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#ingredients" className="hover:text-background transition-colors">
                  Ingredients
                </a>
              </li>
              <li>
                <a href="#quiz" className="hover:text-background transition-colors">
                  Vitality Quiz
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-background/10 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Male Vitamine. All rights reserved.</p>
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
    <div className="min-h-screen flex flex-col">
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
