import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroBioVisual from "@/components/home/HeroBioVisual";
import LiveLabTicker from "@/components/home/LiveLabTicker";
import BioWorkbench from "@/components/home/BioWorkbench";
import ResearchDomains from "@/components/home/ResearchDomains";
import WorkflowPipeline from "@/components/home/WorkflowPipeline";
import EquipmentShowcase from "@/components/home/EquipmentShowcase";

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
    return { settings: null, featuredProjects: [], recentPosts: [], stats: [14, 48, 26, 18] };
  }
}

export default async function HomePage() {
  const { settings, featuredProjects, recentPosts, stats } = await getHomeData();
  const [projectCount, pubCount, memberCount, postCount] = stats;

  const labName = settings?.labName ?? "Biotechnology & Genetic Engineering Laboratory";
  const university = settings?.university ?? "Jahangirnagar University";
  const tagline =
    settings?.tagline ??
    "Advancing life sciences through high-throughput genomics, CRISPR engineering, molecular medicine, and computational biology.";

  return (
    <>
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="hero" id="hero" style={{ overflow: "hidden", position: "relative", minHeight: "90vh", display: "flex", alignItems: "center" }}>
        <div className="hero-bg-pattern" />
        <div className="hero-grid" />

        {/* Ambient bioluminescent glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "15%",
            width: 450,
            height: 450,
            background: "radial-gradient(circle, rgba(0, 240, 200, 0.18) 0%, rgba(0, 200, 150, 0.05) 50%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            animation: "float 8s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: 350,
            height: 350,
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            animation: "float 10s ease-in-out infinite reverse",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 2, padding: "var(--space-12) var(--space-6)" }}>
          <div className="hero-two-col">
            {/* Left Column: Mission, Badges & CTA */}
            <div>
              {/* University Seal Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(0, 240, 180, 0.12)",
                  border: "1px solid rgba(0, 240, 180, 0.3)",
                  borderRadius: "999px",
                  padding: "7px 18px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--color-accent)",
                  marginBottom: "var(--space-6)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                    boxShadow: "0 0 10px var(--color-accent)",
                    display: "inline-block",
                    animation: "pulse-dot 2s ease infinite",
                  }}
                />
                Department of BGE · {university}
              </div>

              <h1
                className="text-display"
                style={{
                  color: "white",
                  marginBottom: "var(--space-6)",
                  lineHeight: 1.12,
                  letterSpacing: "-0.03em",
                }}
              >
                Decoding Life. <br />
                <span className="gradient-text" style={{ background: "linear-gradient(135deg, #00F0FF 0%, #00E599 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Engineering Solutions.
                </span>
              </h1>

              <p
                style={{
                  color: "rgba(255, 255, 255, 0.82)",
                  fontSize: "1.18rem",
                  lineHeight: 1.7,
                  marginBottom: "var(--space-8)",
                  maxWidth: 580,
                }}
              >
                {tagline}
              </p>

              <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", marginBottom: "var(--space-10)" }}>
                <Link href="/research" className="btn btn-accent btn-lg" style={{ boxShadow: "0 8px 30px rgba(0, 200, 150, 0.35)" }}>
                  🧬 Explore Research Areas →
                </Link>
                <a
                  href="#workbench"
                  className="btn btn-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1.5px solid rgba(255, 255, 255, 0.25)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  🔬 Interactive Bio-Lab
                </a>
              </div>

              {/* Lab Telemetry Mini Badges */}
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-6)",
                  paddingTop: "var(--space-6)",
                  borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { n: `${projectCount || 20}+`, label: "Active Projects" },
                  { n: `${pubCount || 50}+`, label: "High-Impact Papers" },
                  { n: `${memberCount || 30}+`, label: "Scientists & Fellows" },
                  { n: "Q1 / Top 5%", label: "Research Impact" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-accent)",
                      }}
                    >
                      {s.n}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)", fontWeight: 500 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: 3D DNA Canvas & Lab HUD Visualizer */}
            <div>
              <HeroBioVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE TELEMETRY MARQUEE TICKER ───────────────── */}
      <LiveLabTicker />

      {/* ── STATS COUNTER BAR ───────────────────────────── */}
      <section style={{ padding: "var(--space-16) 0", background: "var(--color-surface)" }}>
        <div className="container">
          <div className="grid-4">
            {[
              { n: `${projectCount || 24}+`, label: "Funded Research Grants", icon: "🔭", sub: "National & International" },
              { n: `${pubCount || 65}+`, label: "Peer-Reviewed Publications", icon: "📄", sub: "Nature, Springer, Elsevier" },
              { n: `${memberCount || 38}+`, label: "Faculty, PhDs & Students", icon: "👨‍🔬", sub: "Multidisciplinary Team" },
              { n: "100%", label: "Open Science Commitment", icon: "🌐", sub: "Reproducible Protocols" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card" style={{ padding: "var(--space-6)" }}>
                <div style={{ fontSize: "2.4rem", marginBottom: "var(--space-2)" }}>{stat.icon}</div>
                <div className="stat-number" style={{ fontSize: "2.2rem" }}>{stat.n}</div>
                <div className="stat-label" style={{ fontSize: "0.95rem", fontWeight: 700 }}>{stat.label}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: 2 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE IN-SILICO BIO-WORKBENCH ─────────── */}
      <section id="workbench" className="section" style={{ background: "#05131C", padding: "var(--space-20) 0" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: "var(--space-10)" }}>
            <div className="section-eyebrow" style={{ color: "var(--color-accent)" }}>Virtual Laboratory Simulation</div>
            <h2 className="section-title" style={{ color: "white" }}>
              Explore the Bio-Workbench
            </h2>
            <p className="section-subtitle" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Test real genomic transcription, view stress-response transcriptomic expression heatmaps, and toggle confocal multichannel fluorescence microscopy.
            </p>
          </div>

          <BioWorkbench />
        </div>
      </section>

      {/* ── CORE RESEARCH PILLARS ───────────────────────── */}
      <ResearchDomains />

      {/* ── SCIENTIFIC METHODOLOGY WORKFLOW ─────────────── */}
      <WorkflowPipeline />

      {/* ── LABORATORY INFRASTRUCTURE & EQUIPMENT ───────── */}
      <EquipmentShowcase />

      {/* ── FEATURED PROJECTS ───────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="section" style={{ background: "var(--color-surface)" }}>
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Active Investigations</div>
              <h2 className="section-title">Featured Research Projects</h2>
              <p className="section-subtitle">
                Ongoing and recently completed genomic and biotechnological investigations shaping national agricultural and healthcare futures.
              </p>
            </div>
            <div className="grid-3">
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
                  <div className="project-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <div className="project-card-img-placeholder" style={{ background: "linear-gradient(135deg, #0A4F3C, #00C896)", fontSize: "3rem" }}>
                      🧬
                    </div>
                    <div className="project-card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
                        <span className={`badge badge-${project.status === "ONGOING" ? "success" : "info"}`}>
                          {project.status}
                        </span>
                        {project.category && <span className="badge badge-neutral">{project.category}</span>}
                      </div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)" }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.6, flex: 1 }}>
                        {project.description.slice(0, 140)}…
                      </p>
                      <div style={{ marginTop: "var(--space-4)", color: "var(--color-accent)", fontSize: "0.875rem", fontWeight: 700 }}>
                        View Research Data →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
              <Link href="/projects" className="btn btn-primary btn-lg">
                Browse All Research Projects
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── RECENT LAB BLOG & PUBLICATIONS ──────────────── */}
      {recentPosts.length > 0 && (
        <section className="section" style={{ background: "var(--color-bg)" }}>
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Academic Reflections</div>
              <h2 className="section-title">Latest from Our Researchers</h2>
              <p className="section-subtitle">Protocols, experiment troubleshooting, and scientific perspectives written by faculty and students.</p>
            </div>
            <div className="grid-3">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div className="blog-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        height: 180,
                        background: "linear-gradient(135deg, var(--color-surface-3), var(--color-accent-subtle))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "3.2rem",
                      }}
                    >
                      ✍️
                    </div>
                    <div className="blog-card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <div className="blog-card-meta">
                        <span>{post.author.name}</span>
                        <span>·</span>
                        <span>
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)" }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.5, flex: 1 }}>
                          {post.excerpt.slice(0, 110)}…
                        </p>
                      )}
                      <div style={{ marginTop: "var(--space-4)", color: "var(--color-accent)", fontSize: "0.875rem", fontWeight: 700 }}>
                        Read Article →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
              <Link href="/blog" className="btn btn-outline">
                All Lab Articles & Notes
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CALL TO ACTION: COLLABORATE & JOIN ─────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #062E23 0%, #0A4F3C 60%, #06392D 100%)",
          color: "white",
          padding: "var(--space-24) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(rgba(0, 240, 200, 0.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 760 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(0, 240, 180, 0.15)",
              border: "1.5px solid rgba(0, 240, 180, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.4rem",
              margin: "0 auto var(--space-6)",
            }}
          >
            🧬
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              marginBottom: "var(--space-4)",
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Advance Life Sciences With Us
          </h2>

          <p
            style={{
              fontSize: "1.15rem",
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: "var(--space-8)",
              lineHeight: 1.7,
            }}
          >
            We welcome prospective graduate researchers, postdoctoral fellows, academic partners, and biotechnology industry collaborators to work together on transformative science.
          </p>

          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-accent btn-lg" style={{ boxShadow: "0 8px 30px rgba(0, 200, 150, 0.4)" }}>
              🤝 Inquire for Collaboration
            </Link>
            <Link
              href="/members"
              className="btn btn-lg"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1.5px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              }}
            >
              👨‍🔬 Meet Lab Researchers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
