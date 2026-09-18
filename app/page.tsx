import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getHomeData() {
  try {
    const [settings, featuredProjects, featuredPubs, recentPosts, stats] = await Promise.all([
      prisma.labSettings.findUnique({ where: { id: "singleton" } }),
      prisma.project.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.publication.findMany({
        where: { isFeatured: true },
        orderBy: { year: "desc" },
        take: 3,
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 2,
        include: { author: { select: { name: true, image: true } } },
      }),
      Promise.all([
        prisma.project.count(),
        prisma.publication.count(),
        prisma.profile.count({ where: { isActive: true } }),
        prisma.activity.count(),
      ]),
    ]);
    return { settings, featuredProjects, featuredPubs, recentPosts, stats };
  } catch {
    return { settings: null, featuredProjects: [], featuredPubs: [], recentPosts: [], stats: [0, 0, 0, 0] };
  }
}

const RESEARCH_DOMAINS = [
  {
    code: "DOMAIN 01",
    title: "Microbial Biotechnology & Biocatalysis",
    desc: "Industrial enzyme production (amylases, proteases, cellulases), microbial secondary metabolites, and continuous enzymatic bioconversion matrices.",
    metric: "Enzyme Kinetics & Synthesis",
  },
  {
    code: "DOMAIN 02",
    title: "Bioprocess & Fermentation Engineering",
    desc: "Submerged, solid-state, and biofilm fermentation systems with column bioreactor hydrodynamic modeling for high-volumetric biocatalyst yields.",
    metric: "Pilot-Scale Bioreactors",
  },
  {
    code: "DOMAIN 03",
    title: "Algae Technology & Carbon Capture",
    desc: "Urban 'Liquid-Tree' microalgae photobioreactors, biological greenhouse gas CO2 sequestration, air purification, and lipid-rich feedstock synthesis.",
    metric: "Liquid-Tree Innovation",
  },
  {
    code: "DOMAIN 04",
    title: "Biomaterial Valorization & Bioplastics",
    desc: "Transformation of agro-industrial residues and bioresources into biodegradable biopolymer films, chitosan bio-composites, and platform biochemicals.",
    metric: "Circular Bioeconomy",
  },
  {
    code: "DOMAIN 05",
    title: "Structural Biology & Enzyme Engineering",
    desc: "Multi-enzyme co-immobilization systems, catalytic active-site modeling, thermal stability optimization, and downstream separation protocols.",
    metric: "Molecular Docking & MD",
  },
  {
    code: "DOMAIN 06",
    title: "Computational Omics & Metagenomics",
    desc: "Metagenomic profiling of indigenous bioresources, metabolic flux analysis, and integrative bioinformatics pipelines for strain engineering.",
    metric: "Multi-Omics Pipelines",
  },
];

