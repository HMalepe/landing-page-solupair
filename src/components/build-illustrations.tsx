/**
 * On-brand abstract illustrations for the "What We Build" showcase — no
 * photography (network access to source real stock photos is blocked in
 * this environment, and nothing here claims to depict a real client).
 * Built from the same brand-gradient/glow language as the hero ball and
 * quote builder, each keyed to a build category or capability tier.
 */

export type BuildIllustrationId =
  | "salons"
  | "clinics"
  | "restaurants"
  | "services"
  | "retail"
  | "website"
  | "system"
  | "custom";

const GRAD_ID_PREFIX = "build-illo-grad-";

function GradientDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${GRAD_ID_PREFIX}${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--brand-cyan)" />
        <stop offset="100%" stopColor="var(--brand-pink)" />
      </linearGradient>
    </defs>
  );
}

function IllustrationFrame({
  id,
  glow = "cyan",
  children,
}: {
  id: string;
  glow?: "cyan" | "pink" | "purple";
  children: React.ReactNode;
}) {
  const glowVar =
    glow === "pink"
      ? "var(--brand-pink)"
      : glow === "purple"
        ? "var(--brand-purple)"
        : "var(--brand-cyan)";
  return (
    <div className="build-illo" aria-hidden>
      <div className="build-illo__glow" style={{ background: glowVar }} />
      <svg viewBox="0 0 120 120" className="build-illo__svg">
        <GradientDefs id={id} />
        {children}
      </svg>
    </div>
  );
}

const STROKE = {
  fill: "none",
  strokeWidth: 4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Salons & barbers — scissors over a mirror circle. */
function SalonsIllustration() {
  return (
    <IllustrationFrame id="salons" glow="pink">
      <circle cx="60" cy="60" r="42" stroke={`url(#${GRAD_ID_PREFIX}salons)`} {...STROKE} />
      <circle cx="42" cy="42" r="7" stroke={`url(#${GRAD_ID_PREFIX}salons)`} {...STROKE} />
      <circle cx="42" cy="78" r="7" stroke={`url(#${GRAD_ID_PREFIX}salons)`} {...STROKE} />
      <path d="M48 47 L88 78 M48 73 L88 42" stroke={`url(#${GRAD_ID_PREFIX}salons)`} {...STROKE} />
    </IllustrationFrame>
  );
}

/** Clinics & pharmacies — medical cross with a pulse line. */
function ClinicsIllustration() {
  return (
    <IllustrationFrame id="clinics" glow="cyan">
      <rect
        x="46"
        y="26"
        width="28"
        height="68"
        rx="8"
        stroke={`url(#${GRAD_ID_PREFIX}clinics)`}
        {...STROKE}
      />
      <rect
        x="26"
        y="46"
        width="68"
        height="28"
        rx="8"
        stroke={`url(#${GRAD_ID_PREFIX}clinics)`}
        {...STROKE}
      />
      <path
        d="M20 60 H40 L48 44 L60 76 L68 60 H100"
        stroke={`url(#${GRAD_ID_PREFIX}clinics)`}
        {...STROKE}
        opacity="0.55"
      />
    </IllustrationFrame>
  );
}

/** Restaurants & takeaways — plate with fork and knife. */
function RestaurantsIllustration() {
  return (
    <IllustrationFrame id="restaurants" glow="pink">
      <circle cx="60" cy="60" r="38" stroke={`url(#${GRAD_ID_PREFIX}restaurants)`} {...STROKE} />
      <circle
        cx="60"
        cy="60"
        r="20"
        stroke={`url(#${GRAD_ID_PREFIX}restaurants)`}
        {...STROKE}
        opacity="0.55"
      />
      <path
        d="M34 40 V50 M34 40 V80 M30 40 V50 M38 40 V50"
        stroke={`url(#${GRAD_ID_PREFIX}restaurants)`}
        {...STROKE}
      />
      <path
        d="M86 40 V56 Q86 62 80 62 V80"
        stroke={`url(#${GRAD_ID_PREFIX}restaurants)`}
        {...STROKE}
      />
    </IllustrationFrame>
  );
}

/** Service businesses (trades) — wrench crossing a gear. */
function ServicesIllustration() {
  return (
    <IllustrationFrame id="services" glow="purple">
      <circle cx="60" cy="60" r="22" stroke={`url(#${GRAD_ID_PREFIX}services)`} {...STROKE} />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = 60 + Math.cos(angle) * 26;
        const y1 = 60 + Math.sin(angle) * 26;
        const x2 = 60 + Math.cos(angle) * 34;
        const y2 = 60 + Math.sin(angle) * 34;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`url(#${GRAD_ID_PREFIX}services)`}
            {...STROKE}
          />
        );
      })}
      <path
        d="M78 78 L96 96 M92 92 L100 84"
        stroke={`url(#${GRAD_ID_PREFIX}services)`}
        {...STROKE}
        opacity="0.7"
      />
    </IllustrationFrame>
  );
}

