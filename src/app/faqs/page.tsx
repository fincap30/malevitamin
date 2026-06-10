import type { Metadata } from "next";
import {
  LegalPage,
  Section,
  Callout,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
  SUPPORT_WHATSAPP_LINK,
} from "@/components/legal-page";

export const metadata: Metadata = {
  title: "FAQs | Male Vitamin",
  description:
    "Frequently asked questions about Male Vitamin — how it works, ingredients, dosage, safety, discreet delivery, payment and returns.",
  alternates: { canonical: "https://malevitamin.co.za/faqs" },
  robots: { index: true, follow: true },
};

type Faq = { q: string; a: string };

const faqGroups: { heading: string; faqs: Faq[] }[] = [
  {
    heading: "About the Product",
    faqs: [
      {
        q: "What is Male Vitamin?",
        a: "Male Vitamin is a premium natural supplement for men, formulated to support stronger erections, increased libido, lasting stamina and overall vitality. It blends researched botanicals and nutrients including L-Arginine, Tribulus Terrestris, Maca Root, Ginseng Extract, Zinc and Fenugreek.",
      },
      {
        q: "How does it work?",
        a: "The ingredients are chosen to support healthy blood flow, natural testosterone levels and energy. Better circulation and hormonal support are linked to firmer erections, stronger drive and improved stamina. Male Vitamin works with your body's natural systems rather than acting as a pharmaceutical drug.",
      },
      {
        q: "Is it natural?",
        a: "Yes. Male Vitamin uses natural, plant-based and nutrient ingredients. It is a dietary supplement, not a synthetic medicine.",
      },
    ],
  },
  {
    heading: "Usage & Results",
    faqs: [
      {
        q: "How do I take it?",
        a: "Follow the dosage instructions on the product label. Do not exceed the recommended daily amount. For best results, use consistently alongside a balanced diet and healthy lifestyle.",
      },
      {
        q: "How soon will I see results?",
        a: "Many men notice improvements in energy and drive within the first couple of weeks, while benefits to stamina and performance typically build with consistent daily use. Individual results vary depending on age, diet, lifestyle and overall health.",
      },
      {
        q: "Are the results guaranteed?",
        a: "Individual results may vary. Testimonials reflect real individual experiences but are not a guarantee that everyone will achieve the same outcome.",
      },
    ],
  },
  {
    heading: "Safety",
    faqs: [
      {
        q: "Is Male Vitamin safe?",
        a: "Male Vitamin is made from natural ingredients and is intended for healthy adult men aged 18+. However, if you have a heart condition, abnormal blood pressure, diabetes or any chronic condition, or if you take prescription medication (especially nitrates or alpha-blockers), consult your doctor before use. Please read our Disclaimer for full safety information.",
      },
      {
        q: "Can I take it with other medication?",
        a: "Do not combine it with nitrates or alpha-blockers without medical advice. If you take any prescription medication, speak to your doctor or pharmacist before use to check for interactions.",
      },
      {
        q: "Are there side effects?",
        a: "Most men tolerate the natural ingredients well. If you experience any adverse reaction, discontinue use and seek medical attention. Check the ingredient list if you have known allergies.",
      },
    ],
  },
  {
    heading: "Privacy & Delivery",
    faqs: [
      {
        q: "Is the packaging discreet?",
        a: "Absolutely. Every order ships in plain, unmarked packaging with no indication of the contents. Your privacy matters to us.",
      },
      {
        q: "Will it show on my bank statement?",
        a: "Your payment is processed with a discreet billing descriptor, so the product is not described on your statement.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders are processed within 1–2 business days. Standard delivery within South Africa typically takes 2–5 business days, and express delivery 1–2 business days. See our Shipping Policy for full details.",
      },
      {
        q: "Where do you deliver?",
        a: "We deliver across South Africa. You'll receive tracking details once your order ships.",
      },
    ],
  },
  {
    heading: "Payment & Returns",
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "Payments are handled securely through Flutterwave, which supports major debit and credit cards and other local payment options. Your card details are encrypted and never stored on our servers.",
      },
      {
        q: "What is your returns policy?",
        a: "Unopened, sealed products may be returned within the eligibility window described in our Returns & Refund Policy, in line with your rights under the Consumer Protection Act. For health and safety reasons, opened supplements cannot be returned unless they are defective.",
      },
      {
        q: "How do I contact support?",
        a: "Email us or message us on WhatsApp — details are at the bottom of this page. We're happy to help discreetly.",
      },
    ],
  },
];

// FAQ structured data for SEO.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((g) =>
    g.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    }))
  ),
};

export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LegalPage
        title="Frequently Asked Questions"
        intro="Everything you need to know about Male Vitamin — how it works, safety, discreet delivery, payment and returns. Can't find your answer? Reach out to us directly."
        lastUpdated="10 June 2026"
      >
        {faqGroups.map((group) => (
          <Section key={group.heading} heading={group.heading}>
            <div className="space-y-6">
              {group.faqs.map((faq) => (
                <div key={faq.q}>
                  <p className="text-base sm:text-lg font-bold text-foreground/90 mb-1.5">
                    {faq.q}
                  </p>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        ))}

        <Callout title="Still have questions?">
          <p>
            Our team is here to help — discreetly and without judgement. Email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:text-gold-light">
              {SUPPORT_EMAIL}
            </a>{" "}
            or message us on WhatsApp at{" "}
            <a
              href={SUPPORT_WHATSAPP_LINK}
              className="text-gold hover:text-gold-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              {SUPPORT_WHATSAPP_DISPLAY}
            </a>
            .
          </p>
        </Callout>
      </LegalPage>
    </>
  );
}