export default async function HomePage() {
  const { settings, featuredProjects, featuredPubs, recentPosts, stats } = await getHomeData();
  const [projectCount, pubCount, memberCount, activityCount] = stats;

  const labName = settings?.labName ?? "Bioresources Technology and Industrial Biotechnology Laboratory";
  const university = settings?.university ?? "Jahangirnagar University";
  const tagline = settings?.tagline ?? "Advancing bioresources valorization, bioprocess engineering, and sustainable industrial biotechnology.";

  return (
    <>
      {/* ── 1. ACADEMIC INSTITUTIONAL HERO ────────────────── */}
      <section className="hero" id="hero" style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center" }}>
        <div className="hero-bg-media">
          <img
            src="/images/hero-lab.jpg"
            alt="Bioresources Technology and Industrial Biotechnology Laboratory Facility"
          />
        </div>
        <div className="hero-bg-overlay" style={{ background: "rgba(15, 23, 42, 0.92)" }} />

        <div className="container" style={{ position: "relative", zIndex: 2, padding: "clamp(3rem, 6vw, 5rem) 0" }}>
          <div className="split-2-col" style={{ alignItems: "center", gap: "var(--space-12)" }}>
            <div className="hero-content" style={{ maxWidth: 660, padding: 0 }}>
              {/* Institutional Eyebrow */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#E2E8F0",
                marginBottom: "var(--space-5)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                <span style={{ width: 6, height: 6, background: "#34D399", display: "inline-block" }} />
                {university} · Department of Biotechnology &amp; Genetic Engineering
              </div>

              {/* Headline */}
              <h1 style={{
                color: "#FFFFFF",
                fontSize: "clamp(2.15rem, 3.8vw, 3.25rem)",
                fontWeight: 800,
                lineHeight: 1.18,
                letterSpacing: "-0.02em",
                marginBottom: "var(--space-4)",
              }}>
                {labName}
              </h1>

              {/* Subheading */}
              <p style={{
                color: "#CBD5E1",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                marginBottom: "var(--space-8)",
                maxWidth: 600,
              }}>
                {tagline}
              </p>

              {/* Primary Actions */}
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
                <Link href="/research" className="btn btn-primary btn-lg" style={{ background: "var(--color-primary)", borderColor: "var(--color-primary)" }}>
                  Research Domains &amp; Scope →
                </Link>
                <Link href="/projects" className="btn btn-lg" style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: "#FFFFFF",
                }}>
                  Active Projects
                </Link>
                <Link href="/publications" className="btn btn-lg" style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: "#FFFFFF",
                }}>
                  Publications
                </Link>
              </div>

              {/* Quantitative Metrics Bar */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "var(--space-6)",
                marginTop: "var(--space-10)",
                paddingTop: "var(--space-6)",
                borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              }}>
                <div>
                  <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)", lineHeight: 1 }}>
                    {projectCount || 3}+
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginTop: 4 }}>
                    Funded Grants
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)", lineHeight: 1 }}>
                    {pubCount || 3}+
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginTop: 4 }}>
                    Peer-Reviewed Papers
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)", lineHeight: 1 }}>
                    {memberCount || 3}+
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginTop: 4 }}>
                    Faculty &amp; Fellows
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Academic Figure Dossier Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {/* Figure 1.0 */}
              <div style={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-4)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "center",
              }}>
                <div style={{
                  width: 96,
                  height: 96,
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid #334155",
                }}>
                  <img
                    src="/images/liquid-tree.jpg"
                    alt="Liquid-Tree Algae Photobioreactor"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", color: "#34D399", textTransform: "uppercase", marginBottom: 2, fontFamily: "var(--font-mono)" }}>
                    FIG 1.0 · Flagship Innovation
                  </div>
                  <h3 style={{ color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                    Liquid-Tree Photobioreactor
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: "0.8rem", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                    Urban microalgae photobioreactors for biological CO2 sequestration and air purification.
                  </p>
                </div>
              </div>

              {/* Figure 2.0 */}
              <div style={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-4)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "center",
              }}>
                <div style={{
                  width: 96,
                  height: 96,
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid #334155",
                }}>
                  <img
                    src="/images/fermentation.jpg"
                    alt="Industrial Bioprocess Fermentation"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", color: "#34D399", textTransform: "uppercase", marginBottom: 2, fontFamily: "var(--font-mono)" }}>
                    FIG 2.0 · Bioprocess Infrastructure
                  </div>
                  <h3 style={{ color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                    Solid-State Fermentation Suite
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: "0.8rem", margin: "4px 0 0 0", lineHeight: 1.45 }}>
                    Glass column bioreactors for valorizing agricultural residues into industrial biocatalysts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. INSTITUTIONAL METRICS LEDGER ──────────────── */}
      <section style={{ padding: "var(--space-8) 0", background: "#FFFFFF", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <div className="grid-4" style={{ gap: "var(--space-4)" }}>
            {[
              { n: `${projectCount || 3}`, label: "Active Research Grants", sub: "National & Institutional Grants" },
              { n: `${pubCount || 3}`, label: "Peer-Reviewed Publications", sub: "PLOS ONE, Industrial Biotech" },
              { n: `${memberCount || 3}`, label: "Supervisors & Investigators", sub: "Tokyo Tech & Shizuoka Alumni" },
              { n: `${activityCount || 3}`, label: "Seminars & Workshops", sub: "Academic Scientific Symposia" },
            ].map((stat) => (
              <div key={stat.label} style={{
                padding: "var(--space-5)",
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-primary)", fontFamily: "var(--font-heading)", lineHeight: 1 }}>
                  {stat.n}
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-secondary)", marginTop: "var(--space-2)" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 2 }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. CORE RESEARCH PILLARS MATRIX ──────────────── */}
      <section className="section bg-grid-pattern" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)" }}>
            <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
              Scientific Scope
            </div>
            <h2 className="section-title">
              Core Research Pillars
            </h2>
            <p className="section-subtitle">
              Six strategic research themes advancing bioresources valorization, bioprocess engineering, and sustainable biotechnology.
            </p>
          </div>

          <div className="grid-3" style={{ gap: "var(--space-6)" }}>
            {RESEARCH_DOMAINS.map((domain) => (
              <div key={domain.title} className="card-interactive" style={{
                background: "#FFFFFF",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "var(--space-3)",
                }}>
                  <span style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--color-primary)",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-mono)",
                  }}>
                    {domain.code}
                  </span>
                  <span style={{
                    fontSize: "0.7rem",
                    color: "var(--color-text-muted)",
                    background: "var(--color-surface-2)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 600,
                  }}>
                    {domain.metric}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-3)", lineHeight: 1.35 }}>
                  {domain.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-2)", lineHeight: 1.65, flex: 1, margin: 0 }}>
                  {domain.desc}
                </p>
                <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border-subtle)" }}>
                  <Link href="/research" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none" }}>
                    View Protocols &amp; Data →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
            <Link href="/research" className="btn btn-outline">
              Explore All Research Themes &amp; Protocols →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED RESEARCH PROJECTS ────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="section" style={{ background: "#FFFFFF", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-10)", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div>
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
                  Funded Initiatives
                </div>
                <h2 className="section-title">
                  Featured Research Projects
                </h2>
              </div>
              <Link href="/projects" className="btn btn-outline btn-sm">
                View All Projects
              </Link>
            </div>

            <div className="grid-3" style={{ gap: "var(--space-6)" }}>
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
                  <div className="project-card card-interactive" style={{ height: "100%" }}>
                    <img
                      src={
                        project.thumbnailUrl ||
                        (project.slug.includes("algae") || project.slug.includes("liquid-tree")
                          ? "/images/liquid-tree.jpg"
                          : "/images/fermentation.jpg")
                      }
                      alt={project.title}
                      className="project-card-img"
                    />
                    <div className="project-card-body">
                      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
                        <span className={`badge badge-${project.status === "ONGOING" ? "success" : project.status === "COMPLETED" ? "info" : "warning"}`}>
                          {project.status}
                        </span>
                        {project.category && <span className="badge badge-neutral">{project.category}</span>}
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)", lineHeight: 1.35 }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.55, flex: 1 }}>
                        {project.description.slice(0, 120)}…
                      </p>
                      <div style={{ marginTop: "var(--space-4)", color: "var(--color-primary)", fontSize: "0.85rem", fontWeight: 600 }}>
                        Project Dossier &amp; Data →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. FEATURED RECENT PUBLICATIONS ──────────────── */}
      {featuredPubs.length > 0 && (
        <section className="section" style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div>
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
                  Scientific Output
                </div>
                <h2 className="section-title">
                  Key Publications
                </h2>
              </div>
              <Link href="/publications" className="btn btn-outline btn-sm">
                View All Publications
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {featuredPubs.map((pub) => (
                <div key={pub.id} className="card-interactive" style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-5) var(--space-6)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <span className="badge badge-info">{pub.type}</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
                        {pub.journal || "Peer-Reviewed Journal"} · {pub.year}
                      </span>
                    </div>
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                        DOI: {pub.doi} ↗
                      </a>
                    )}
                  </div>
                  <h3 style={{ fontSize: "1.02rem", fontWeight: 700, color: "var(--color-secondary)", margin: 0, lineHeight: 1.4 }}>
                    {pub.title}
                  </h3>
                  <div style={{ fontSize: "0.825rem", color: "var(--color-text-muted)" }}>
                    {pub.authors}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. INSTITUTIONAL RIGOR & GRADUATE TRAINING ───── */}
      <section className="section bg-dark-grid-pattern" style={{ background: "var(--color-secondary)", color: "#FFFFFF" }}>
        <div className="container">
          <div className="split-2-col" style={{ alignItems: "center", gap: "var(--space-12)" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#34D399", marginBottom: "var(--space-2)", fontFamily: "var(--font-mono)" }}>
                Academic Rigor
              </div>
              <h2 style={{ color: "#FFFFFF", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, marginBottom: "var(--space-5)", lineHeight: 1.25 }}>
                Graduate Mentorship &amp; Advanced Infrastructure
              </h2>
              <p style={{ color: "#CBD5E1", lineHeight: 1.7, marginBottom: "var(--space-6)", fontSize: "1rem" }}>
                Our laboratory provides graduate students, postdocs, and visiting scholars with direct mentorship from internationally trained faculty and hands-on access to advanced bioprocess infrastructure.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {[
                  "Mentorship by Tokyo Tech & Shizuoka University D.Eng / D.Sc. Faculty",
                  "Direct Access to Pilot-Scale Biofermentation & Photobioreactor Units",
                  "High-Throughput Enzyme Purification & Kinetics Workstations",
                  "Competitive Ministry & University-Funded Graduate Fellowships",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}>
                    <div style={{ width: 6, height: 6, background: "#34D399", marginTop: 8, flexShrink: 0 }} />
                    <span style={{ color: "#E2E8F0", fontSize: "0.9rem" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "var(--space-8)" }}>
                <Link href="/contact" className="btn btn-primary btn-lg" style={{ background: "#059669", borderColor: "#059669" }}>
                  Inquire for Graduate Research Admission
                </Link>
              </div>
            </div>

            <div className="grid-2" style={{ gap: "var(--space-4)" }}>
              {[
                { title: "Pilot-Scale Bioreactors", desc: "Batch, fed-batch, and solid-state microbial fermentation systems." },
                { title: "High-Impact Publishing", desc: "Publications in PLOS ONE, Industrial Biotechnology, and ASM journals." },
                { title: "Global Collaborations", desc: "Partnerships with Japanese and European biotechnology centers." },
                { title: "National Research Grants", desc: "Funded by the Ministry of Science and Technology, Bangladesh." },
              ].map((item) => (
                <div key={item.title} style={{
                  background: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-5)",
                }}>
                  <div style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "0.95rem", marginBottom: "var(--space-1)" }}>
                    {item.title}
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: "0.8rem", lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. RECENT LAB ARTICLES & NEWS ─────────────────── */}
      {recentPosts.length > 0 && (
        <section className="section" style={{ background: "var(--color-bg)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-10)", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div>
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
                  Perspectives
                </div>
                <h2 className="section-title">
                  Scientific Notes &amp; News
                </h2>
              </div>
              <Link href="/blog" className="btn btn-outline btn-sm">
                View All Articles
              </Link>
            </div>

            <div className="grid-2" style={{ gap: "var(--space-6)" }}>
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div className="blog-card card-interactive" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{
                      padding: "var(--space-4) var(--space-6)",
                      background: "var(--color-surface-2)",
                      borderBottom: "1px solid var(--color-border)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-mono)",
                    }}>
                      RESEARCH SPOTLIGHT
                    </div>
                    <div className="blog-card-body" style={{ padding: "var(--space-6)", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div className="blog-card-meta" style={{ marginBottom: "var(--space-2)" }}>
                        <span>{post.author.name}</span>
                        <span>·</span>
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)", lineHeight: 1.4 }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.55, flex: 1 }}>
                          {post.excerpt.slice(0, 140)}…
                        </p>
                      )}
                      <div style={{ marginTop: "var(--space-4)", color: "var(--color-primary)", fontSize: "0.85rem", fontWeight: 600 }}>
                        Read Scientific Article →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. INSTITUTIONAL CALL TO ACTION ──────────────── */}
      <section style={{ background: "#FFFFFF", borderTop: "1px solid var(--color-border)", padding: "var(--space-16) 0" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 700 }}>
          <div className="section-eyebrow" style={{ justifyContent: "center" }}>
            Collaboration &amp; Inquiries
          </div>
          <h2 className="section-title" style={{ marginBottom: "var(--space-3)" }}>
            Partner With Our Research Group
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--color-text-2)", marginBottom: "var(--space-8)", lineHeight: 1.65 }}>
            We welcome academic collaborations, industrial R&amp;D partnerships, and ambitious graduate researchers in biotechnology and bioprocess engineering.
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Contact Principal Investigators
            </Link>
            <Link href="/about" className="btn btn-outline btn-lg">
              About Lab Infrastructure
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
