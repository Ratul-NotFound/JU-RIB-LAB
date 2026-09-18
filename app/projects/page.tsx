import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore all research projects at the BGE Lab, Jahangirnagar University.",
};

async function getProjects(status?: string) {
  try {
    return await prisma.project.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: {
        members: { include: { profile: { select: { fullName: true, avatarUrl: true } } }, take: 3 },
      },
    });
  } catch {
    return [];
  }
}

const STATUS_COLORS: Record<string, string> = {
  ONGOING: "badge-success",
  COMPLETED: "badge-info",
  UPCOMING: "badge-warning",
  PAUSED: "badge-neutral",
};

export default async function ProjectsPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status;
  const projects = await getProjects(status);

  return (
    <>
      <div className="page-header">
        <div className="container page-header-content">
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>Our Work</div>
          <h1 className="text-h1">Research Projects</h1>
          <p>Discover the research initiatives shaping the future of biotechnology.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
            {[
              { label: "All", value: "" },
              { label: "Ongoing", value: "ONGOING" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Upcoming", value: "UPCOMING" },
            ].map((tab) => (
              <Link
                key={tab.value}
                href={tab.value ? `/projects?status=${tab.value}` : "/projects"}
                className={`btn btn-sm ${(!status && !tab.value) || status === tab.value ? "btn-primary" : "btn-ghost"}`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-20) 0", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🔭</div>
              <p>No projects found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid-3">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
                  <div className="project-card" style={{ height: "100%" }}>
                    <div className="project-card-img-placeholder">
                      {project.isFeatured ? "⭐" : "🧬"}
                    </div>
                    <div className="project-card-body">
                      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
                        <span className={`badge ${STATUS_COLORS[project.status] ?? "badge-neutral"}`}>
                          {project.status}
                        </span>
                        {project.isFeatured && <span className="badge badge-accent">Featured</span>}
                        {project.category && <span className="badge badge-neutral">{project.category}</span>}
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)" }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.5, flex: 1 }}>
                        {project.description.slice(0, 130)}…
                      </p>
                      {project.members.length > 0 && (
                        <div style={{ marginTop: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                          <div style={{ display: "flex" }}>
                            {project.members.map((m, i) => (
                              <div key={m.id} style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: "var(--color-accent-subtle)",
                                border: "2px solid var(--color-surface)",
                                marginLeft: i > 0 ? -8 : 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.65rem", fontWeight: 700, color: "var(--color-primary)",
                              }}>
                                {m.profile.fullName.charAt(0)}
                              </div>
                            ))}
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                            {project.members.length} member{project.members.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                      <div style={{ marginTop: "var(--space-4)", color: "var(--color-accent)", fontSize: "0.875rem", fontWeight: 600 }}>
                        View Project →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
