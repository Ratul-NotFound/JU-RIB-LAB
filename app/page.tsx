import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getHomeData() {
  try {
    const [settings, featuredProjects, recentPosts, stats] = await Promise.all([
      prisma.labSettings.findUnique({ where: { id: "singleton" } }),
      prisma.project.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: { author: { select: { name: true, image: true } } },
      }),
      Promise.all([
        prisma.project.count(),
        prisma.publication.count(),
        prisma.profile.count({ where: { isActive: true } }),
        prisma.post.count({ where: { status: "PUBLISHED" } }),
      ]),
    ]);
    return { settings, featuredProjects, recentPosts, stats };
  } catch {
    return { settings: null, featuredProjects: [], recentPosts: [], stats: [0, 0, 0, 0] };
  }
}

const RESEARCH_DOMAINS = [
  {
    code: "DOMAIN 01",
    title: "Microbial Biotechnology",
    desc: "Industrial enzyme production (amylases, proteases, cellulases), microbial secondary metabolites, and high-yield bacterial biocatalysis platforms.",
  },
  {
    code: "DOMAIN 02",
    title: "Bioprocess Engineering",
    desc: "Submerged and solid-state biofermentation, bioreactor hydrodynamic modeling, scale-up kinetics, and downstream separation protocols.",
  },
  {
    code: "DOMAIN 03",
    title: "Algae Biotechnology & Carbon Capture",
    desc: "Urban 'Liquid-Tree' microalgae photobioreactors, biological CO2 sequestration, wastewater phytoremediation, and lipid synthesis.",
  },
  {
    code: "DOMAIN 04",
    title: "Biomaterials & Waste Valorization",
    desc: "Conversion of agricultural byproducts and biomass residues into biodegradable bioplastics, bio-composites, and platform biochemicals.",
  },
  {
    code: "DOMAIN 05",
    title: "Protein Structure & Enzyme Engineering",
    desc: "In silico protein modeling, molecular dynamics simulations, catalytic active-site optimization, and enzyme immobilization.",
  },
  {
    code: "DOMAIN 06",
    title: "Computational Biology & Omics",
    desc: "Metagenomic profiling of indigenous bioresources, metabolic flux analysis, and integrative multi-omics bioinformatics pipelines.",
  },
];

