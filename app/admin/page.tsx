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
    { label: "Total Projects", value: stats.projects, icon: "🔭", href: "/admin/projects", color: "#0A4F3C" },
    { label: "Publications", value: stats.publications, icon: "📄", href: "/admin/publications", color: "#1A1A2E" },
    { label: "Lab Members", value: stats.members, icon: "👨‍🔬", href: "/admin/members", color: "#00C896" },
    { label: "Blog Posts", value: stats.posts, icon: "✍️", href: "/admin/blog", color: "#3B82F6" },
  ];

  return (
    <div className="dashboard-content">
      <div className="dashboard-topbar" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border-subtle)", padding: "0 var(--space-8)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div className="page-title" style={{ fontSize: "1.25rem", marginBottom: 0 }}>Admin Dashboard</div>
        </div>
      </div>

      <div style={{ padding: "var(--space-8)" }}>
        <div className="page-title">Welcome back, Admin 👋</div>
        <div className="page-subtitle">Here&apos;s an overview of your lab website.</div>

        {/* Stats grid */}
        <div className="grid-4" style={{ marginBottom: "var(--space-10)" }}>
          {CARDS.map((card) => (
            <a key={card.label} href={card.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--color-border-subtle)",
                padding: "var(--space-6)",
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "var(--radius-md)",
                    background: `${card.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.4rem",
                  }}>
                    {card.icon}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-accent)", fontWeight: 600 }}>View →</span>
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
        <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-subtle)", padding: "var(--space-6)" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-5)" }}>Quick Actions</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
            {[
              { label: "➕ New Project", href: "/admin/projects?action=new" },
              { label: "📝 New Blog Post", href: "/admin/blog?action=new" },
              { label: "📄 Add Publication", href: "/admin/publications?action=new" },
              { label: "📅 Add Activity", href: "/admin/activities?action=new" },
              { label: "👤 Add Member", href: "/admin/members?action=new" },
              { label: "⚙️ Lab Settings", href: "/admin/settings" },
            ].map((action) => (
              <a key={action.label} href={action.href} className="btn btn-outline btn-sm">
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
