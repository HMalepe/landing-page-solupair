import { useCallback, useEffect, useState } from "react";
import {
  PRICING_CATEGORIES,
  PRICING_CATEGORY_INTRO,
  type PricingCategoryChip,
} from "@/lib/pricing-categories";
import { useDeviceProfile } from "@/hooks/use-device-profile";

function scrollToCategoryTarget(targetId: string, smooth: boolean) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

export function PricingCategoriesSection() {
  const { prefersReducedMotion } = useDeviceProfile();
  const [activeChipId, setActiveChipId] = useState<string>(PRICING_CATEGORY_INTRO.chips[0].id);

  const selectChip = useCallback(
    (chip: PricingCategoryChip) => {
      setActiveChipId(chip.id);
      scrollToCategoryTarget(chip.targetId, !prefersReducedMotion);
    },
    [prefersReducedMotion],
  );

  useEffect(() => {
    const uniqueTargets = new Map<string, string[]>();
    for (const chip of PRICING_CATEGORY_INTRO.chips) {
      const list = uniqueTargets.get(chip.targetId) ?? [];
      list.push(chip.id);
      uniqueTargets.set(chip.targetId, list);
    }

    const observed: { targetId: string; chipIds: string[]; el: HTMLElement }[] = [];
    for (const [targetId, chipIds] of uniqueTargets) {
      const el = document.getElementById(targetId);
      if (el) observed.push({ targetId, chipIds, el });
    }
    if (observed.length === 0) return;

    const ratios = new Map<string, number>();
    let lastSelected = PRICING_CATEGORY_INTRO.chips[0].id;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const match = observed.find((t) => t.el === entry.target);
          if (!match) continue;
          ratios.set(match.targetId, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestTarget = "";
        let bestRatio = -1;
        for (const [targetId, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestTarget = targetId;
          }
        }
        if (bestRatio <= 0.08 || !bestTarget) return;

        const chipIds = uniqueTargets.get(bestTarget) ?? [];
        const preferred = chipIds.includes(lastSelected) ? lastSelected : chipIds[0];
        if (preferred) setActiveChipId(preferred);
      },
      {
        root: null,
        rootMargin: "0px 0px -55% 0px",
        threshold: [0.08, 0.2, 0.35, 0.5],
      },
    );

    for (const { el } of observed) observer.observe(el);

    const onChipClickTrack = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest<HTMLElement>("[data-pricing-chip-id]");
      const id = btn?.dataset.pricingChipId;
      if (id) lastSelected = id;
    };
    document.addEventListener("click", onChipClickTrack);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onChipClickTrack);
    };
  }, []);

  return (
    <section
      id="pricing-categories"
      className="pricing-categories"
      aria-labelledby="pricing-categories-heading"
      data-anchor-target
    >
      <header className="pricing-categories__header">
        <p className="pricing-page-eyebrow pricing-reveal pricing-reveal--heading">
          Solutions by business type
        </p>
        <h2
          id="pricing-categories-heading"
          className="pricing-categories__heading pricing-reveal pricing-reveal--heading font-display font-black uppercase tracking-tighter text-foreground"
        >
          {PRICING_CATEGORY_INTRO.heading}
        </h2>
        <p className="pricing-categories__body pricing-reveal pricing-reveal--subtitle">
          {PRICING_CATEGORY_INTRO.body}
        </p>
      </header>

      <div
        className="pricing-categories__chips"
        role="navigation"
        aria-label="Jump to a business type estimate"
      >
        {PRICING_CATEGORY_INTRO.chips.map((chip, index) => {
          const selected = chip.id === activeChipId;
          return (
            <button
              key={chip.id}
              type="button"
              id={`pricing-chip-${chip.id}`}
              aria-current={selected ? "true" : undefined}
              className={`pricing-categories__chip pricing-reveal pricing-reveal--chip${selected ? " pricing-categories__chip--active" : ""}`}
              style={{ animationDelay: `${0.04 + index * 0.03}s` }}
              data-pricing-chip-id={chip.id}
              onClick={() => selectChip(chip)}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <p className="pricing-categories__sector-note pricing-reveal pricing-reveal--subtitle">
        Estimate sheet below — not a gallery of case studies. Figures are generalisations; your
        quote is confirmed after discovery.
      </p>

      <div
        className="pricing-categories__table-wrap pricing-reveal pricing-reveal--card"
        role="region"
        aria-label="Sector pricing summary table"
      >
        <table className="pricing-categories__table">
          <caption className="pricing-categories__table-caption">
            Indicative setup, monthly and year-one estimates by business category
          </caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Setup (est.)</th>
              <th scope="col">Monthly (est.)</th>
              <th scope="col">Year-one guide (est.)</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_CATEGORIES.map((category) => (
              <tr key={category.id}>
                <th scope="row">{category.label}</th>
                <td>{category.setupEstimate}</td>
                <td>{category.monthlyEstimate}</td>
                <td>{category.yearOneGuide}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="pricing-categories__table-note">
          Year-one guide = setup plus twelve months at the mid-range monthly estimate, rounded for
          orientation. Not a fixed package or invoice.
        </p>
      </div>

      <div className="pricing-categories__breakdown" aria-label="Sector estimate breakdown">
        {PRICING_CATEGORIES.map((category, index) => (
          <section
            key={category.id}
            id={`pricing-category-${category.id}`}
            className={`pricing-category-row pricing-reveal pricing-reveal--card${activeChipId === category.id ? " pricing-category-row--active" : ""}`}
            style={{ animationDelay: `${0.04 + index * 0.03}s` }}
            aria-labelledby={`pricing-category-title-${category.id}`}
          >
            <div className="pricing-category-row__main">
              <h3
                id={`pricing-category-title-${category.id}`}
                className="pricing-category-row__title"
              >
                {category.label}
              </h3>
              <p className="pricing-category-row__summary">{category.summary}</p>

              <div className="pricing-category-row__solutions">
                <p className="pricing-category-row__solutions-label">What we typically build</p>
                <ul>
                  {category.solutions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pricing-category-row__figures">
              <dl className="pricing-category-row__costs">
                <div className="pricing-category-row__cost">
                  <dt>Once-off setup</dt>
                  <dd>
                    {category.setupEstimate}
                    <span className="pricing-category-row__est"> est.</span>
                  </dd>
                </div>
                <div className="pricing-category-row__cost">
                  <dt>Typical monthly</dt>
                  <dd>
                    {category.monthlyEstimate}
                    <span className="pricing-category-row__est"> est.</span>
                  </dd>
                </div>
                <div className="pricing-category-row__cost pricing-category-row__cost--total">
                  <dt>Year-one guide</dt>
                  <dd>
                    {category.yearOneGuide}
                    <span className="pricing-category-row__est"> est.</span>
                  </dd>
                </div>
              </dl>
              <p className="pricing-category-row__monthly-note">{category.monthlyNote}</p>
              <p className="pricing-category-row__footnote">
                Indicative only — may be lower or higher depending on scope and integrations.
              </p>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
