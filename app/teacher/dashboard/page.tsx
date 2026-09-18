import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TeacherDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  let myProjects: any[] = [], myPubs: any[] = [], myPosts: any[] = [];
  try {
    [myProjects, myPubs, myPosts] = await Promise.all([
      prisma.project.findMany({ where: { createdBy: userId! }, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.publication.findMany({ where: { createdBy: userId! }, orderBy: { year: "desc" }, take: 5 }),
      prisma.post.findMany({ where: { authorId: userId! }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
  } catch {}

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <div className="container" style={{ padding: "var(--space-10) var(--space-6)" }}>
        <div style={{ marginBottom: "var(--space-8)" }}>
          <h1 className="text-h1">Teacher Dashboard</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Welcome back, {session?.user?.name}!</p>
        </div>

        {/* Quick stats */}
        <div className="grid-3" style={{ marginBottom: "var(--space-8)" }}>
          {[
            { label: "My Projects", value: myProjects.length, icon: "🔭", href: "/teacher/projects" },
            { label: "My Publications", value: myPubs.length, icon: "📄", href: "/teacher/publications" },
            { label: "My Blog Posts", value: myPosts.length, icon: "✍️", href: "/teacher/blog" },
          ].map(s => (
            <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
              <div className="stat-card">
                <div style={{ fontSize: "2rem", marginBottom: "var(--space-2)" }}>{s.icon}</div>
                <div className="stat-number">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="card card-body" style={{ marginBottom: "var(--space-8)" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "var(--space-5)" }}>Quick Actions</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
            <Link href="/teacher/projects?action=new" className="btn btn-primary">➕ New Project</Link>
            <Link href="/teacher/publications?action=new" className="btn btn-outline">📄 Add Publication</Link>
            <Link href="/teacher/blog?action=new" className="btn btn-outline">✍️ Write Blog Post</Link>
          </div>
        </div>

        {/* Recent projects */}
        {myProjects.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "var(--space-4)" }}>Recent Projects</h2>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Title</th><th>Status</th><th>Created</th><th></th></tr></thead>
                <tbody>
                  {myProjects.map((p: any) => (
                    <tr key={p.id}>
                      <td><strong>{p.title}</strong></td>
                      <td><span className={`badge ${p.status === "ONGOING" ? "badge-success" : "badge-info"}`}>{p.status}</span></td>
                      <td style={{ color: "var(--color-text-muted)" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td><Link href={`/projects/${p.slug}`} className="btn btn-ghost btn-sm">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
