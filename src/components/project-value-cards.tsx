import { PROJECT_SHOWCASES } from "@/components/project-showcases";

type ProjectValueCardsProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
};

const TAG_ACCENTS = ["cyan", "purple", "magenta"] as const;

/** Outcome-first case copy: the number (or honest ask) leads, before → intervention follows. */
function caseCopy(project: (typeof PROJECT_SHOWCASES)[number]) {
  const { outcome } = project;
  const outcomeLine =
    outcome.status === "pending" ? (
      <>Outcome: {outcome.value}.</>
    ) : (
      <>
        Outcome: {outcome.value}
        {outcome.status === "estimate" ? " (estimate)" : ""}.
      </>
    );

  return (
    <>
      <strong className="projects-value-card__outcome">{outcomeLine}</strong>{" "}
      <span className="projects-value-card__case">
        {project.before} Now: {project.intervention.charAt(0).toLowerCase() + project.intervention.slice(1)}
      </span>
    </>
  );
}

export function ProjectValueCards({ activeIndex, onSelect }: ProjectValueCardsProps) {
  return (
    <ul className="projects-value-cards" aria-label="Project highlights">
      {PROJECT_SHOWCASES.map((project, index) => (
        <li
          key={project.id}
          className={`projects-value-cards__item${index !== activeIndex ? " projects-value-cards__item--compact" : ""}`}
        >
          <button
            type="button"
            aria-label={`Show ${project.cardTitle} project`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => onSelect(index)}
            className={`projects-value-card touch-target projects-reveal projects-reveal--value-card projects-value-card--${TAG_ACCENTS[index % TAG_ACCENTS.length]} ${
              index === activeIndex ? "projects-value-card--active" : ""
            }`}
            style={{ animationDelay: `${0.04 + index * 0.04}s` }}
          >
            <span className="projects-value-card__tag">{project.valueTag}</span>
            <span className="projects-value-card__title">{project.cardTitle}</span>
            <p className="projects-value-card__desc">{caseCopy(project)}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
