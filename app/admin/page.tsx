import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  let stats = { projects: 0, publications: 0, members: 0, posts: 0 };
  try {
    const [projects, publications, members, posts] = await Promise.all([
      prisma.project.count(),
      prisma.publication.count(),
      prisma.profile.count({ where: { isActive: true } }),
      prisma.post.count(),
    ]);
    stats = { projects, publications, members, posts };
  } catch {}

  const CARDS = [
    { label: "Total Projects", value: stats.projects, code: "PRJ", href: "/admin/projects", color: "var(--color-primary)" },
    { label: "Publications", value: stats.publications, code: "PUB", href: "/admin/publications", color: "var(--color-secondary)" },
    { label: "Lab Members", value: stats.members, code: "MBR", href: "/admin/members", color: "var(--color-primary)" },
    { label: "Blog Posts", value: stats.posts, code: "PST", href: "/admin/blog", color: "var(--color-secondary)" },
  ];

  return (
    <div className="dashboard-content">
      <div className="dashboard-topbar" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", padding: "0 var(--space-8)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div className="page-title" style={{ fontSize: "1.25rem", marginBottom: 0 }}>Laboratory Administration Portal</div>
        </div>
      </div>

      <div style={{ padding: "var(--space-8)" }}>
        <div className="page-title">Administrative Overview</div>
        <div className="page-subtitle">Department of Biotechnology & Genetic Engineering · BTIB Lab Management</div>

        {/* Stats grid */}
        <div className="grid-4" style={{ marginBottom: "var(--space-10)" }}>
          {CARDS.map((card) => (
            <a key={card.label} href={card.href} style={{ textDecoration: "none" }}>
              <div className="card admin-stat-card" style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border)",
                padding: "var(--space-6)",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
                  <div style={{
                    width: 44, height: 32, borderRadius: "var(--radius-sm)",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: card.color,
                  }}>
                    {card.code}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-accent)", fontWeight: 600 }}>Manage →</span>
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 800, color: card.color, lineHeight: 1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                  {card.label}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", padding: "var(--space-6)" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-5)" }}>Administrative Operations</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
            {[
              { label: "New Project", href: "/admin/projects?action=new" },
              { label: "New Blog Post", href: "/admin/blog?action=new" },
              { label: "Add Publication", href: "/admin/publications?action=new" },
              { label: "Add Activity", href: "/admin/activities?action=new" },
              { label: "Add Member", href: "/admin/members?action=new" },
              { label: "Lab Settings", href: "/admin/settings" },
            ].map((action) => (
              <a key={action.label} href={action.href} className="btn btn-outline btn-sm">
                + {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
