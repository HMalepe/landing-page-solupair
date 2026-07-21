import { ProjectsHeader } from "@/components/nova/ProjectsHeader";

export type ProjectItem = {
  name: string;
  tag: string;
  img: string;
  summary: string;
  href?: string;
  accent: "teal" | "violet" | "magenta";
};

export function ProjectsStaticGrid({ projects }: { projects: ProjectItem[] }) {
  return (
    <section id="work" className="relative z-[1] px-6 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <ProjectsHeader />
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.name} className="relative overflow-hidden rounded-2xl border border-white/10">
              <img src={p.img} alt={`${p.name} — ${p.tag}`} className="aspect-[4/3] w-full object-cover object-top" />
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/25 to-transparent p-6">
                <span className="self-start rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                  {p.tag}
                </span>
                <div>
                  <h3 className="font-display text-3xl font-black text-white">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{p.summary}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
