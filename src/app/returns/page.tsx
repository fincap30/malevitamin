import type { Metadata } from "next";
import {
  LegalPage,
  Section,
  SubHeading,
  Callout,
  List,
  RETURNS_EMAIL,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Returns & Refund Policy | Male Vitamin",
  description:
    "Male Vitamin's returns and refund policy — your Consumer Protection Act cooling-off rights, eligibility for sealed supplements, and how to request a return.",
  alternates: { canonical: "https://malevitamin.co.za/returns" },
  robots: { index: true, follow: true },
};

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Returns & Refund Policy"
      intro="We want you to shop with confidence. This policy explains when and how you can return a Male Vitamin order, and your rights under South Africa's Consumer Protection Act (CPA)."
      lastUpdated="10 June 2026"
    >
      <Callout title="Your cooling-off right (CPA)">
        <p>
          Under the Consumer Protection Act, you may cancel an online order within{" "}
          <strong>7 days</strong> of receiving it and return the product for a
          refund, provided it is unopened and in its original, sealed condition.
          This is in addition to your rights regarding defective goods.
        </p>
      </Callout>

      <Section heading="1. Returns Eligibility">
        <p>For health, safety and hygiene reasons, returned products must be:</p>
        <List
          items={[
            "Unopened, sealed and in their original packaging.",
            "Unused, with the tamper-evident seal intact.",
            "Not exposed to heat, sunlight or moisture.",
            "Within their expiry date.",
            "Accompanied by proof of purchase (order number or receipt).",
          ]}
        />
        <Callout variant="warning" title="Opened supplements cannot be returned">
          <p>
            For safety reasons, we cannot accept the return of opened or
            unsealed supplements unless the product is defective or was sent in
            error. This protects all our customers and is standard practice in the
            supplement industry.
          </p>
        </Callout>
      </Section>

      <Section heading="2. Cooling-Off Period (Online Orders)">
        <p>
          You may cancel and return an unopened, sealed order within{" "}
          <strong>7 days</strong> of delivery under the CPA cooling-off provision.
          Once we receive and inspect the returned product, we will refund the
          purchase price. The cost of returning the product is for your account
          unless the item was defective or incorrect.
        </p>
      </Section>

      <Section heading="3. Defective or Incorrect Products">
        <p>
          If your product arrives damaged, defective, or you received the wrong
          item, please contact us within <strong>7 days</strong> of delivery. We
          will arrange a replacement or full refund — including any return shipping
          costs — at no charge to you. Please keep the product and packaging and, if
          possible, send us a photo of the issue to help us resolve it quickly.
        </p>
      </Section>

      <Section heading="4. How to Request a Return">
        <SubHeading>Step by step</SubHeading>
        <List
          items={[
            <>
              Email{" "}
              <a href={`mailto:${RETURNS_EMAIL}`} className="text-gold hover:text-gold-light">
                {RETURNS_EMAIL}
              </a>{" "}
              with your order number, the reason for the return, and a photo if the
              item is damaged or incorrect.
            </>,
            "We will review your request and confirm whether it qualifies, usually within 3 business days.",
            "If approved, we will provide return instructions and the return address.",
            "Once we receive and inspect the returned product, we process your refund or replacement.",
          ]}
        />
      </Section>

      <Section heading="5. Refunds">
        <p>
          Approved refunds are paid to your original payment method or by EFT to a
          bank account you provide. Please allow up to{" "}
          <strong>10 business days</strong> for the refund to reflect, depending on
          your bank or card provider. Original delivery fees are non-refundable
          except where the product was defective or incorrect.
        </p>
        <p className="text-foreground/50 text-sm">
          After approval, please provide your bank details or arrange your return
          within 3 business days so we can process it promptly.
        </p>
      </Section>

      <Section heading="6. Return Shipping Costs">
        <p>
          Unless the product was defective or incorrect, you are responsible for the
          cost of returning the product to us, and the original shipping cost is
          non-refundable. We recommend using a trackable courier service, as we
          cannot be responsible for returns lost in transit.
        </p>
      </Section>

      <Section heading="7. Non-Returnable Items">
        <List
          items={[
            "Opened or unsealed supplements (unless defective).",
            "Gift cards or promotional items.",
            "Products returned outside the eligibility window or without proof of purchase.",
          ]}
        />
      </Section>

      <Section heading="8. Contact Us">
        <List
          items={[
            <>
              Returns:{" "}
              <a href={`mailto:${RETURNS_EMAIL}`} className="text-gold hover:text-gold-light">
                {RETURNS_EMAIL}
              </a>
            </>,
            <>
              General support:{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:text-gold-light">
                {SUPPORT_EMAIL}
              </a>
            </>,
            <>WhatsApp: {SUPPORT_WHATSAPP_DISPLAY}</>,
          ]}
        />
      </Section>
    </LegalPage>
  );
}
