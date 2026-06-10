import type { Metadata } from "next";
import {
  LegalPage,
  Section,
  SubHeading,
  Callout,
  List,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | Male Vitamin",
  description:
    "The terms and conditions governing your use of the Male Vitamin website and your purchase of our men's performance supplement.",
  alternates: { canonical: "https://malevitamin.co.za/terms-of-service" },
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These Terms govern your use of malevitamin.co.za and your purchase of Male Vitamin products. By using this website or placing an order, you agree to these Terms."
      lastUpdated="10 June 2026"
    >
      <Callout variant="warning" title="Important health notice">
        <p>
          Male Vitamin is a natural dietary supplement, not a pharmaceutical
          medicine. It is not intended to diagnose, treat, cure or prevent any
          disease. Do not use it as a substitute for professional medical advice.
          If you have a heart condition, high or low blood pressure, or take
          nitrates, alpha-blockers or any chronic medication, consult your doctor
          before use.
        </p>
      </Callout>

      <Section heading="1. Agreement Between You and Male Vitamin">
        <p>
          These Terms and Conditions form a binding agreement between you and Male
          Vitamin regarding your use of our website and services, and apply to all
          pages under malevitamin.co.za. Your continued use of the site
          constitutes acceptance of these Terms and all notices and policies
          referenced in them.
        </p>
      </Section>

      <Section heading="2. Eligibility & Age Requirement">
        <p>
          Our products are intended for healthy adult men aged 18 or older, or for
          those who have obtained medical clearance. By placing an order, you
          confirm that you meet these requirements and that all information you
          provide is accurate.
        </p>
      </Section>

      <Section heading="3. No Medical Advice">
        <p>
          The information on this website — including product descriptions,
          ingredient information, the vitality quiz and any blog or marketing
          content — is provided for general informational purposes only and does
          not constitute medical advice. Using our website or products does not
          create a doctor-patient relationship.
        </p>
        <p>
          Always seek the advice of a qualified healthcare provider with any
          questions about a medical condition or before starting any supplement.
          Erectile dysfunction and low libido can be symptoms of underlying health
          conditions such as cardiovascular disease or diabetes — we strongly
          encourage you to consult a doctor to rule these out.
        </p>
      </Section>

      <Section heading="4. Product Disclaimer & Results">
        <p>
          Male Vitamin is formulated to support men&apos;s natural performance,
          stamina and vitality. It is a dietary supplement and individual results
          may vary depending on factors including diet, lifestyle, age and overall
          health.
        </p>
        <Callout title="Results disclaimer">
          <p>
            Testimonials and reviews represent individual experiences and are not a
            guarantee that you will achieve the same results. Statements about our
            products have not been evaluated by the South African Health Products
            Regulatory Authority (SAHPRA). This product is not intended to
            diagnose, treat, cure or prevent any disease.
          </p>
        </Callout>
      </Section>

      <Section heading="5. Safe Use, Warnings & Contraindications">
        <p>Please use Male Vitamin responsibly and follow the label directions.</p>
        <List
          items={[
            "Do not exceed the recommended daily dosage.",
            "Do not use if you are taking nitrates or alpha-blockers for heart conditions or blood pressure without consulting your doctor first.",
            "Consult your physician before use if you have any cardiovascular condition, diabetes, or any chronic illness, or if you take prescription medication.",
            "Discontinue use and seek medical attention if you experience any adverse reaction.",
            "Keep out of reach of children. Not intended for use by women, minors, or anyone under 18.",
            "Check the ingredient list if you have any known allergies.",
          ]}
        />
      </Section>

      <Section heading="6. Pricing, Orders & Payment">
        <p>
          All prices are shown in South African Rand (ZAR) and include applicable
          taxes unless stated otherwise. Delivery fees are added at checkout
          according to your chosen delivery option. We reserve the right to correct
          pricing errors and to refuse or cancel any order, in which case any
          payment taken will be refunded.
        </p>
        <p>
          Payments are processed securely through Flutterwave. By submitting an
          order you confirm that you are authorised to use the payment method
          provided.
        </p>
      </Section>

      <Section heading="7. Warranty Disclaimer">
        <List
          items={[
            'Our website and content are provided "as is" and "as available" without warranties of any kind, whether express or implied.',
            "We do not warrant that the website will be uninterrupted, timely, secure or error-free.",
            "We do not guarantee any specific health, performance or cosmetic result from using our products.",
            "You assume sole responsibility for your use of the website and products.",
          ]}
        />
      </Section>

      <Section heading="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Male Vitamin and its suppliers
          shall not be liable for any indirect, incidental, special or
          consequential damages arising out of or relating to your use of the
          website or products. Nothing in these Terms excludes or limits our
          liability for death or personal injury caused by our negligence, for
          fraud, or for any liability that cannot be excluded under the South
          African Consumer Protection Act (CPA).
        </p>
      </Section>

      <Section heading="9. External Links">
        <p>
          Our website may contain links to third-party websites. We are not
          responsible for the content, products or privacy practices of those
          sites. Visiting them is at your own risk and subject to their terms.
        </p>
      </Section>

      <Section heading="10. Intellectual Property & Acceptable Use">
        <p>
          All content on this website — including text, graphics, logos, images and
          the Male Vitamin name and branding — is our property or licensed to us and
          is protected by law. You may not copy, reproduce, modify, resell or
          commercially exploit any content without our written permission. You agree
          not to use the website for any unlawful purpose or in any way that could
          damage, disable or impair the site.
        </p>
      </Section>

      <Section heading="11. Reviews & Submissions">
        <p>
          If you submit a review, testimonial or other content, you confirm it is
          your own, accurate and lawful. You grant Male Vitamin the right to use,
          publish and share that content for marketing and operational purposes. We
          may moderate, edit or remove submissions at our discretion.
        </p>
      </Section>

      <Section heading="12. Your Consumer Rights (CPA)">
        <p>
          Nothing in these Terms limits the rights you have under the Consumer
          Protection Act, including your right to a cooling-off period on certain
          online purchases and your rights regarding defective goods. Please see our{" "}
          <a href="/returns" className="text-gold hover:text-gold-light">
            Returns &amp; Refund Policy
          </a>{" "}
          for details.
        </p>
      </Section>

      <Section heading="13. Changes to These Terms">
        <p>
          We may update these Terms from time to time. The current version will
          always be posted on this page, and your continued use of the website
          after changes are posted constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section heading="14. Governing Law">
        <p>
          These Terms are governed by the laws of the Republic of South Africa, and
          you agree to the non-exclusive jurisdiction of the South African courts.
        </p>
      </Section>

      <Section heading="15. Contact Us">
        <List
          items={[
            <>
              Email:{" "}
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
