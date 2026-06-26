import { ProjectsHeader } from "@/components/nova/ProjectsHeader";

export type ProjectItem = {
  name: string;
  tag: string;
  img: string;
};

export function ProjectsStaticGrid({ projects }: { projects: ProjectItem[] }) {
  return (
    <section id="work" className="relative z-[1] px-6 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <ProjectsHeader />
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <article key={p.name} className="relative overflow-hidden rounded-2xl border border-white/10">
              <img src={p.img} alt={`${p.name} — ${p.tag}`} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 to-transparent p-6">
                <span className="self-end rounded-full bg-black/40 px-3 py-1 text-xs uppercase tracking-wider text-white/90">
                  {p.tag}
                </span>
                <h3 className="font-display text-4xl font-black text-white">{p.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