export default async function HomePage() {
  const { settings, featuredProjects, recentPosts, stats } = await getHomeData();
  const [projectCount, pubCount, memberCount, postCount] = stats;

  const labName = settings?.labName ?? "Bioresources Technology and Industrial Biotechnology Laboratory";
  const university = settings?.university ?? "Jahangirnagar University";
  const tagline = settings?.tagline ?? "Advancing bioresources utilization, bioprocess engineering, and sustainable industrial biotechnology.";

  return (
    <>
      {/* ── 1. ACADEMIC INSTITUTIONAL HERO ────────────────── */}
      <section className="hero" id="hero">
        <div className="hero-bg-media">
          <img
            src="/images/hero-lab.jpg"
            alt="Bioresources Technology and Industrial Biotechnology Laboratory Facility"
          />
        </div>
        <div className="hero-bg-overlay" />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="split-2-col" style={{ alignItems: "center", gap: "var(--space-12)" }}>
            <div className="hero-content" style={{ maxWidth: 680, padding: "var(--space-16) 0" }}>
              {/* Institutional Eyebrow */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#E2E8F0",
                marginBottom: "var(--space-5)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                <span style={{ width: 6, height: 6, background: "var(--color-accent-light)", display: "inline-block" }} />
                {university} · Dept. of Biotechnology &amp; Genetic Engineering
              </div>

              {/* Headline */}
              <h1 style={{
                color: "#FFFFFF",
                fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "var(--space-5)",
              }}>
                {labName}
              </h1>

              {/* Subheading */}
              <p style={{
                color: "#CBD5E1",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                marginBottom: "var(--space-8)",
                maxWidth: 620,
              }}>
                {tagline}
              </p>

              {/* Primary Actions */}
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
                <Link href="/research" className="btn btn-primary btn-lg">
                  Explore Research Domains →
                </Link>
                <Link href="/members" className="btn btn-lg" style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#FFFFFF",
                }}>
                  Faculty &amp; Researchers
                </Link>
                <Link href="/projects" className="btn btn-lg" style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#FFFFFF",
                }}>
                  Active Projects
                </Link>
              </div>

              {/* Ledger Summary */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "var(--space-6)",
                marginTop: "var(--space-10)",
                paddingTop: "var(--space-6)",
                borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              }}>
                <div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
                    {projectCount || 20}+
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                    Funded Grants &amp; Projects
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
                    {pubCount || 50}+
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                    Peer-Reviewed Papers
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
                    {memberCount || 30}+
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                    Faculty, PIs &amp; Fellows
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Academic Figure Panels */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {/* Figure 1.0 */}
              <div style={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "center",
              }}>
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: "var(--radius-md)",
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
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", color: "#34D399", textTransform: "uppercase", marginBottom: 2 }}>
                    FIG 1.0 · Flagship Innovation
                  </div>
                  <h3 style={{ color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>
                    Liquid-Tree Photobioreactor
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: "0.8rem", margin: "4px 0 0 0", lineHeight: 1.4 }}>
                    Urban microalgal biological carbon capture &amp; atmospheric CO2 mitigation.
                  </p>
                </div>
              </div>

              {/* Figure 2.0 */}
              <div style={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "center",
              }}>
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: "var(--radius-md)",
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
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", color: "#34D399", textTransform: "uppercase", marginBottom: 2 }}>
                    FIG 2.0 · Core Infrastructure
                  </div>
                  <h3 style={{ color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>
                    Enzyme &amp; Fermentation Suite
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: "0.8rem", margin: "4px 0 0 0", lineHeight: 1.4 }}>
                    Automated biofermentation units for industrial biocatalyst production.
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
              { n: `${projectCount || 20}+`, label: "Funded Research Grants", sub: "National & Global Grants" },
              { n: `${pubCount || 50}+`, label: "Peer-Reviewed Publications", sub: "PLOS ONE, Springer, Nature" },
              { n: `${memberCount || 30}+`, label: "Faculty, PIs & Fellows", sub: "Tokyo Tech & Shizuoka Alumni" },
              { n: "6", label: "Core Lab Facilities", sub: "Bioprocess & Genomics Suites" },
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

      {/* ── 3. CORE RESEARCH DOMAINS (ACADEMIC MATRIX) ───── */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-primary)" }}>
              Scientific Scope
            </div>
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 800, color: "var(--color-secondary)", marginTop: "var(--space-1)" }}>
              Core Research Pillars
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", maxWidth: 640, marginTop: "var(--space-2)" }}>
              Six specialized research domains addressing biological resource utilization, bioengineering, and industrial sustainability.
            </p>
          </div>

          <div className="grid-3" style={{ gap: "var(--space-6)" }}>
            {RESEARCH_DOMAINS.map((domain) => (
              <div key={domain.title} style={{
                background: "#FFFFFF",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
              }}>
                <div style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "var(--color-primary)",
                  textTransform: "uppercase",
                  marginBottom: "var(--space-3)",
                }}>
                  {domain.code}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-3)", lineHeight: 1.3 }}>
                  {domain.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-2)", lineHeight: 1.65, flex: 1, margin: 0 }}>
                  {domain.desc}
                </p>
                <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border-subtle)" }}>
                  <Link href="/research" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none" }}>
                    View Domain Details →
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
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-primary)" }}>
                  Funded Initiatives
                </div>
                <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 800, color: "var(--color-secondary)", marginTop: "var(--space-1)" }}>
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
                  <div className="project-card" style={{ height: "100%" }}>
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

      {/* ── 5. INSTITUTIONAL ADVANTAGES / WHY BTIB LAB ───── */}
      <section className="section" style={{ background: "var(--color-secondary)", color: "#FFFFFF" }}>
        <div className="container">
          <div className="split-2-col" style={{ alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#34D399", marginBottom: "var(--space-2)" }}>
                Academic Excellence
              </div>
              <h2 style={{ color: "#FFFFFF", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, marginBottom: "var(--space-5)" }}>
                Graduate Training &amp; Research Rigor
              </h2>
              <p style={{ color: "#CBD5E1", lineHeight: 1.7, marginBottom: "var(--space-6)", fontSize: "1rem" }}>
                Our laboratory provides graduate students, postdocs, and visiting scholars with direct mentorship from globally trained faculty and hands-on access to advanced bioprocess infrastructure.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {[
                  "Supervision by Tokyo Tech & Shizuoka University D.Eng / D.Sc. Faculty",
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
                  Inquire for Graduate Admission
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

      {/* ── 6. RECENT LAB ARTICLES & NEWS ─────────────────── */}
      {recentPosts.length > 0 && (
        <section className="section" style={{ background: "var(--color-bg)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-10)", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-primary)" }}>
                  Perspectives
                </div>
                <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 800, color: "var(--color-secondary)", marginTop: "var(--space-1)" }}>
                  Recent Scientific Notes &amp; News
                </h2>
              </div>
              <Link href="/blog" className="btn btn-outline btn-sm">
                View All Articles
              </Link>
            </div>

            <div className="grid-3" style={{ gap: "var(--space-6)" }}>
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div className="blog-card" style={{ height: "100%" }}>
                    <div style={{
                      height: 160,
                      background: "var(--color-surface-2)",
                      borderBottom: "1px solid var(--color-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-text-muted)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}>
                      📄 Research Perspective
                    </div>
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span>{post.author.name}</span>
                        <span>·</span>
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)", lineHeight: 1.35 }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5, flex: 1 }}>
                          {post.excerpt.slice(0, 95)}…
                        </p>
                      )}
                      <div style={{ marginTop: "var(--space-4)", color: "var(--color-primary)", fontSize: "0.85rem", fontWeight: 600 }}>
                        Read Article →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 7. INSTITUTIONAL CALL TO ACTION ──────────────── */}
      <section style={{ background: "#FFFFFF", borderTop: "1px solid var(--color-border)", padding: "var(--space-16) 0" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 680 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-primary)", marginBottom: "var(--space-2)" }}>
            Collaboration &amp; Inquiries
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 800, marginBottom: "var(--space-3)", color: "var(--color-secondary)" }}>
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
