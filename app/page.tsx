import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getHomeData() {
  try {
    const [settings, featuredProjects, featuredPubs, stats] = await Promise.all([
      prisma.labSettings.findUnique({ where: { id: "singleton" } }),
      prisma.project.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { members: { include: { profile: true }, take: 2 } },
      }),
      prisma.publication.findMany({
        where: { isFeatured: true },
        orderBy: { year: "desc" },
        take: 3,
      }),
      Promise.all([
        prisma.project.count(),
        prisma.publication.count(),
        prisma.profile.count({ where: { isActive: true } }),
      ]),
    ]);
    return { settings, featuredProjects, featuredPubs, stats };
  } catch {
    return { settings: null, featuredProjects: [], featuredPubs: [], stats: [0, 0, 0] };
  }
}

const RESEARCH_DOMAINS = [
  {
    code: "01",
    title: "Microbial Biotechnology",
    desc: "Production of high-yield industrial enzymes, microbial secondary metabolites, and screening of bacterial strains for biocatalysis.",
  },
  {
    code: "02",
    title: "Bioprocess Engineering",
    desc: "Solid-state and submerged fermentation protocols, hydrodynamic bioreactor design, and downstream product separation.",
  },
  {
    code: "03",
    title: "Algae & Carbon Capture",
    desc: "Microalgal photobioreactor systems ('Liquid-Tree') designed for biological CO2 sequestration and urban air bioremediation.",
  },
  {
    code: "04",
    title: "Biomaterials & Waste Valorization",
    desc: "Bioconversion of agricultural byproducts and indigenous bioresources into biodegradable biopolymers and composite materials.",
  },
  {
    code: "05",
    title: "Structural Biology & Modeling",
    desc: "In silico protein modeling, molecular dynamics simulations, enzyme active-site optimization, and catalytic characterization.",
  },
  {
    code: "06",
    title: "Computational Omics",
    desc: "Metagenomic profiling of indigenous bioresources, metabolic flux modeling, and high-throughput data analysis pipelines.",
  },
];

