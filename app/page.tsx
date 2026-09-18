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
  { icon: "🧬", title: "Genomics & Sequencing", desc: "Next-generation sequencing, genome assembly, and structural biology." },
  { icon: "🔬", title: "Molecular Biology", desc: "Gene expression mechanisms, CRISPR editing, and cellular pathways." },
  { icon: "🌱", title: "Agri-Biotechnology", desc: "Climate-resilient crop genetics and sustainable agricultural solutions." },
  { icon: "💊", title: "Biopharmaceuticals", desc: "Therapeutic proteins, diagnostic markers, and vaccine development." },
  { icon: "🦠", title: "Microbial Biotech", desc: "Industrial fermentation, antimicrobial discovery, and bio-remediation." },
  { icon: "💻", title: "Bioinformatics", desc: "Computational genomics, predictive modeling, and biological data pipelines." },
];

export default async function HomePage() {
  const { settings, featuredProjects, recentPosts, stats } = await getHomeData();
  const [projectCount, pubCount, memberCount, postCount] = stats;

  const labName = settings?.labName ?? "Biotechnology & Genetic Engineering Lab";
  const university = settings?.university ?? "Jahangirnagar University";
  const tagline = settings?.tagline ?? "Advancing life sciences through discovery, innovation, and cutting-edge research.";

  return (
    <>
      {/* ── 1. HERO SECTION ────────────────────────── */}
      <section className="hero" id="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-grid" />

        {/* Ambient background glow */}
        <div style={{
          position: "absolute", top: "15%", right: "10%",
          width: 380, height: 380,
          background: "radial-gradient(circle, rgba(0,200,150,0.18) 0%, transparent 70%)",
          borderRadius: "50%", animation: "float 8s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", left: "5%",
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(10,79,60,0.25) 0%, transparent 70%)",
          borderRadius: "50%", animation: "float 10s ease-in-out infinite reverse",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-content" style={{ maxWidth: 780 }}>
            {/* Pill Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(0,200,150,0.12)", border: "1px solid rgba(0,200,150,0.25)",
              borderRadius: "999px", padding: "6px 16px",
              fontSize: "0.8rem", fontWeight: 600, color: "var(--color-accent)",
              marginBottom: "var(--space-6)", letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block", animation: "pulse-dot 2s ease infinite" }} />
              {university} · Department of BGE
            </div>

            {/* Display Headline */}
            <h1 className="text-display" style={{ color: "white", marginBottom: "var(--space-5)", letterSpacing: "-0.02em" }}>
              {labName}
            </h1>

            {/* Subheading */}
            <p style={{
              color: "rgba(255,255,255,0.8)", fontSize: "1.15rem",
              lineHeight: 1.7, marginBottom: "var(--space-8)", maxWidth: 620,
            }}>
              {tagline}
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/research" className="btn btn-accent btn-lg">
                Explore Research Areas →
              </Link>
              <Link href="/members" className="btn btn-lg" style={{
                background: "rgba(255,255,255,0.1)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                color: "white",
              }}>
                Meet Our Team
              </Link>
            </div>

            {/* Mini Stats */}
            <div className="hero-mini-stats">
              {[
                { n: `${projectCount || 20}+`, label: "Active Projects" },
                { n: `${pubCount || 50}+`, label: "Publications" },
                { n: `${memberCount || 30}+`, label: "Researchers" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--color-accent)", lineHeight: 1.1 }}>
                    {s.n}
                  </div>
                  <div style={{ fontSize: "0.825rem", color: "rgba(255,255,255,0.6)", fontWeight: 500, marginTop: 4 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. IMPACT STATS BAR ───────────────────── */}
      <section style={{ padding: "var(--space-12) 0", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border-subtle)" }}>
        <div className="container">
          <div className="grid-4">
            {[
              { n: `${projectCount || 20}+`, label: "Research Projects", icon: "🔬" },
              { n: `${pubCount || 50}+`, label: "Peer-Reviewed Papers", icon: "📄" },
              { n: `${memberCount || 30}+`, label: "Faculty & Students", icon: "👨‍🔬" },
              { n: `${postCount || 10}+`, label: "Scientific Articles", icon: "✍️" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div style={{ fontSize: "1.8rem", marginBottom: "var(--space-2)" }}>{stat.icon}</div>
                <div className="stat-number">{stat.n}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. RESEARCH DOMAINS ───────────────────── */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Scientific Focus</div>
            <h2 className="section-title">Core Research Areas</h2>
            <p className="section-subtitle">
              Pioneering interdisciplinary scientific discovery across modern biotechnology disciplines.
            </p>
          </div>

          <div className="grid-3">
            {RESEARCH_DOMAINS.map((domain) => (
              <div key={domain.title} className="card card-body" style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "var(--radius-lg)",
                  background: "var(--color-accent-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", marginBottom: "var(--space-4)",
                }}>
                  {domain.icon}
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "var(--space-2)", color: "var(--color-secondary)" }}>
                  {domain.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.6, flex: 1 }}>
                  {domain.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
            <Link href="/research" className="btn btn-outline">
              Learn More About Our Research →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED PROJECTS ──────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="section" style={{ background: "var(--color-surface)" }}>
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Innovation</div>
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-subtitle">
                High-impact ongoing studies driving tangible scientific and healthcare breakthroughs.
              </p>
            </div>

            <div className="grid-3">
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
                  <div className="project-card" style={{ height: "100%" }}>
                    <div className="project-card-img-placeholder" style={{ height: 160, fontSize: "2.5rem" }}>
                      🧬
                    </div>
                    <div className="project-card-body">
                      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
                        <span className={`badge badge-${project.status === "ONGOING" ? "success" : project.status === "COMPLETED" ? "info" : "warning"}`}>
                          {project.status}
                        </span>
                        {project.category && <span className="badge badge-neutral">{project.category}</span>}
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)", lineHeight: 1.3 }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5, flex: 1 }}>
                        {project.description.slice(0, 110)}…
                      </p>
                      <div style={{ marginTop: "var(--space-4)", color: "var(--color-accent)", fontSize: "0.85rem", fontWeight: 600 }}>
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
              <Link href="/projects" className="btn btn-primary">
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. WHY JOIN US / LAB PILLARS ──────────── */}
      <section className="section" style={{ background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))", color: "white" }}>
        <div className="container">
          <div className="split-2-col">
            <div>
              <div className="section-eyebrow" style={{ color: "var(--color-accent)" }}>Why BGE Lab</div>
              <h2 style={{ color: "white", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, marginBottom: "var(--space-5)" }}>
                Excellence in Scientific Training &amp; Research
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "var(--space-6)", fontSize: "1rem" }}>
                We provide graduate researchers with hands-on exposure to modern biotechnology, world-class supervision, and national research grants.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {[
                  "Modern Next-Generation Sequencing (NGS) & PCR Infrastructure",
                  "Active National & International Research Collaborations",
                  "Dedicated Publication Support & Journal Mentorship",
                  "Funded Graduate Research & Conference Travel Opportunities",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0 }} />
                    <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9rem" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "var(--space-8)" }}>
                <Link href="/contact" className="btn btn-accent btn-lg">
                  Join Our Research Group
                </Link>
              </div>
            </div>

            <div className="grid-2">
              {[
                { icon: "🔬", title: "Modern Labs", desc: "Equipped for genomics & molecular diagnostics" },
                { icon: "📚", title: "High Impact", desc: "Peer-reviewed international publications" },
                { icon: "🤝", title: "Collaboration", desc: "Global academic & industrial networks" },
                { icon: "🏆", title: "Grants & Honors", desc: "Competitive national research awards" },
              ].map((item) => (
                <div key={item.title} style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-5)",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "var(--space-2)" }}>{item.icon}</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", marginBottom: "var(--space-1)" }}>{item.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75rem", lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. RECENT LAB ARTICLES ─────────────────── */}
      {recentPosts.length > 0 && (
        <section className="section" style={{ background: "var(--color-bg)" }}>
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Insights</div>
              <h2 className="section-title">Latest Discoveries &amp; News</h2>
              <p className="section-subtitle">
                Scientific perspectives and updates from our faculty and student researchers.
              </p>
            </div>

            <div className="grid-3">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div className="blog-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{
                      height: 140, background: "linear-gradient(135deg, var(--color-surface-3), var(--color-accent-subtle))",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem",
                    }}>
                      ✍️
                    </div>
                    <div className="blog-card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <div className="blog-card-meta">
                        <span>{post.author.name}</span>
                        <span>·</span>
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                      </div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)" }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p style={{ fontSize: "0.825rem", color: "var(--color-text-muted)", lineHeight: 1.5, flex: 1 }}>
                          {post.excerpt.slice(0, 90)}…
                        </p>
                      )}
                      <div style={{ marginTop: "var(--space-3)", color: "var(--color-accent)", fontSize: "0.85rem", fontWeight: 600 }}>
                        Read Article →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
              <Link href="/blog" className="btn btn-outline">
                View All Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 7. CLEAN MINIMALIST CTA ────────────────── */}
      <section style={{ background: "var(--color-accent-subtle)", padding: "var(--space-20) 0" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 640 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-3)" }}>🧬</div>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 800, marginBottom: "var(--space-3)", color: "var(--color-secondary)" }}>
            Advance Life Sciences With Us
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "var(--space-8)", lineHeight: 1.6 }}>
            Whether you are a prospective student, researcher, or institutional partner, explore opportunities to collaborate with our laboratory.
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Get in Touch
            </Link>
            <Link href="/about" className="btn btn-outline btn-lg">
              About the Lab
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
