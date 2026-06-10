import type { Metadata } from "next";
import {
  LegalPage,
  Section,
  SubHeading,
  Callout,
  List,
  PRIVACY_EMAIL,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Male Vitamin",
  description:
    "How Male Vitamin collects, uses, protects and shares your personal information — including discreet billing and packaging. POPIA compliant.",
  alternates: { canonical: "https://malevitamin.co.za/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Male Vitamin values your privacy. This policy explains what personal information we collect, how we use and protect it, and the rights you have under South Africa's Protection of Personal Information Act (POPIA)."
      lastUpdated="10 June 2026"
    >
      <Callout title="Your privacy is discreet by design">
        <p>
          We understand that men&apos;s health is personal. Male Vitamin ships in
          plain, unmarked packaging and our billing descriptor is discreet — no
          one needs to know what you ordered. We never sell your personal
          information.
        </p>
      </Callout>

      <Section heading="1. Who We Are">
        <p>
          Male Vitamin (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates
          the website{" "}
          <span className="text-gold">malevitamin.co.za</span> and sells a premium
          men&apos;s performance supplement to customers in South Africa. We are
          the responsible party (data controller) for the personal information
          processed through this website, as defined by POPIA.
        </p>
      </Section>

      <Section heading="2. What Information We Collect">
        <p>When you purchase from or interact with our store, we may collect:</p>
        <List
          items={[
            "Identity & contact details — your name, delivery address, email address and phone/WhatsApp number.",
            "Order information — the products you buy, order value, delivery option and transaction reference.",
            "Payment information — processed securely by our payment gateway (Flutterwave). We do not store your full card details on our servers.",
            "Technical data — your IP address, browser type and device information, collected automatically to keep the site secure and working.",
            "Communications — messages you send us by email or WhatsApp, and your responses to delivery or support queries.",
          ]}
        />
      </Section>

      <Section heading="3. How We Use Your Information">
        <p>We process your personal information in order to:</p>
        <List
          items={[
            "Process and deliver your order, and keep you updated on its status.",
            "Send you a receipt and order confirmation by email and/or WhatsApp.",
            "Provide customer support and respond to your enquiries.",
            "Meet our legal, accounting and tax obligations.",
            "Detect and prevent fraud and keep our website secure.",
            "With your consent, send you news about products, offers and updates (you can opt out at any time).",
          ]}
        />
      </Section>

      <Section heading="4. Consent">
        <SubHeading>How we obtain your consent</SubHeading>
        <p>
          When you provide personal information to complete a purchase, we treat
          this as your consent to use that information for that specific purpose.
          For any secondary purpose, such as marketing, we will ask for your
          explicit consent or give you a clear way to opt out.
        </p>
        <SubHeading>How to withdraw consent</SubHeading>
        <p>
          You may withdraw your consent at any time by emailing{" "}
          <a href={`mailto:${PRIVACY_EMAIL}`} className="text-gold hover:text-gold-light">
            {PRIVACY_EMAIL}
          </a>
          . You can also reply <strong>STOP</strong> to any marketing WhatsApp
          message to opt out.
        </p>
      </Section>

      <Section heading="5. Payment Security">
        <p>
          Payments are handled by <strong>Flutterwave</strong>, a PCI-DSS
          compliant payment processor. Your card information is encrypted in
          transit and processed directly by the gateway. Male Vitamin does not
          see or store your full card number, CVV or PIN. We use SSL/TLS
          encryption across our website.
        </p>
        <Callout title="Discreet billing">
          <p>
            Your bank or card statement will show a discreet descriptor rather
            than a description of the product, to protect your privacy.
          </p>
        </Callout>
      </Section>

      <Section heading="6. Disclosure & Third-Party Services">
        <p>
          We do not sell or rent your personal information. We share it only with
          trusted service providers who help us run our business, and only to the
          extent they need it to perform their service. These include:
        </p>
        <List
          items={[
            "Our payment processor (Flutterwave) to take payment securely.",
            "Our courier / delivery partners to deliver your order.",
            "Our notification provider, used to send order receipts and alerts by email and WhatsApp and to log the sale for our records.",
          ]}
        />
        <p>
          We may also disclose your information where required by law, or to
          enforce our Terms of Service and protect our rights. We encourage you to
          review the privacy policies of any third-party services.
        </p>
      </Section>

      <Section heading="7. Cookies & Tracking">
        <p>
          We use cookies and similar technologies to keep the site working, to
          remember your preferences and to understand how visitors use the site
          (for example, through analytics). You can control or disable cookies
          through your browser settings, although some parts of the site may not
          function correctly if you do.
        </p>
      </Section>

      <Section heading="8. How Long We Keep Your Information">
        <p>
          We keep your personal information only for as long as necessary to
          fulfil the purposes described in this policy, including to satisfy any
          legal, accounting or reporting requirements. Order and tax records are
          generally retained for the period required by South African law, after
          which they are securely deleted or anonymised.
        </p>
      </Section>

      <Section heading="9. Your Rights Under POPIA">
        <p>As a data subject under POPIA, you have the right to:</p>
        <List
          items={[
            "Be told what personal information we hold about you and request access to it.",
            "Ask us to correct or update information that is inaccurate or incomplete.",
            "Ask us to delete your information where there is no lawful reason for us to keep it.",
            "Object to the processing of your information for direct marketing.",
            "Withdraw consent you previously gave, at any time.",
            "Lodge a complaint with the Information Regulator of South Africa.",
          ]}
        />
        <p>
          To exercise any of these rights, contact our Information Officer at{" "}
          <a href={`mailto:${PRIVACY_EMAIL}`} className="text-gold hover:text-gold-light">
            {PRIVACY_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section heading="10. Age Restriction">
        <p>
          Our products are intended for adults. By using this website and placing
          an order, you confirm that you are at least 18 years old.
        </p>
      </Section>

      <Section heading="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes take effect
          when posted on this page, and material changes will be highlighted here.
          If our business is acquired or merged, your information may be
          transferred to the new owners, who will remain bound by this policy.
        </p>
      </Section>

      <Section heading="12. Contact Us">
        <p>If you have any questions about this policy or your personal information:</p>
        <List
          items={[
            <>
              Information Officer / Privacy:{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="text-gold hover:text-gold-light">
                {PRIVACY_EMAIL}
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