export default async function HomePage() {
  const { settings, featuredProjects, featuredPubs, stats } = await getHomeData();
  const [projectCount, pubCount, memberCount] = stats;

  const labName = settings?.labName ?? "Bioresources Technology & Industrial Biotechnology Laboratory";
  const university = settings?.university ?? "Jahangirnagar University";
  const tagline = settings?.tagline ?? "Advancing bioresources utilization, bioprocess engineering, and sustainable industrial biotechnology.";

  return (
    <>
      {/* ── 1. ACADEMIC HERO HEADER ─────────────────── */}
      <header className="hero" style={{ minHeight: "75vh", display: "flex", alignItems: "center", position: "relative" }}>
        <div className="hero-bg-media">
          <img
            src="/images/hero-lab.jpg"
            alt="BTIB Laboratory Facility"
          />
        </div>
        <div className="hero-bg-overlay" style={{ background: "rgba(15, 23, 42, 0.94)" }} />

        <div className="container" style={{ position: "relative", zIndex: 2, padding: "clamp(3rem, 5vw, 4.5rem) 0" }}>
          <div style={{ maxWidth: 820 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              padding: "5px 12px",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#E2E8F0",
              marginBottom: "var(--space-4)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              <span style={{ width: 6, height: 6, background: "#34D399", display: "inline-block" }} />
              {university} · Dept. of Biotechnology &amp; Genetic Engineering
            </div>

            <h1 style={{
              color: "#FFFFFF",
              fontSize: "clamp(2rem, 3.8vw, 3.1rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              marginBottom: "var(--space-4)",
            }}>
              {labName}
            </h1>

            <p style={{
              color: "#CBD5E1",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              marginBottom: "var(--space-8)",
              maxWidth: 720,
            }}>
              {tagline}
            </p>

            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <Link href="/research" className="btn btn-primary btn-lg">
                Research Areas →
              </Link>
              <Link href="/projects" className="btn btn-lg" style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#FFFFFF",
              }}>
                Projects
              </Link>
              <Link href="/publications" className="btn btn-lg" style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#FFFFFF",
              }}>
                Publications
              </Link>
              <Link href="/members" className="btn btn-lg" style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#FFFFFF",
              }}>
                Team
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. SUMMARY METRICS ─────────────────────── */}
      <section style={{ background: "#FFFFFF", borderBottom: "1px solid var(--color-border)", padding: "var(--space-6) 0" }}>
        <div className="container">
          <div className="grid-3" style={{ gap: "var(--space-4)" }}>
            <div style={{ padding: "var(--space-4) var(--space-5)", borderLeft: "3px solid var(--color-primary)", background: "var(--color-bg)" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)", fontFamily: "var(--font-heading)", lineHeight: 1 }}>
                {projectCount || 3}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-secondary)", marginTop: 4 }}>
                Active Research Projects
              </div>
            </div>

            <div style={{ padding: "var(--space-4) var(--space-5)", borderLeft: "3px solid var(--color-primary)", background: "var(--color-bg)" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)", fontFamily: "var(--font-heading)", lineHeight: 1 }}>
                {pubCount || 3}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-secondary)", marginTop: 4 }}>
                Peer-Reviewed Publications
              </div>
            </div>

            <div style={{ padding: "var(--space-4) var(--space-5)", borderLeft: "3px solid var(--color-primary)", background: "var(--color-bg)" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)", fontFamily: "var(--font-heading)", lineHeight: 1 }}>
                {memberCount || 3}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-secondary)", marginTop: 4 }}>
                Faculty &amp; Researchers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. RESEARCH DOMAINS ─────────────────────── */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--space-8)" }}>
            <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
              Scientific Scope
            </div>
            <h2 className="section-title">
              Core Research Pillars
            </h2>
          </div>

          <div className="grid-3" style={{ gap: "var(--space-5)" }}>
            {RESEARCH_DOMAINS.map((domain) => (
              <div key={domain.title} style={{
                background: "#FFFFFF",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                padding: "var(--space-5)",
                display: "flex",
                flexDirection: "column",
              }}>
                <div style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-mono)",
                  marginBottom: "var(--space-2)",
                }}>
                  {domain.code}
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)", lineHeight: 1.3 }}>
                  {domain.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-2)", lineHeight: 1.6, flex: 1, margin: 0 }}>
                  {domain.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED PROJECTS ────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="section" style={{ background: "#FFFFFF", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div>
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
                  Active Work
                </div>
                <h2 className="section-title">
                  Featured Research Projects
                </h2>
              </div>
              <Link href="/projects" className="btn btn-outline btn-sm">
                View All Projects →
              </Link>
            </div>

            <div className="grid-3" style={{ gap: "var(--space-5)" }}>
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
                  <div className="project-card" style={{ height: "100%", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ height: 160, width: "100%", overflow: "hidden", background: "var(--color-surface-2)" }}>
                      <img
                        src={
                          project.thumbnailUrl ||
                          (project.slug.includes("algae") || project.slug.includes("liquid-tree")
                            ? "/images/liquid-tree.jpg"
                            : "/images/fermentation.jpg")
                        }
                        alt={project.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="project-card-body" style={{ padding: "var(--space-5)" }}>
                      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                        <span className={`badge badge-${project.status === "ONGOING" ? "success" : "info"}`}>
                          {project.status}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)", lineHeight: 1.35 }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: "0.825rem", color: "var(--color-text-muted)", lineHeight: 1.5, flex: 1, margin: 0 }}>
                        {project.description.slice(0, 110)}…
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. KEY PUBLICATIONS ─────────────────────── */}
      {featuredPubs.length > 0 && (
        <section className="section" style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-6)", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div>
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
                  Selected Output
                </div>
                <h2 className="section-title">
                  Key Publications
                </h2>
              </div>
              <Link href="/publications" className="btn btn-outline btn-sm">
                View All Publications →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {featuredPubs.map((pub) => (
                <div key={pub.id} style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "var(--space-4) var(--space-5)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)" }}>
                      {pub.journal || "Journal Paper"} · {pub.year}
                    </span>
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                        DOI: {pub.doi} ↗
                      </a>
                    )}
                  </div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-secondary)", margin: 0, lineHeight: 1.4 }}>
                    {pub.title}
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    {pub.authors}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. DIRECT CONTACT / COLLABORATION ───────── */}
      <section style={{ background: "#FFFFFF", padding: "var(--space-12) 0" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 640 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "var(--space-2)" }}>
            Academic Collaboration &amp; Inquiries
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-2)", marginBottom: "var(--space-6)", lineHeight: 1.6 }}>
            For research collaborations, graduate admissions, or analytical inquiries, contact our faculty and principal investigators.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary">
              Contact Us
            </Link>
            <Link href="/about" className="btn btn-outline">
              About Lab &amp; Facilities
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
