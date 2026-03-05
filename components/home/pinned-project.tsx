type PinnedProjectProps = {
  projects: {
    id: string;
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    htmlUrl: string;
  }[];
};

export default function PinnedProject({ projects }: PinnedProjectProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full mt-6 overflow-hidden">
      <div className="relative flex items-center justify-between mb-4">
        <h2 className="text-lg uppercase text-neutral-50"><span className="tracking-[0.02px] text-blue-500">{"//"}</span> Pinned Projects</h2>
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Featured</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/project border border-neutral-400/25 border-dashed p-4 block hover:border-neutral-300/70 hover:bg-neutral-400/5 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-neutral-50 tracking-tight">{project.name}</p>
              <i className="fa-light fa-arrow-up-right text-xs text-neutral-500 group-hover/project:text-neutral-200 group-hover/project:translate-x-0.5 group-hover/project:-translate-y-0.5 transition-all duration-200" />
            </div>

            <p className="text-xs text-neutral-400 mt-2.5 line-clamp-2">
              {project.description ?? "No description provided."}
            </p>

            <div className="flex items-center gap-3 mt-3.5 text-[9px] font-mono uppercase tracking-wider text-neutral-500">
              <span>{project.language ?? "N/A"}</span>
              <span>Stars {project.stars}</span>
              <span>Forks {project.forks}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
