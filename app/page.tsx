import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

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

/* ── Tailored Academic Research Domain SVGs (Clean vector line-art, zero emojis) ── */
const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  "01": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Biocatalytic enzyme active site */}
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
    </svg>
  ),
  "02": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Fermentation vessel & bioreactor impeller */}
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3V1h6v2M12 3v13M8 12h8M9 16h6" />
    </svg>
  ),
  "03": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Microalgae photosynthesis & CO2 capture chamber */}
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8c-2 2-2 6 0 8M12 8c2 2 2 6 0 8M8 12c2-2 6-2 8 0" />
    </svg>
  ),
  "04": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Biopolymer chain & circular valorization */}
      <circle cx="7" cy="12" r="3" />
      <circle cx="17" cy="12" r="3" />
      <path d="M10 12h4M7 9a6 6 0 0 1 10 0M7 15a6 6 0 0 0 10 0" />
    </svg>
  ),
  "05": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Protein tertiary helix & molecular dynamics */}
      <path d="M4 6c4-4 8 4 12 0s4 4 4 4M4 12c4-4 8 4 12 0s4 4 4 4M4 18c4-4 8 4 12 0s4 4 4 4" />
    </svg>
  ),
  "06": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Multi-omics matrix & phylogenetic network */}
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <circle cx="12" cy="9" r="1.5" />
      <path d="m8 7 8 0M7 8l4 8M17 8l-4 8M12 10.5v5" />
    </svg>
  ),
};

const RESEARCH_DOMAINS = [
  {
    code: "01",
    title: "Microbial Biotechnology",
    subtitle: "Biocatalysis & Industrial Enzymes",
    desc: "Production of high-yield industrial enzymes, microbial secondary metabolites, and screening of bacterial strains for targeted biocatalysis.",
    tags: ["Industrial Enzymes", "Secondary Metabolites", "Biocatalysis"],
  },
  {
    code: "02",
    title: "Bioprocess Engineering",
    subtitle: "Fermentation & Bioreactor Systems",
    desc: "Solid-state and submerged fermentation protocols, hydrodynamic bioreactor design, and downstream product separation kinetics.",
    tags: ["Bioreactor Design", "Fermentation", "Downstream Processing"],
  },
  {
    code: "03",
    title: "Algae & Carbon Capture",
    subtitle: "Photobioreactors & Biofuels",
    desc: "Microalgal photobioreactor systems ('Liquid-Tree') designed for biological CO2 sequestration and urban atmospheric bioremediation.",
    tags: ["Liquid-Tree", "CO2 Sequestration", "Biofuels"],
  },
  {
    code: "04",
    title: "Biomaterials & Waste Valorization",
    subtitle: "Biopolymers & Circular Economy",
    desc: "Bioconversion of agricultural byproducts and indigenous bioresources into biodegradable biopolymers and sustainable composite materials.",
    tags: ["Bioplastics", "Agro-Waste", "Circular Economy"],
  },
  {
    code: "05",
    title: "Structural Biology & Modeling",
    subtitle: "Protein Engineering & MD Simulations",
    desc: "In silico protein modeling, molecular dynamics simulations, enzyme active-site optimization, and catalytic characterization.",
    tags: ["In Silico Modeling", "MD Simulations", "Enzyme Active-Site"],
  },
  {
    code: "06",
    title: "Computational Omics",
    subtitle: "Metagenomics & Metabolic Flux",
    desc: "Metagenomic profiling of indigenous bioresources, metabolic flux modeling, and high-throughput data analysis pipelines.",
    tags: ["Metagenomics", "Metabolic Flux", "Data Pipelines"],
  },
];

