"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X,
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  Loader2,
  Info,
} from "lucide-react";
import {
  initiatePayment,
  isDemoMode,
  loadFlutterwaveScript,
  calculateSplitBreakdown,
  PRODUCT,
} from "@/lib/flutterwave";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentState = "form" | "processing" | "success" | "demo-success";

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [state, setState] = useState<PaymentState>("form");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setState("processing");

    try {
      if (isDemoMode()) {
        await loadFlutterwaveScript();
        setTimeout(() => {
          setState("demo-success");
        }, 2000);
        return;
      }

      // Real Flutterwave split payment
      await initiatePayment({
        email: form.email,
        name: form.name,
        phone: form.phone || undefined,
      });

      setState("success");
    } catch {
      setState("form");
      setErrors({ submit: "Payment failed. Please try again." });
    }
  };

  const handleClose = () => {
    setState("form");
    setErrors({});
    onClose();
  };

  // Calculate split breakdown for display
  const breakdown = calculateSplitBreakdown(PRODUCT.price);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md"
          >
            <div className="bg-[#111110] border border-gold/20 gold-glow-strong overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gold/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center border border-gold/20">
                    <CreditCard className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-black tracking-wider text-foreground text-sm uppercase">
                      Secure Checkout
                    </h3>
                    <p className="text-xs text-foreground/40 font-light">
                      Powered by Flutterwave
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-foreground/40 hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* FORM STATE */}
                  {state === "form" && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Order summary */}
                      <div className="bg-[#0a0a08] border border-gold/10 p-4 mb-6">
                        <div className="flex items-center gap-4">
                          <img
                            src="/product-image.webp"
                            alt="Male Vitamine"
                            className="w-16 h-16 object-contain"
                          />
                          <div className="flex-1">
                            <p className="font-black text-sm tracking-wider text-foreground uppercase">
                              Male Vitamine
                            </p>
                            <p className="text-xs text-foreground/40 font-light">
                              Premium Performance Supplement
                            </p>
                            <p className="text-lg font-black text-gold mt-1">
                              R {PRODUCT.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold tracking-widest uppercase text-foreground/60 mb-1.5">
                            Full Name
                          </label>
                          <Input
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                            placeholder="John Doe"
                            className="bg-[#0a0a08] border-gold/15 focus-visible:border-gold/40 focus-visible:ring-gold/20 rounded-none h-11"
                          />
                          {errors.name && (
                            <p className="text-xs text-red-400 mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold tracking-widest uppercase text-foreground/60 mb-1.5">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                            placeholder="john@example.com"
                            className="bg-[#0a0a08] border-gold/15 focus-visible:border-gold/40 focus-visible:ring-gold/20 rounded-none h-11"
                          />
                          {errors.email && (
                            <p className="text-xs text-red-400 mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold tracking-widest uppercase text-foreground/60 mb-1.5">
                            Phone Number{" "}
                            <span className="text-foreground/30">
                              (optional)
                            </span>
                          </label>
                          <Input
                            type="tel"
                            value={form.phone}
                            onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                            }
                            placeholder="+27 82 123 4567"
                            className="bg-[#0a0a08] border-gold/15 focus-visible:border-gold/40 focus-visible:ring-gold/20 rounded-none h-11"
                          />
                        </div>

                        {errors.submit && (
                          <p className="text-sm text-red-400 text-center">
                            {errors.submit}
                          </p>
                        )}

                        <Button
                          type="submit"
                          className="w-full rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-12 mt-2"
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          Pay R {PRODUCT.price.toFixed(2)}
                        </Button>
                      </form>

                      {/* Payment methods */}
                      <div className="mt-6 pt-4 border-t border-gold/10">
                        <p className="text-xs text-foreground/30 font-bold tracking-widest uppercase text-center mb-3">
                          Accepted Payment Methods
                        </p>
                        <div className="flex items-center justify-center gap-4 text-foreground/40">
                          <span className="text-xs font-bold tracking-wider">
                            VISA
                          </span>
                          <span className="text-xs font-bold tracking-wider">
                            MASTERCARD
                          </span>
                          <span className="text-xs font-bold tracking-wider">
                            EFT
                          </span>
                          <span className="text-xs font-bold tracking-wider">
                            MOBILE
                          </span>
                        </div>
                      </div>

                      {/* Security badges */}
                      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-foreground/25 font-bold tracking-widest uppercase">
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" /> SSL Secured
                        </span>
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Encrypted
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* PROCESSING STATE */}
                  {state === "processing" && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                    >
                      <Loader2 className="h-12 w-12 text-gold animate-spin mx-auto mb-4" />
                      <p className="font-black tracking-wider uppercase text-foreground">
                        Processing Payment
                      </p>
                      <p className="text-sm text-foreground/40 font-light mt-2">
                        Please wait while we confirm your order...
                      </p>
                    </motion.div>
                  )}

                  {/* SUCCESS STATE (Real Payment) */}
                  {state === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-8 text-center"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                      </div>
                      <h4 className="font-black tracking-wider uppercase text-foreground text-lg">
                        Payment Initiated!
                      </h4>
                      <p className="text-sm text-foreground/50 font-light mt-2 max-w-xs mx-auto">
                        Complete your payment in the Flutterwave window. Your
                        order will be confirmed once payment is verified.
                      </p>
                      <Button
                        onClick={handleClose}
                        className="mt-6 rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-11 px-8"
                      >
                        Done
                      </Button>
                    </motion.div>
                  )}

                  {/* DEMO SUCCESS STATE */}
                  {state === "demo-success" && (
                    <motion.div
                      key="demo-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-8 text-center"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                      </div>
                      <Badge className="bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs mb-3">
                        Demo Mode
                      </Badge>
                      <h4 className="font-black tracking-wider uppercase text-foreground text-lg">
                        Payment Simulated!
                      </h4>
                      <p className="text-sm text-foreground/50 font-light mt-2 max-w-xs mx-auto">
                        This was a demo payment. To accept real payments with
                        automatic splitting, add your Flutterwave API keys and
                        subaccount IDs to the{" "}
                        <code className="text-gold/60">.env</code> file.
                      </p>

                      {/* Show what the split would look like */}
                      {breakdown.splits.length > 0 && (
                        <div className="mt-4 bg-[#0a0a08] border border-gold/10 p-3 text-left">
                          <p className="text-xs text-foreground/40 font-bold tracking-widest uppercase mb-2">
                            Split Preview
                          </p>
                          {breakdown.splits.map((s) => (
                            <div
                              key={s.label}
                              className="flex justify-between text-xs text-foreground/50 py-1"
                            >
                              <span>
                                {s.label} ({s.percentage}%)
                              </span>
                              <span className="text-gold font-bold">
                                R {s.amount.toFixed(2)}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between text-xs text-foreground/25 pt-1 border-t border-gold/5 mt-1">
                            <span>Flutterwave Fee (est.)</span>
                            <span>-R {breakdown.flutterwaveFee.toFixed(2)}</span>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleClose}
                        className="mt-6 rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-11 px-8"
                      >
                        Got It
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
