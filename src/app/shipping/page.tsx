import type { Metadata } from "next";
import {
  LegalPage,
  Section,
  Callout,
  List,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Shipping Policy | Male Vitamin",
  description:
    "How Male Vitamin ships your order — processing times, delivery options, costs, tracking and our discreet, unmarked packaging across South Africa.",
  alternates: { canonical: "https://malevitamin.co.za/shipping" },
  robots: { index: true, follow: true },
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      intro="Fast, reliable and completely discreet delivery across South Africa. Here's everything you need to know about how your order reaches you."
      lastUpdated="10 June 2026"
    >
      <Callout title="Discreet, unmarked packaging">
        <p>
          Every Male Vitamin order is shipped in plain, unbranded packaging with no
          indication of the contents on the outside. Your privacy is guaranteed
          from checkout to your doorstep.
        </p>
      </Callout>

      <Section heading="1. Order Processing">
        <p>
          Orders are processed within <strong>1–2 business days</strong> (Monday to
          Friday, excluding South African public holidays). Orders placed over a
          weekend or public holiday are processed on the next business day. You will
          receive a confirmation by email and/or WhatsApp once your order is placed,
          and again when it ships.
        </p>
      </Section>

      <Section heading="2. Delivery Options & Costs">
        <p>We offer two delivery options at checkout, charged in addition to the product price:</p>
        <List
          items={[
            <>
              <strong>Standard Delivery — R89.00:</strong> typically delivered
              within 2–5 business days after dispatch.
            </>,
            <>
              <strong>Express Delivery — R119.00:</strong> typically delivered
              within 1–2 business days after dispatch.
            </>,
          ]}
        />
        <p className="text-foreground/50 text-sm">
          Delivery timeframes are estimates from the date your order is dispatched
          and may vary for outlying or rural areas.
        </p>
      </Section>

      <Section heading="3. Areas We Serve">
        <p>
          We currently deliver to all major areas across South Africa. If you are in
          a remote or rural location, delivery may take a little longer. If we are
          unable to deliver to your address, we will contact you to arrange an
          alternative or a refund.
        </p>
      </Section>

      <Section heading="4. Order Tracking">
        <p>
          Once your order is dispatched, you will receive a notification with your
          tracking details by email and/or WhatsApp. Please allow a few hours for
          tracking information to become active with the courier.
        </p>
      </Section>

      <Section heading="5. Accurate Delivery Details">
        <p>
          Please make sure your delivery address and contact number are complete and
          correct at checkout. Male Vitamin is not responsible for delays or failed
          deliveries caused by incorrect or incomplete address information. If a
          parcel is returned to us due to an incorrect address or repeated failed
          delivery attempts, re-delivery may incur an additional shipping charge.
        </p>
      </Section>

      <Section heading="6. Failed Delivery & Collection">
        <p>
          If you are not available to receive your parcel, the courier will leave a
          notification and attempt re-delivery or arrange collection. Please respond
          to courier notifications promptly to avoid your parcel being returned to
          us.
        </p>
      </Section>

      <Section heading="7. Lost or Damaged Parcels">
        <p>
          If your parcel appears lost in transit or arrives damaged, please contact
          us as soon as possible at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:text-gold-light">
            {SUPPORT_EMAIL}
          </a>{" "}
          (within 7 days of the expected delivery date). We will work with the
          courier to investigate and resolve the issue.
        </p>
      </Section>

      <Section heading="8. Risk & Ownership">
        <p>
          Ownership and risk in the products pass to you on delivery to the address
          you provided. For orders requiring proof of payment before dispatch, no
          parcel is sent until payment is confirmed.
        </p>
      </Section>

      <Section heading="9. Delays Beyond Our Control">
        <p>
          Male Vitamin is not liable for shipping delays caused by circumstances
          beyond our reasonable control, including severe weather, courier strikes,
          load-shedding, natural disasters or public health events. We will always
          do our best to keep you informed.
        </p>
      </Section>

      <Section heading="10. Contact Us">
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
