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
    subtitle: "Biocatalysis & Enzymes",
    icon: "🔬",
    desc: "Production of high-yield industrial enzymes, microbial secondary metabolites, and screening of bacterial strains for biocatalysis.",
    tags: ["Industrial Enzymes", "Secondary Metabolites", "Biocatalysis"],
  },
  {
    code: "02",
    title: "Bioprocess Engineering",
    subtitle: "Fermentation & Bioreactors",
    icon: "⚗️",
    desc: "Solid-state and submerged fermentation protocols, hydrodynamic bioreactor design, and downstream product separation.",
    tags: ["Bioreactor Design", "Fermentation", "Downstream Processing"],
  },
  {
    code: "03",
    title: "Algae & Carbon Capture",
    subtitle: "Photobioreactors & CO2",
    icon: "🌿",
    desc: "Microalgal photobioreactor systems ('Liquid-Tree') designed for biological CO2 sequestration and urban air bioremediation.",
    tags: ["Liquid-Tree", "CO2 Sequestration", "Biofuels"],
  },
  {
    code: "04",
    title: "Biomaterials & Waste Valorization",
    subtitle: "Biopolymers & Circular Economy",
    icon: "♻️",
    desc: "Bioconversion of agricultural byproducts and indigenous bioresources into biodegradable biopolymers and composite materials.",
    tags: ["Bioplastics", "Agro-Waste", "Circular Economy"],
  },
  {
    code: "05",
    title: "Structural Biology & Modeling",
    subtitle: "Protein Engineering & MD",
    icon: "🧬",
    desc: "In silico protein modeling, molecular dynamics simulations, enzyme active-site optimization, and catalytic characterization.",
    tags: ["In Silico Modeling", "MD Simulations", "Enzyme Active-Site"],
  },
  {
    code: "06",
    title: "Computational Omics",
    subtitle: "Metagenomics & Flux Analysis",
    icon: "📊",
    desc: "Metagenomic profiling of indigenous bioresources, metabolic flux modeling, and high-throughput data analysis pipelines.",
    tags: ["Metagenomics", "Metabolic Flux", "Data Pipelines"],
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
      <header className="hero">
        <div className="hero-bg-media">
          <img
            src="/images/hero-lab.jpg"
            alt="BTIB Laboratory Facility"
          />
        </div>
        <div className="hero-bg-overlay" />

        <div className="container hero-content">
          <div style={{ maxWidth: 820 }}>
            <h1 style={{
              color: "#FFFFFF",
              fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              marginBottom: "var(--space-4)",
            }}>
              {labName}
            </h1>

            <p style={{
              color: "#CBD5E1",
              fontSize: "clamp(0.925rem, 2vw, 1.05rem)",
              lineHeight: 1.7,
              marginBottom: "var(--space-8)",
              maxWidth: 720,
            }}>
              {tagline}
            </p>

            <div className="hero-actions">
              <Link href="/research" className="btn btn-primary btn-lg">
                Research Areas →
              </Link>
              <Link href="/projects" className="btn btn-lg btn-hero-glass">
                Projects
              </Link>
              <Link href="/publications" className="btn btn-lg btn-hero-glass">
                Publications
              </Link>
              <Link href="/members" className="btn btn-lg btn-hero-glass">
                Team
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. SUMMARY METRICS ─────────────────────── */}
      <section className="metrics-section">
        <div className="container">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-card-top">
                <span className="metric-number">{projectCount || 3}</span>
                <span className="metric-icon-box" aria-hidden="true">🔬</span>
              </div>
              <div className="metric-label">Active Research Projects</div>
              <div className="metric-sub">Applied &amp; industrial bioprocess initiatives</div>
            </div>

            <div className="metric-card">
              <div className="metric-card-top">
                <span className="metric-number">{pubCount || 3}</span>
                <span className="metric-icon-box" aria-hidden="true">📚</span>
              </div>
              <div className="metric-label">Peer-Reviewed Publications</div>
              <div className="metric-sub">High-impact journals &amp; conference papers</div>
            </div>

            <div className="metric-card">
              <div className="metric-card-top">
                <span className="metric-number">{memberCount || 3}</span>
                <span className="metric-icon-box" aria-hidden="true">👥</span>
              </div>
              <div className="metric-label">Faculty &amp; Researchers</div>
              <div className="metric-sub">Principal investigators &amp; research scholars</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. RESEARCH DOMAINS ─────────────────────── */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
            <div>
              <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
                Scientific Scope
              </div>
              <h2 className="section-title">
                Core Research Pillars
              </h2>
            </div>
            <Link href="/research" className="btn btn-outline btn-sm">
              Explore All Pillars →
            </Link>
          </div>

          <div className="pillar-grid">
            {RESEARCH_DOMAINS.map((domain) => (
              <Link
                key={domain.title}
                href="/research"
                className="pillar-card"
              >
                <div>
                  <div className="pillar-card-header">
                    <span className="pillar-code-badge">
                      PILLAR {domain.code}
                    </span>
                    <span className="pillar-icon-box" aria-hidden="true">
                      {domain.icon}
                    </span>
                  </div>

                  <h3 className="pillar-title">
                    {domain.title}
                  </h3>

                  <div className="pillar-subtitle">
                    {domain.subtitle}
                  </div>

                  <p className="pillar-desc">
                    {domain.desc}
                  </p>
                </div>

                <div>
                  <div className="pillar-tags">
                    {domain.tags.map((tag) => (
                      <span key={tag} className="pillar-tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pillar-action">
                    <span>Learn More</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
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
      <section style={{ background: "#FFFFFF", padding: "clamp(var(--space-8), 5vw, var(--space-12)) 0" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 640 }}>
          <h2 style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.5rem)", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "var(--space-2)" }}>
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
