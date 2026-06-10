import type { Metadata } from "next";
import {
  LegalPage,
  Section,
  Callout,
  List,
  SUPPORT_EMAIL,
} from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Disclaimer | Male Vitamin",
  description:
    "Important medical and health disclaimers for the Male Vitamin men's performance supplement. Read before use.",
  alternates: { canonical: "https://malevitamin.co.za/disclaimer" },
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="Please read this disclaimer carefully before using the Male Vitamin website or our products. It explains the limits of the information we provide and important health warnings."
      lastUpdated="10 June 2026"
    >
      <Callout variant="warning" title="Not a substitute for medical advice">
        <p>
          The content on this website and our products are not intended to be a
          substitute for professional medical advice, diagnosis or treatment.
          Always seek the advice of your physician or another qualified health
          provider with any questions you may have regarding a medical condition.
        </p>
      </Callout>

      <Section heading="1. Dietary Supplement Disclaimer">
        <p>
          Male Vitamin is a natural dietary supplement. These statements have not
          been evaluated by the South African Health Products Regulatory Authority
          (SAHPRA) or any equivalent regulator. This product is{" "}
          <strong>not intended to diagnose, treat, cure or prevent any disease</strong>.
          It is a dietary supplement and not a pharmaceutical drug.
        </p>
      </Section>

      <Section heading="2. Consult a Healthcare Professional">
        <p>
          Erectile dysfunction and low libido can be early signs of serious
          underlying conditions, including cardiovascular disease, diabetes and
          hormonal imbalances. We strongly recommend that you consult a healthcare
          provider to identify and address any underlying causes before relying on
          any supplement.
        </p>
      </Section>

      <Section heading="3. Drug Interactions & Contraindications">
        <Callout variant="warning" title="Do not use if...">
          <List
            items={[
              "You take nitrates or alpha-blockers for a heart condition or high blood pressure — combining these with vasodilating ingredients can be dangerous.",
              "You have a cardiovascular condition, abnormal blood pressure, or have suffered a heart attack or stroke — consult your doctor first.",
              "You have diabetes, kidney or liver disease, or any chronic medical condition.",
              "You are taking prescription medication — check with your doctor or pharmacist for possible interactions.",
            ]}
          />
        </Callout>
        <p>
          If you are unsure whether this product is suitable for you, do not use it
          until you have spoken to a qualified healthcare professional.
        </p>
      </Section>

      <Section heading="4. Allergies & Ingredients">
        <p>
          Please review the full ingredient list before use. If you have a known
          allergy or sensitivity to any ingredient, do not use the product.
          Discontinue use immediately and seek medical attention if you experience
          any allergic reaction or adverse effect.
        </p>
      </Section>

      <Section heading="5. Individual Results May Vary">
        <p>
          Results from using Male Vitamin vary from person to person and depend on
          factors such as diet, exercise, age, consistency of use and overall
          health. Any testimonials, reviews or examples shown on this website
          represent individual experiences and are{" "}
          <strong>not a guarantee</strong> that you will achieve the same outcome.
        </p>
      </Section>

      <Section heading="6. Intended Use">
        <p>
          Male Vitamin is intended for use by healthy adult men aged 18 and over.
          It is not intended for use by women, by minors, or by men who have not
          received medical clearance where required. Keep out of reach of children.
        </p>
      </Section>

      <Section heading="7. Information & External Links Disclaimer">
        <p>
          We make every effort to keep the information on this website accurate and
          up to date, but we make no warranties about its completeness, reliability
          or accuracy. The wellness field changes frequently and information may
          become outdated. Any reliance you place on this information is strictly at
          your own risk. Our website may link to third-party sites; we are not
          responsible for their content or practices.
        </p>
      </Section>

      <Section heading="8. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Male Vitamin will not be liable
          for any loss or damage arising from your use of, or reliance on, the
          information or products provided through this website. Nothing in this
          disclaimer excludes liability that cannot be excluded under South African
          law, including the Consumer Protection Act.
        </p>
      </Section>

      <Section heading="9. Questions">
        <p>
          If you have any questions about this disclaimer, please contact us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:text-gold-light">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
