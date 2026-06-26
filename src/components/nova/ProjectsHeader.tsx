export function ProjectsHeader() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <h2
        className="font-display font-black uppercase leading-[0.9] tracking-tighter text-foreground"
        style={{ fontSize: "clamp(3rem, 9vw, 9rem)" }}
      >
        Projects
      </h2>
      <p className="max-w-sm text-left text-xs tracking-[0.2em] text-foreground/70 sm:text-right sm:text-sm">
        WE CRAFT IMMERSIVE DIGITAL EXPERIENCES THAT PUSH THE BOUNDARIES OF WEB DESIGN &amp; MOTION.
      </p>
    </div>
  );
}
