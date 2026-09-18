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

const RESEARCH_AREAS = [
  { icon: "🧬", title: "Genomics & Sequencing", desc: "Advanced DNA sequencing, genome assembly, and comparative genomics studies." },
  { icon: "🔬", title: "Molecular Biology", desc: "Gene expression, protein synthesis, and cellular mechanisms research." },
  { icon: "🌱", title: "Agri-Biotechnology", desc: "Developing improved crop varieties through genetic modification and breeding." },
  { icon: "💊", title: "Biopharmaceuticals", desc: "Research on therapeutic proteins, vaccines, and diagnostic tools." },
  { icon: "🦠", title: "Microbial Biotechnology", desc: "Exploiting microorganisms for industrial and environmental applications." },
  { icon: "🧪", title: "Bioinformatics", desc: "Computational analysis of biological data and structural biology." },
];

export default async function HomePage() {
  const { settings, featuredProjects, recentPosts, stats } = await getHomeData();
  const [projectCount, pubCount, memberCount, postCount] = stats;

  const labName = settings?.labName ?? "Biotechnology & Genetic Engineering Lab";
  const university = settings?.university ?? "Jahangirnagar University";
  const tagline = settings?.tagline ?? "Advancing life sciences through innovation, collaboration, and cutting-edge research.";

  return (
    <>
      {/* ── HERO ──────────────────────────────────── */}
      <section className="hero" id="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-grid" />

        {/* Floating DNA orbs */}
        <div style={{
          position: "absolute", top: "15%", right: "8%",
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(0,200,150,0.2) 0%, transparent 70%)",
          borderRadius: "50%", animation: "float 6s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", left: "5%",
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)",
          borderRadius: "50%", animation: "float 8s ease-in-out infinite reverse",
        }} />

        <div className="container">
          <div className="hero-content" style={{ maxWidth: 720 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(0,200,150,0.15)", border: "1px solid rgba(0,200,150,0.3)",
              borderRadius: "999px", padding: "6px 16px",
              fontSize: "0.8rem", fontWeight: 600, color: "var(--color-accent)",
              marginBottom: "var(--space-6)", letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block", animation: "pulse-dot 2s ease infinite" }} />
              Active Research Lab
            </div>

            <h1 className="text-display" style={{ color: "white", marginBottom: "var(--space-6)" }}>
              {labName}
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.75)", fontSize: "1.2rem",
              lineHeight: 1.7, marginBottom: "var(--space-8)", maxWidth: 580,
            }}>
              {tagline}
            </p>

            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              <Link href="/research" className="btn btn-accent btn-lg">
                Explore Research →
              </Link>
              <Link href="/about" className="btn btn-lg" style={{
                background: "rgba(255,255,255,0.12)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                color: "white",
              }}>
                Learn More
              </Link>
            </div>

            {/* Mini stats */}
            <div style={{
              display: "flex", gap: "var(--space-8)", marginTop: "var(--space-12)",
              paddingTop: "var(--space-8)",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              flexWrap: "wrap",
            }}>
              {[
                { n: projectCount || "20+", label: "Projects" },
                { n: pubCount || "50+", label: "Publications" },
                { n: memberCount || "30+", label: "Members" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--color-accent)" }}>{s.n}</div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────── */}
      <section style={{ padding: "var(--space-16) 0", background: "var(--color-surface)" }}>
        <div className="container">
          <div className="grid-4">
            {[
              { n: `${projectCount || "20"}+`, label: "Research Projects", icon: "🔭" },
              { n: `${pubCount || "50"}+`, label: "Publications", icon: "📄" },
              { n: `${memberCount || "30"}+`, label: "Lab Members", icon: "👨‍🔬" },
              { n: `${postCount || "10"}+`, label: "Blog Articles", icon: "✍️" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>{stat.icon}</div>
                <div className="stat-number">{stat.n}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEARCH AREAS ────────────────────────── */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">What We Do</div>
            <h2 className="section-title">Research Areas</h2>
            <p className="section-subtitle">
              Our multidisciplinary team works across six major research domains in biotechnology and genetic engineering.
            </p>
          </div>
          <div className="grid-3">
            {RESEARCH_AREAS.map((area) => (
              <div key={area.title} className="card card-body" style={{ textAlign: "left" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "var(--radius-lg)",
                  background: "var(--color-accent-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.6rem", marginBottom: "var(--space-4)",
                }}>
                  {area.icon}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "var(--space-2)", color: "var(--color-secondary)" }}>
                  {area.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                  {area.desc}
                </p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
            <Link href="/research" className="btn btn-outline">View All Research Areas</Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ─────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="section" style={{ background: "var(--color-surface)" }}>
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Our Work</div>
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-subtitle">Ongoing and recently completed research projects shaping the future of biotechnology.</p>
            </div>
            <div className="grid-3">
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
                  <div className="project-card">
                    <div className="project-card-img-placeholder">🧬</div>
                    <div className="project-card-body">
                      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
                        <span className={`badge badge-${project.status === "ONGOING" ? "success" : project.status === "COMPLETED" ? "info" : "warning"}`}>
                          {project.status}
                        </span>
                        {project.category && <span className="badge badge-neutral">{project.category}</span>}
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)" }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.5, flex: 1 }}>
                        {project.description.slice(0, 120)}…
                      </p>
                      <div style={{ marginTop: "var(--space-4)", color: "var(--color-accent)", fontSize: "0.875rem", fontWeight: 600 }}>
                        Read more →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
              <Link href="/projects" className="btn btn-primary">All Projects</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY JOIN US ───────────────────────────── */}
      <section className="section" style={{ background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))", color: "white" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-16)", alignItems: "center" }}>
            <div>
              <div className="section-eyebrow" style={{ color: "var(--color-accent)" }}>Why BGE Lab</div>
              <h2 style={{ color: "white", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, marginBottom: "var(--space-6)" }}>
                Where Science Meets Innovation
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "var(--space-8)", fontSize: "1.05rem" }}>
                Our lab provides state-of-the-art facilities, a collaborative environment, and mentorship from leading researchers to help you make a meaningful impact in life sciences.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {[
                  "Modern sequencing & PCR equipment",
                  "Active national & international collaborations",
                  "Publication support for students",
                  "Funded research opportunities",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0 }} />
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "var(--space-8)" }}>
                <Link href="/contact" className="btn btn-accent btn-lg">Join Our Lab</Link>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              {[
                { icon: "🔬", label: "Advanced Lab" },
                { icon: "📚", label: "Research Support" },
                { icon: "🤝", label: "Collaborations" },
                { icon: "🏆", label: "Awards & Grants" },
              ].map((item) => (
                <div key={item.label} style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-6)",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-3)" }}>{item.icon}</div>
                  <div style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT BLOG ───────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="section" style={{ background: "var(--color-bg)" }}>
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">From the Lab</div>
              <h2 className="section-title">Latest from Our Blog</h2>
              <p className="section-subtitle">Insights, discoveries, and stories from our researchers and students.</p>
            </div>
            <div className="grid-3">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div className="blog-card">
                    <div style={{
                      height: 180, background: "linear-gradient(135deg, var(--color-surface-3), var(--color-accent-subtle))",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem",
                    }}>✍️</div>
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span>{post.author.name}</span>
                        <span>·</span>
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)" }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                          {post.excerpt.slice(0, 100)}…
                        </p>
                      )}
                      <div style={{ marginTop: "auto", paddingTop: "var(--space-4)", color: "var(--color-accent)", fontSize: "0.875rem", fontWeight: 600 }}>
                        Read more →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
              <Link href="/blog" className="btn btn-outline">All Articles</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────── */}
      <section style={{ background: "var(--color-accent-subtle)", padding: "var(--space-20) 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🧬</div>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, marginBottom: "var(--space-4)", color: "var(--color-secondary)" }}>
            Ready to Advance Science Together?
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--color-text-muted)", marginBottom: "var(--space-8)", maxWidth: 560, margin: "0 auto var(--space-8)" }}>
            Whether you're a student, researcher, or collaborator — we'd love to connect.
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Get in Touch</Link>
            <Link href="/members" className="btn btn-outline btn-lg">Meet the Team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
