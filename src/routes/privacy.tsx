import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";
import { RouteLoadingSkeleton } from "@/components/route-loading-skeleton";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  LEGAL_NAME,
  LOCATION_LABEL,
  SITE_NAME,
  SITE_URL,
  pageHead,
} from "@/lib/site";

const UPDATED = "22 July 2026";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  pendingComponent: RouteLoadingSkeleton,
  pendingMs: 0,
  loader: async () => null,
  head: () =>
    pageHead({
      title: `Privacy Policy — ${LEGAL_NAME}`,
      description: `How ${LEGAL_NAME} collects, uses and protects personal information submitted through ${SITE_NAME} contact and project enquiry forms.`,
      path: "/privacy",
    }),
});

function PrivacyPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Privacy Policy" updated={UPDATED}>
      <p>
        This Privacy Policy explains how <strong>{LEGAL_NAME}</strong> (“we”, “us”, “our”)
        handles personal information when you use{" "}
        <a href={SITE_URL} className="legal-page-inline-link">
          {SITE_URL.replace("https://", "")}
        </a>{" "}
        or contact us about a project. We operate in South Africa and process information in line
        with the Protection of Personal Information Act 4 of 2013 (POPIA) and other applicable law.
      </p>

      <LegalSection id="who-we-are" title="1. Who we are">
        <p>
          The responsible party for this website is <strong>{LEGAL_NAME}</strong>.
        </p>
        <ul>
          <li>Location: {LOCATION_LABEL}</li>
          <li>
            Email:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="legal-page-inline-link">
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>Phone: {CONTACT_PHONE_DISPLAY}</li>
        </ul>
      </LegalSection>

      <LegalSection id="what-we-collect" title="2. Information we collect">
        <p>We collect information you choose to send us, including when you:</p>
        <ul>
          <li>Submit a project enquiry or contact form</li>
          <li>Email or message us directly</li>
          <li>Request a quote, discovery call or proposal</li>
        </ul>
        <p>That may include:</p>
        <ul>
          <li>Name and business or organisation name</li>
          <li>Email address and phone number</li>
          <li>Project description, goals, timeline and budget notes</li>
          <li>Any files or links you voluntarily attach or share</li>
          <li>
            Basic technical data such as browser type, device and approximate location derived from
            IP address (for security and site reliability)
          </li>
        </ul>
        <p>
          We do not require sensitive personal information (special personal information under
          POPIA) to submit an enquiry. Please do not include health, biometric, children’s or
          similarly sensitive data in forms unless we have expressly agreed a secure process with
          you.
        </p>
      </LegalSection>

      <LegalSection id="why-we-use" title="3. Why we use your information">
        <p>We use personal information to:</p>
        <ul>
          <li>Respond to enquiries and provide quotes or next-step recommendations</li>
          <li>Scope, deliver and support digital projects you engage us for</li>
          <li>Manage contracts, invoices and legitimate business records</li>
          <li>Improve our website, communications and service quality</li>
          <li>Protect against abuse, spam and security incidents</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>
        <p>
          We process this information because it is necessary to take steps at your request before
          entering a contract, to perform a contract with you, and/or for our legitimate interests
          in operating {SITE_NAME} — balanced against your privacy rights under POPIA.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="4. Sharing and processors">
        <p>
          We do not sell your personal information. We may share limited information with trusted
          service providers who help us operate (for example email delivery, hosting, analytics or
          CRM tools), only as needed to provide our services and under appropriate agreements.
        </p>
        <p>
          We may also disclose information if required by law, court order or to protect the rights,
          safety or property of {LEGAL_NAME}, our clients or the public.
        </p>
      </LegalSection>

      <LegalSection id="storage" title="5. Storage, retention and security">
        <p>
          Information is stored using systems and providers appropriate for a South African
          professional services business. We keep enquiry and project records for as long as needed
          to respond, deliver work, meet legal/accounting requirements, and resolve disputes —
          typically no longer than necessary for those purposes.
        </p>
        <p>
          We apply reasonable organisational and technical measures to protect personal information.
          No method of transmission or storage is completely secure; if you suspect unauthorised
          access related to your data with us, contact us immediately.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="6. Cookies and similar technologies">
        <p>
          Our site may use essential cookies or similar technologies required for security,
          preference storage and basic performance. We do not use contact-form submissions for
          third-party advertising profiles. If we introduce optional analytics cookies that are not
          strictly necessary, we will update this policy and provide appropriate choices where
          required.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" title="7. Your rights">
        <p>Subject to POPIA and applicable law, you may request to:</p>
        <ul>
          <li>Access personal information we hold about you</li>
          <li>Correct or update inaccurate information</li>
          <li>Object to or restrict certain processing</li>
          <li>Request deletion where we no longer have a lawful basis to keep it</li>
          <li>Lodge a complaint with the Information Regulator (South Africa)</li>
        </ul>
        <p>
          To exercise these rights, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="legal-page-inline-link">
            {CONTACT_EMAIL}
          </a>{" "}
          with enough detail for us to verify and respond. We may need to confirm your identity
          before acting on a request.
        </p>
      </LegalSection>

      <LegalSection id="children" title="8. Children">
        <p>
          Our services are directed at businesses and adult decision-makers. We do not knowingly
          collect personal information from children under 18 through this website.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="9. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The “Last updated” date at the top
          will change when we do. Continued use of the site after an update constitutes notice of
          the revised policy for website visitors; material changes affecting active clients will
          be communicated where appropriate.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="10. Contact">
        <p>
          For privacy questions or requests:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="legal-page-inline-link">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <p>
          See also our{" "}
          <Link to="/terms" className="legal-page-inline-link">
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
