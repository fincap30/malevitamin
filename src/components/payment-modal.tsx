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
  MessageCircle,
  Package,
  Truck,
  Zap,
} from "lucide-react";
import {
  initiatePayment,
  isDemoMode,
  loadFlutterwaveScript,
  calculateSplitBreakdown,
  PRODUCT,
  DELIVERY,
  type PaymentVerificationResult,
  type DeliveryOption,
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
    address: "",
    deliveryOption: "normal" as DeliveryOption,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationResult, setVerificationResult] =
    useState<PaymentVerificationResult | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.phone.trim())
      newErrors.phone = "Phone number is required for order updates";
    else if (form.phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Enter a valid phone number";
    if (!form.address.trim())
      newErrors.address = "Delivery address is required";
    else if (form.address.trim().length < 10)
      newErrors.address = "Please enter a full delivery address";
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
          const breakdown = calculateSplitBreakdown(
            PRODUCT.price,
            form.deliveryOption
          );
          const demoResult: PaymentVerificationResult = {
            verified: true,
            amount: PRODUCT.price,
            currency: PRODUCT.currency,
            customerName: form.name,
            customerEmail: form.email,
            customerPhone: form.phone,
            customerAddress: form.address,
            deliveryOption: form.deliveryOption,
            deliveryFee: breakdown.deliveryFee,
            txRef: `DEMO-${Date.now().toString(36).toUpperCase()}`,
            transactionId: Math.floor(Math.random() * 1000000),
            paymentType: "demo",
            splitBreakdown: breakdown,
            demo: true,
          };
          setVerificationResult(demoResult);
          setState("demo-success");
        }, 2000);
        return;
      }

      await initiatePayment({
        email: form.email,
        name: form.name,
        phone: form.phone,
        address: form.address,
        deliveryOption: form.deliveryOption,
        onSuccess: (result) => {
          setVerificationResult(result);
          setState("success");
        },
        onError: (error) => {
          setState("form");
          setErrors({ submit: error || "Payment failed. Please try again." });
        },
      });
    } catch {
      setState("form");
      setErrors({ submit: "Payment failed. Please try again." });
    }
  };

  const handleClose = () => {
    setState("form");
    setErrors({});
    setVerificationResult(null);
    onClose();
  };

  const breakdown = calculateSplitBreakdown(PRODUCT.price, form.deliveryOption);
  const currencySymbol = PRODUCT.currency === "ZAR" ? "R" : PRODUCT.currency;
  const selectedDeliveryFee =
    form.deliveryOption === "speed" ? DELIVERY.speedFee : DELIVERY.normalFee;

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
            <div className="bg-[#111110] border border-gold/20 gold-glow-strong overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gold/10 sticky top-0 bg-[#111110] z-10">
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
                  {/* ========== FORM STATE ========== */}
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
                            alt="Male Vitamin"
                            className="w-16 h-16 object-contain"
                          />
                          <div className="flex-1">
                            <p className="font-black text-sm tracking-wider text-foreground uppercase">
                              Male Vitamin
                            </p>
                            <p className="text-xs text-foreground/40 font-light">
                              Premium Performance Supplement
                            </p>
                            <p className="text-lg font-black text-gold mt-1">
                              {currencySymbol} {PRODUCT.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
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

                        {/* Email */}
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

                        {/* Phone */}
                        <div>
                          <label className="block text-xs font-bold tracking-widest uppercase text-foreground/60 mb-1.5">
                            WhatsApp / Phone Number{" "}
                            <span className="text-gold/60">(required)</span>
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
                          {errors.phone && (
                            <p className="text-xs text-red-400 mt-1">
                              {errors.phone}
                            </p>
                          )}
                          <p className="text-xs text-foreground/25 mt-1 flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            Order confirmation &amp; shipping updates sent via
                            WhatsApp
                          </p>
                        </div>

                        {/* Delivery Address */}
                        <div>
                          <label className="block text-xs font-bold tracking-widest uppercase text-foreground/60 mb-1.5">
                            Delivery Address{" "}
                            <span className="text-gold/60">(required)</span>
                          </label>
                          <Input
                            value={form.address}
                            onChange={(e) =>
                              setForm({ ...form, address: e.target.value })
                            }
                            placeholder="123 Main Street, Pretoria, Gauteng, 0001"
                            className="bg-[#0a0a08] border-gold/15 focus-visible:border-gold/40 focus-visible:ring-gold/20 rounded-none h-11"
                          />
                          {errors.address && (
                            <p className="text-xs text-red-400 mt-1">
                              {errors.address}
                            </p>
                          )}
                        </div>

                        {/* Delivery Option */}
                        <div>
                          <label className="block text-xs font-bold tracking-widest uppercase text-foreground/60 mb-2">
                            Delivery Speed
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setForm({ ...form, deliveryOption: "normal" })
                              }
                              className={`p-3 border text-left transition-all ${
                                form.deliveryOption === "normal"
                                  ? "border-gold/50 bg-gold/10"
                                  : "border-gold/10 bg-[#0a0a08] hover:border-gold/20"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Truck className="h-4 w-4 text-gold" />
                                <span className="text-xs font-black tracking-wider uppercase text-foreground">
                                  Normal
                                </span>
                              </div>
                              <p className="text-sm font-black text-gold">
                                {currencySymbol} {DELIVERY.normalFee.toFixed(2)}
                              </p>
                              <p className="text-xs text-foreground/30 mt-0.5">
                                5-7 business days
                              </p>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setForm({ ...form, deliveryOption: "speed" })
                              }
                              className={`p-3 border text-left transition-all ${
                                form.deliveryOption === "speed"
                                  ? "border-gold/50 bg-gold/10"
                                  : "border-gold/10 bg-[#0a0a08] hover:border-gold/20"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Zap className="h-4 w-4 text-gold" />
                                <span className="text-xs font-black tracking-wider uppercase text-foreground">
                                  Speed
                                </span>
                              </div>
                              <p className="text-sm font-black text-gold">
                                {currencySymbol} {DELIVERY.speedFee.toFixed(2)}
                              </p>
                              <p className="text-xs text-foreground/30 mt-0.5">
                                2-3 business days
                              </p>
                            </button>
                          </div>
                        </div>

                        {errors.submit && (
                          <p className="text-sm text-red-400 text-center">
                            {errors.submit}
                          </p>
                        )}

                        {/* Pay Button */}
                        <Button
                          type="submit"
                          className="w-full rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-12 mt-2"
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          Pay {currencySymbol} {PRODUCT.price.toFixed(2)}
                        </Button>

                        <p className="text-xs text-foreground/25 text-center">
                          Delivery fee ({currencySymbol}{" "}
                          {selectedDeliveryFee.toFixed(2)}) is included and
                          handled separately
                        </p>
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

                  {/* ========== PROCESSING STATE ========== */}
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
                        Verifying your payment and preparing your order...
                      </p>
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center justify-center gap-2 text-xs text-foreground/30">
                          <CheckCircle className="h-3 w-3 text-emerald-500/50" />
                          Confirming payment with Flutterwave
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-foreground/30">
                          <CheckCircle className="h-3 w-3 text-emerald-500/50" />
                          Calculating split distribution
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-foreground/30">
                          <MessageCircle className="h-3 w-3 text-gold/30" />
                          Sending WhatsApp confirmation
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ========== SUCCESS STATE (Real Payment) ========== */}
                  {state === "success" && verificationResult && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-6"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                      </div>

                      <h4 className="font-black tracking-wider uppercase text-foreground text-lg text-center">
                        Payment Confirmed!
                      </h4>

                      {/* Payment details */}
                      <div className="mt-4 bg-[#0a0a08] border border-emerald-500/20 p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                              Amount Paid
                            </span>
                            <span className="text-lg font-black text-gold">
                              {currencySymbol}{" "}
                              {(verificationResult.amount || PRODUCT.price).toFixed(
                                2
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                              Customer
                            </span>
                            <span className="text-sm text-foreground font-medium">
                              {verificationResult.customerName || form.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                              Delivery
                            </span>
                            <span className="text-sm text-foreground font-medium">
                              {form.deliveryOption === "speed"
                                ? "Speed (2-3 days)"
                                : "Normal (5-7 days)"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                              Reference
                            </span>
                            <span className="text-xs text-foreground/60 font-mono">
                              {verificationResult.txRef}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Product will be sent */}
                      <div className="mt-4 bg-gold/5 border border-gold/20 p-4">
                        <div className="flex items-start gap-3">
                          <Package className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm text-foreground font-bold">
                              Your product will be sent shortly
                            </p>
                            <p className="text-xs text-foreground/50 mt-1">
                              You will receive a WhatsApp message with tracking
                              details once your order ships to{" "}
                              <span className="text-foreground/70">
                                {form.address}
                              </span>
                              .
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp indicator */}
                      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-foreground/30">
                        <MessageCircle className="h-3 w-3 text-green-400" />
                        <span>
                          WhatsApp confirmation sent to {form.phone}
                        </span>
                      </div>

                      <Button
                        onClick={handleClose}
                        className="mt-6 w-full rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-11"
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        Done — Track My Order
                      </Button>
                    </motion.div>
                  )}

                  {/* ========== DEMO SUCCESS STATE ========== */}
                  {state === "demo-success" && verificationResult && (
                    <motion.div
                      key="demo-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-6"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                      </div>

                      <Badge className="bg-gold/10 text-gold border border-gold/30 rounded-none font-bold tracking-widest uppercase text-xs mb-3">
                        Demo Mode
                      </Badge>

                      <h4 className="font-black tracking-wider uppercase text-foreground text-lg text-center">
                        Payment Simulated!
                      </h4>

                      {/* Payment confirmation */}
                      <div className="mt-4 bg-[#0a0a08] border border-emerald-500/20 p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                              Amount Paid
                            </span>
                            <span className="text-lg font-black text-gold">
                              {currencySymbol} {PRODUCT.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                              Customer
                            </span>
                            <span className="text-sm text-foreground font-medium">
                              {form.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                              WhatsApp
                            </span>
                            <span className="text-xs text-foreground/60">
                              {form.phone}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                              Delivery
                            </span>
                            <span className="text-xs text-foreground/60">
                              {form.deliveryOption === "speed"
                                ? `Speed — ${currencySymbol} ${DELIVERY.speedFee.toFixed(2)} (2-3 days)`
                                : `Normal — ${currencySymbol} ${DELIVERY.normalFee.toFixed(2)} (5-7 days)`}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                              Address
                            </span>
                            <span className="text-xs text-foreground/60 text-right max-w-[200px]">
                              {form.address}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                              Reference
                            </span>
                            <span className="text-xs text-foreground/60 font-mono">
                              {verificationResult.txRef}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Product will be sent */}
                      <div className="mt-4 bg-gold/5 border border-gold/20 p-4">
                        <div className="flex items-start gap-3">
                          <Package className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm text-foreground font-bold">
                              Your product will be sent shortly
                            </p>
                            <p className="text-xs text-foreground/50 mt-1">
                              You will receive a WhatsApp message with tracking
                              details once your order ships.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp indicator */}
                      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-foreground/30">
                        <MessageCircle className="h-3 w-3 text-green-400" />
                        <span>
                          WhatsApp confirmation would be sent to {form.phone}
                        </span>
                      </div>

                      {/* Split breakdown preview */}
                      {verificationResult.splitBreakdown &&
                        verificationResult.splitBreakdown.splits.length > 0 && (
                          <div className="mt-4 bg-[#0a0a08] border border-gold/10 p-3 text-left">
                            <p className="text-xs text-foreground/40 font-bold tracking-widest uppercase mb-2">
                              Payment Distribution
                            </p>
                            {verificationResult.splitBreakdown.splits.map(
                              (s) => (
                                <div key={s.label}>
                                  <div className="flex justify-between text-xs text-foreground/50 py-1">
                                    <span>
                                      {s.label} ({s.percentage}%)
                                    </span>
                                    <span className="text-gold font-bold">
                                      {currencySymbol} {s.amount.toFixed(2)}
                                    </span>
                                  </div>
                                  {s.note && (
                                    <p className="text-[10px] text-foreground/25 pb-1">
                                      {s.note}
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                            <div className="flex justify-between text-xs text-foreground/25 pt-1 border-t border-gold/5 mt-1">
                              <span>Flutterwave Fee</span>
                              <span>
                                -{currencySymbol}{" "}
                                {verificationResult.splitBreakdown.flutterwaveFee.toFixed(
                                  2
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-foreground/25 pt-1">
                              <span>
                                Delivery Fee (
                                {form.deliveryOption === "speed"
                                  ? "Speed"
                                  : "Normal"}
                                )
                              </span>
                              <span>
                                -{currencySymbol}{" "}
                                {verificationResult.splitBreakdown.deliveryFee.toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                      <p className="text-xs text-foreground/30 text-center mt-4">
                        To accept real payments with automatic splitting and
                        WhatsApp notifications, add your Flutterwave API keys
                        and subaccount IDs to the{" "}
                        <code className="text-gold/60">.env</code> file.
                      </p>

                      <Button
                        onClick={handleClose}
                        className="mt-4 w-full rounded-none bg-gold text-black font-black tracking-wider uppercase text-sm hover:bg-gold-light h-11"
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