export default async function HomePage() {
  const { settings, featuredProjects, featuredPubs, stats } = await getHomeData();
  const [projectCount, pubCount, memberCount] = stats;

  const labName = settings?.labName ?? "Bioresources Technology & Industrial Biotechnology Laboratory";
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
          <div style={{ maxWidth: 860 }}>
            <div className="hero-eyebrow-badge hero-title-animated">
              <span className="hero-eyebrow-dot" />
              <span>Jahangirnagar University · Dept. of Biotechnology &amp; Genetic Engineering</span>
            </div>

            <h1 className="hero-title-animated" style={{
              color: "#FFFFFF",
              fontSize: "clamp(2.15rem, 4.4vw, 3.4rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.028em",
              marginBottom: "var(--space-4)",
            }}>
              {labName}
            </h1>

            <p className="hero-text-animated" style={{
              color: "#E2E8F0",
              fontSize: "clamp(1rem, 1.8vw, 1.125rem)",
              lineHeight: 1.7,
              marginBottom: "var(--space-8)",
              maxWidth: 720,
            }}>
              {tagline}
            </p>

            <div className="hero-actions hero-actions-animated">
              <Link href="/research" className="btn btn-primary btn-lg">
                Explore Research Areas →
              </Link>
              <Link href="/projects" className="btn btn-lg btn-hero-glass">
                Featured Projects
              </Link>
              <Link href="/publications" className="btn btn-lg btn-hero-glass">
                Publications
              </Link>
              <Link href="/members" className="btn btn-lg btn-hero-glass">
                Research Team
              </Link>
            </div>

            <div className="hero-trust-strip hero-actions-animated">
              <span className="hero-trust-item">
                <span className="hero-trust-pip" />
                Scopus &amp; Web of Science Indexed
              </span>
              <span className="hero-trust-item">
                <span className="hero-trust-pip" />
                Pilot Bioprocess Facility
              </span>
              <span className="hero-trust-item">
                <span className="hero-trust-pip" />
                Savar, Dhaka-1342 · Bangladesh
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. SUMMARY METRICS ─────────────────────── */}
      <section className="metrics-section">
        <div className="container">
          <div className="metrics-grid reveal-stagger">
            <div className="metric-card">
              <div className="metric-card-top">
                <AnimatedCounter value={projectCount || 3} />
                <span className="metric-icon-box" aria-hidden="true">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0" />
                    <path d="M5.52 16h12.96" />
                  </svg>
                </span>
              </div>
              <div className="metric-label">Active Research Projects</div>
              <div className="metric-sub">Applied &amp; industrial bioprocess initiatives</div>
            </div>

            <div className="metric-card">
              <div className="metric-card-top">
                <AnimatedCounter value={pubCount || 3} />
                <span className="metric-icon-box" aria-hidden="true">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M6 6h10M6 10h10M6 14h6" />
                  </svg>
                </span>
              </div>
              <div className="metric-label">Peer-Reviewed Publications</div>
              <div className="metric-sub">Indexed journals &amp; conference proceedings</div>
            </div>

            <div className="metric-card">
              <div className="metric-card-top">
                <AnimatedCounter value={memberCount || 3} />
                <span className="metric-icon-box" aria-hidden="true">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
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
          <div data-reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
            <div>
              <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
                Scientific Scope &amp; Domains
              </div>
              <h2 className="section-title">
                Core Research Pillars
              </h2>
            </div>
            <Link href="/research" className="btn btn-outline btn-sm">
              Explore All Pillars →
            </Link>
          </div>

          <div className="pillar-grid reveal-stagger">
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
                      {DOMAIN_ICONS[domain.code]}
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
                    <span className="pillar-action-arrow">→</span>
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
            <div data-reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div>
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
                  Applied &amp; Industrial R&amp;D
                </div>
                <h2 className="section-title">
                  Featured Research Projects
                </h2>
              </div>
              <Link href="/projects" className="btn btn-outline btn-sm">
                View All Projects →
              </Link>
            </div>

            <div className="grid-3 reveal-stagger" style={{ gap: "var(--space-6)" }}>
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
                  <div className="project-card" style={{ height: "100%", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
                    <div className="project-card-img-wrap" style={{ position: "relative" }}>
                      <img
                        src={
                          project.thumbnailUrl ||
                          (project.slug.includes("algae") || project.slug.includes("liquid-tree")
                            ? "/images/liquid-tree.jpg"
                            : project.slug.includes("bioplastics") || project.slug.includes("biodegradable")
                            ? "/images/bioplastics.jpg"
                            : "/images/fermentation.jpg")
                        }
                        alt={project.title}
                      />
                      <div style={{
                        position: "absolute",
                        top: "var(--space-3)",
                        right: "var(--space-3)",
                        background: "rgba(15, 23, 42, 0.82)",
                        backdropFilter: "blur(6px)",
                        color: "#FFFFFF",
                        border: "1px solid rgba(255, 255, 255, 0.22)",
                        padding: "3px 9px",
                        borderRadius: "var(--radius-xs)",
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}>
                        Featured
                      </div>
                    </div>
                    <div className="project-card-body" style={{ padding: "var(--space-5)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                        <span className={`badge badge-${project.status === "ONGOING" ? "success badge-live-pulse" : "info"}`}>
                          {project.status}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "var(--color-primary)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                          {project.category || "Biotechnology"}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.08rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)", lineHeight: 1.38, letterSpacing: "-0.01em" }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: "0.84rem", color: "var(--color-text-2)", lineHeight: 1.6, flex: 1, margin: "0 0 var(--space-4)" }}>
                        {project.description.slice(0, 115)}…
                      </p>
                      <div style={{ marginTop: "auto", paddingTop: "var(--space-3)", borderTop: "1px solid var(--color-border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 600 }}>
                        <span style={{ color: "var(--color-text-muted)", fontSize: "0.74rem", fontFamily: "var(--font-mono)" }}>BTIB · Jahangirnagar</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          View Details →
                        </span>
                      </div>
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
            <div data-reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-6)", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div>
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
                  Academic Dissemination
                </div>
                <h2 className="section-title">
                  Key Publications
                </h2>
              </div>
              <Link href="/publications" className="btn btn-outline btn-sm">
                View All Publications →
              </Link>
            </div>

            <div className="reveal-stagger" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {featuredPubs.map((pub) => (
                <div key={pub.id} className="pub-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--color-primary-subtle)", padding: "2px 8px", borderRadius: "var(--radius-xs)", border: "1px solid var(--color-primary-border)" }}>
                        Peer-Reviewed Journal
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                        {pub.year}
                      </span>
                    </div>
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pub-doi-btn"
                      >
                        DOI: {pub.doi} ↗
                      </a>
                    )}
                  </div>

                  <h3 style={{ fontSize: "1.06rem", fontWeight: 700, color: "var(--color-secondary)", margin: "2px 0", lineHeight: 1.42, letterSpacing: "-0.01em" }}>
                    {pub.title}
                  </h3>

                  <div style={{ fontSize: "0.835rem", color: "var(--color-text-2)", lineHeight: 1.55 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-muted)", fontWeight: 600 }}>Authors: </span>
                    {pub.authors}
                  </div>

                  {pub.journal && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.81rem", color: "var(--color-text-muted)", fontStyle: "italic", marginTop: 2, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, color: "var(--color-secondary)", fontStyle: "normal" }}>{pub.journal}</span>
                      <span style={{ color: "var(--color-border)" }}>·</span>
                      <span style={{ fontStyle: "normal", fontSize: "0.76rem", fontFamily: "var(--font-mono)", color: "var(--color-primary)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: 4, height: 4, background: "var(--color-primary)", borderRadius: "1px" }} />
                        Scopus &amp; Web of Science Indexed
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. DIRECT CONTACT / COLLABORATION ───────── */}
      <section style={{ background: "var(--color-bg)", padding: "clamp(var(--space-10), 6vw, var(--space-16)) 0", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container" data-reveal="scale" style={{ maxWidth: 840 }}>
          <div className="cta-card-interactive" style={{ textAlign: "center" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--color-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              background: "var(--color-primary-subtle)",
              padding: "3px 10px",
              borderRadius: "var(--radius-xs)",
              border: "1px solid var(--color-primary-border)",
              marginBottom: "var(--space-3)",
            }}>
              <span style={{ width: 5, height: 5, background: "var(--color-primary)", borderRadius: "1px" }} />
              Academic Year 2024–2025 · Open for Collaboration
            </div>

            <h2 style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.1rem)", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "var(--space-3)", letterSpacing: "-0.025em" }}>
              Collaborate with Our Research Laboratory
            </h2>

            <p style={{ fontSize: "0.95rem", color: "var(--color-text-2)", lineHeight: 1.68, maxWidth: 640, margin: "0 auto var(--space-6)" }}>
              We partner with industrial enterprises, international biotechnology institutions, and prospective graduate scholars on funded bioprocess initiatives and analytical workflows.
            </p>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-4)",
              flexWrap: "wrap",
              fontSize: "0.78rem",
              color: "var(--color-secondary)",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              marginBottom: "var(--space-8)",
              paddingBottom: "var(--space-6)",
              borderBottom: "1px solid var(--color-border-subtle)",
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--color-surface-2)", padding: "4px 10px", borderRadius: "var(--radius-xs)", border: "1px solid var(--color-border-subtle)" }}>
                <span style={{ width: 5, height: 5, background: "var(--color-primary)", borderRadius: "1px" }} />
                Industrial R&amp;D Contracts
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--color-surface-2)", padding: "4px 10px", borderRadius: "var(--radius-xs)", border: "1px solid var(--color-border-subtle)" }}>
                <span style={{ width: 5, height: 5, background: "var(--color-primary)", borderRadius: "1px" }} />
                Funded Postgraduate Research
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--color-surface-2)", padding: "4px 10px", borderRadius: "var(--radius-xs)", border: "1px solid var(--color-border-subtle)" }}>
                <span style={{ width: 5, height: 5, background: "var(--color-primary)", borderRadius: "1px" }} />
                Central Instrumentation Access
              </span>
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--space-5)" }}>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Initiate Research Inquiry →
              </Link>
              <Link href="/about" className="btn btn-outline btn-lg">
                About Lab &amp; Facilities
              </Link>
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
              BTIB Lab · Department of Biotechnology &amp; Genetic Engineering · Wazed Miah Science Research Centre · Jahangirnagar University
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

