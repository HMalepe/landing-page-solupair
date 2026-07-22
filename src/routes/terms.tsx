import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";
import { RouteLoadingSkeleton } from "@/components/route-loading-skeleton";
import {
  CONTACT_EMAIL,
  LEGAL_NAME,
  LOCATION_LABEL,
  SITE_NAME,
  SITE_URL,
  pageHead,
} from "@/lib/site";

const UPDATED = "22 July 2026";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  pendingComponent: RouteLoadingSkeleton,
  pendingMs: 0,
  loader: async () => null,
  head: () =>
    pageHead({
      title: `Terms of Service — ${LEGAL_NAME}`,
      description: `Terms governing use of the ${SITE_NAME} website and project enquiries submitted to ${LEGAL_NAME}.`,
      path: "/terms",
    }),
});

function TermsPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Terms of Service" updated={UPDATED}>
      <p>
        These Terms of Service (“Terms”) govern your use of the{" "}
        <strong>{SITE_NAME}</strong> website at{" "}
        <a href={SITE_URL} className="legal-page-inline-link">
          {SITE_URL.replace("https://", "")}
        </a>{" "}
        and any project enquiry or message you send to <strong>{LEGAL_NAME}</strong> (“we”, “us”,
        “our”). By using the site or submitting an enquiry, you agree to these Terms.
      </p>

      <LegalSection id="about-site" title="1. About the site">
        <p>
          The website provides information about our digital product, design and automation
          services. Content is for general information only and does not create a binding project
          engagement until we agree a written proposal, statement of work or contract with you.
        </p>
        <p>
          We operate from {LOCATION_LABEL}. Pricing examples on the site are indicative estimates,
          not fixed offers or invoices.
        </p>
      </LegalSection>

      <LegalSection id="enquiries" title="2. Enquiries and estimates">
        <p>
          When you submit a contact or project form, you confirm that the information you provide
          is accurate to the best of your knowledge and that you are authorised to share it. We
          will use that information to respond and, if relevant, prepare an estimate or proposal.
        </p>
        <p>
          An enquiry does not oblige either party to proceed. Formal work begins only after both
          sides accept written commercial terms (scope, fees, timelines and deliverables).
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="3. Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>Misuse forms for spam, phishing or unrelated solicitation</li>
          <li>Attempt to disrupt, probe or breach the site’s security</li>
          <li>Scrape or copy substantial site content for competing commercial use without permission</li>
          <li>Submit unlawful, defamatory or infringing material</li>
        </ul>
        <p>We may block access or ignore submissions that appear abusive or automated.</p>
      </LegalSection>

      <LegalSection id="ip" title="4. Intellectual property">
        <p>
          Unless otherwise stated, the site’s branding, copy, layout, graphics and code are owned
          by {LEGAL_NAME} or our licensors. You may view and share links to public pages for
          ordinary business evaluation. You may not republish our materials as your own or remove
          proprietary notices.
        </p>
        <p>
          Client project IP is handled in the relevant project agreement — not automatically by
          these website Terms.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" title="5. Third-party links and tools">
        <p>
          The site may link to third-party products, demos or references. We are not responsible
          for their content, availability or privacy practices. Your use of third-party services is
          under their terms.
        </p>
      </LegalSection>

      <LegalSection id="disclaimer" title="6. Disclaimers">
        <p>
          The site is provided on an “as available” basis. We aim for accuracy but do not warrant
          that all content is complete, current or error-free. Estimates, case descriptions and
          feature lists may change as products and scopes evolve.
        </p>
        <p>
          To the fullest extent permitted by South African law, we exclude liability for indirect
          or consequential loss arising from use of the website alone (as distinct from liability
          under a signed project contract, which will set its own limits).
        </p>
      </LegalSection>

      <LegalSection id="liability" title="7. Limitation of liability">
        <p>
          Nothing in these Terms excludes liability that cannot lawfully be excluded, including for
          gross negligence or fraud where such exclusion is prohibited. For website use, our
          aggregate liability arising from these Terms is limited to ZAR 1,000 or the amount you
          paid us (if any) for website-related paid services in the preceding 12 months, whichever
          is greater — except where a separate written agreement applies.
        </p>
      </LegalSection>

      <LegalSection id="privacy" title="8. Privacy">
        <p>
          Personal information submitted through the site is handled as described in our{" "}
          <Link to="/privacy" className="legal-page-inline-link">
            Privacy Policy
          </Link>
          . By using the site or sending an enquiry, you acknowledge that policy.
        </p>
      </LegalSection>

      <LegalSection id="changes-terms" title="9. Changes">
        <p>
          We may revise these Terms periodically. The “Last updated” date will change when we do.
          Continued use of the site after changes constitutes acceptance of the updated Terms for
          website visitors.
        </p>
      </LegalSection>

      <LegalSection id="law" title="10. Governing law">
        <p>
          These Terms are governed by the laws of the Republic of South Africa. Courts of South
          Africa have exclusive jurisdiction over disputes arising from website use under these
          Terms, without limiting any dispute-resolution clause in a separate project agreement.
        </p>
      </LegalSection>

      <LegalSection id="contact-terms" title="11. Contact">
        <p>
          Questions about these Terms:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="legal-page-inline-link">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
