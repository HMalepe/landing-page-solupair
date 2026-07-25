import { BuildIllustration } from "@/components/build-illustrations";
import { BUILD_CATEGORIES, BUILD_CATEGORY_INTRO } from "@/lib/build-categories";

export function BuildCategoriesSection() {
  return (
    <section
      id="build-categories"
      className="build-categories"
      aria-labelledby="build-categories-heading"
      data-anchor-target
    >
      <header className="build-categories__header">
        <p className="build-page-eyebrow build-reveal build-reveal--heading">
          Solutions by business type
        </p>
        <h2
          id="build-categories-heading"
          className="build-categories__heading build-reveal build-reveal--heading font-display font-black uppercase tracking-tighter text-foreground"
        >
          {BUILD_CATEGORY_INTRO.heading}
        </h2>
        <p className="build-categories__body build-reveal build-reveal--subtitle">
          {BUILD_CATEGORY_INTRO.body}
        </p>
      </header>

      <div className="build-categories__grid">
        {BUILD_CATEGORIES.map((category, index) => (
          <article
            key={category.id}
            className="build-card build-reveal build-reveal--card"
            style={{ animationDelay: `${0.04 + index * 0.04}s` }}
          >
            <BuildIllustration id={category.id} />
            <h3 className="build-card__title">{category.label}</h3>
            <p className="build-card__summary">{category.summary}</p>
            <div className="build-card__solutions">
              <p className="build-card__solutions-label">What we typically build</p>
              <ul>
                {category.solutions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