/** Retail teams — shopping bag. */
function RetailIllustration() {
  return (
    <IllustrationFrame id="retail" glow="cyan">
      <path d="M34 46 H86 L82 92 H38 Z" stroke={`url(#${GRAD_ID_PREFIX}retail)`} {...STROKE} />
      <path
        d="M44 46 V36 Q44 22 60 22 Q76 22 76 36 V46"
        stroke={`url(#${GRAD_ID_PREFIX}retail)`}
        {...STROKE}
      />
    </IllustrationFrame>
  );
}

/** Website tier — browser window with a pulse line. */
function WebsiteIllustration() {
  return (
    <IllustrationFrame id="website" glow="cyan">
      <rect
        x="22"
        y="30"
        width="76"
        height="58"
        rx="8"
        stroke={`url(#${GRAD_ID_PREFIX}website)`}
        {...STROKE}
      />
      <path d="M22 46 H98" stroke={`url(#${GRAD_ID_PREFIX}website)`} {...STROKE} opacity="0.55" />
      <circle cx="32" cy="38" r="2.5" fill="var(--brand-pink)" />
      <circle cx="41" cy="38" r="2.5" fill="var(--brand-cyan)" />
      <path
        d="M32 68 L46 58 L58 72 L72 54 L88 74"
        stroke={`url(#${GRAD_ID_PREFIX}website)`}
        {...STROKE}
      />
    </IllustrationFrame>
  );
}

/** Business system tier — layered dashboard panels. */
function SystemIllustration() {
  return (
    <IllustrationFrame id="system" glow="purple">
      <rect
        x="22"
        y="26"
        width="44"
        height="30"
        rx="6"
        stroke={`url(#${GRAD_ID_PREFIX}system)`}
        {...STROKE}
      />
      <rect
        x="70"
        y="26"
        width="28"
        height="30"
        rx="6"
        stroke={`url(#${GRAD_ID_PREFIX}system)`}
        {...STROKE}
        opacity="0.7"
      />
      <rect
        x="22"
        y="64"
        width="28"
        height="30"
        rx="6"
        stroke={`url(#${GRAD_ID_PREFIX}system)`}
        {...STROKE}
        opacity="0.7"
      />
      <rect
        x="54"
        y="64"
        width="44"
        height="30"
        rx="6"
        stroke={`url(#${GRAD_ID_PREFIX}system)`}
        {...STROKE}
      />
    </IllustrationFrame>
  );
}

/** Custom tool tier — connected nodes / workflow. */
function CustomIllustration() {
  return (
    <IllustrationFrame id="custom" glow="pink">
      <circle cx="30" cy="34" r="10" stroke={`url(#${GRAD_ID_PREFIX}custom)`} {...STROKE} />
      <circle cx="90" cy="34" r="10" stroke={`url(#${GRAD_ID_PREFIX}custom)`} {...STROKE} />
      <circle cx="60" cy="70" r="10" stroke={`url(#${GRAD_ID_PREFIX}custom)`} {...STROKE} />
      <circle
        cx="60"
        cy="102"
        r="8"
        stroke={`url(#${GRAD_ID_PREFIX}custom)`}
        {...STROKE}
        opacity="0.6"
      />
      <path
        d="M38 40 L52 64 M82 40 L68 64 M60 80 L60 94"
        stroke={`url(#${GRAD_ID_PREFIX}custom)`}
        {...STROKE}
      />
    </IllustrationFrame>
  );
}

const ILLUSTRATIONS: Record<BuildIllustrationId, () => React.ReactElement> = {
  salons: SalonsIllustration,
  clinics: ClinicsIllustration,
  restaurants: RestaurantsIllustration,
  services: ServicesIllustration,
  retail: RetailIllustration,
  website: WebsiteIllustration,
  system: SystemIllustration,
  custom: CustomIllustration,
};

export function BuildIllustration({ id }: { id: BuildIllustrationId }) {
  const Component = ILLUSTRATIONS[id];
  return <Component />;
}
