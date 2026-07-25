import { BuildCategoriesSection } from "@/components/build-categories-section";
import { BuildIllustration } from "@/components/build-illustrations";
import { useSectionInView } from "@/hooks/use-section-in-view";
import { BUILD_TIERS } from "@/lib/build-tiers";

export function WhatWeBuildPageContent() {
  const { sectionRef, sectionInView } = useSectionInView();

  return (
    <div
      ref={sectionRef}
      className={`build-page-content relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-10 sm:pb-28 sm:pt-12 lg:px-14 lg:pb-32 lg:pt-14${sectionInView ? " build-in-view" : ""}`}
    >
      <header className="build-direction-header">
        <p className="build-page-eyebrow build-reveal build-reveal--heading">
          Websites · Dashboards · WhatsApp automation
        </p>
        <h1
          id="build-heading"
          className="build-direction-heading build-reveal build-reveal--heading font-display font-black uppercase tracking-tighter text-foreground"
        >
          What we build
        </h1>
        <p className="build-direction-subtitle build-reveal build-reveal--subtitle">
          A look at the kind of work we do for South African SME owners — by business type and by
          project shape. Every build starts with a conversation, not a price list.
        </p>
      </header>

      <BuildCategoriesSection />

      <header
        id="build-tiers"
        className="build-direction-header build-direction-header--tiers"
        data-anchor-target
      >
        <p className="build-page-eyebrow build-reveal build-reveal--heading">
          Build shapes · starting points
        </p>
        <h2 className="build-direction-heading build-reveal build-reveal--heading font-display font-black uppercase tracking-tighter text-foreground">
          Three shapes a build usually takes
        </h2>
        <p className="build-direction-subtitle build-reveal build-reveal--subtitle">
          Simple builds, clean dashboards and custom automation. These complement the sector
          examples above — use them to picture where your project might begin.
        </p>
      </header>

      <div className="build-direction-grid">
        {BUILD_TIERS.map((tier, index) => (
          <article
            key={tier.id}
            className={`build-tier-card build-reveal build-reveal--card${tier.featured ? " build-tier-card--featured" : ""}`}
            style={{ animationDelay: `${0.04 + index * 0.04}s` }}
          >
            <BuildIllustration id={tier.id} />
            <h3 className="build-tier-card__title">{tier.title}</h3>
            <p className="build-tier-card__desc">{tier.description}</p>

            <ul className="build-tier-card__includes">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <a
              href="/#contact"
              className={`build-tier-card__cta hero-btn touch-target ${tier.featured ? "hero-btn--primary" : "hero-btn--secondary"}`}
            >
              <span>{tier.cta}</span>
            </a>
          </article>
        ))}
      </div>

      <div className="build-page-cta build-reveal build-reveal--note">
        <p className="build-page-cta__text">
          Not sure which shape fits? Send a short message — we'll suggest the leanest path for your
          situation.
        </p>
        <a href="/#contact" className="hero-btn hero-btn--primary touch-target">
          <span>Book a call</span>
        </a>
      </div>
    </div>
  );
}
