import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  let profile: any = null, myPosts: any[] = [], myProjects: any[] = [];
  try {
    [profile, myPosts] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: userId! } }),
      prisma.post.findMany({ where: { authorId: userId! }, orderBy: { createdAt: "desc" } }),
    ]);
    if (profile) {
      myProjects = await prisma.projectMember.findMany({
        where: { profileId: profile.id },
        include: { project: true },
      });
    }
  } catch {}

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <div className="container" style={{ padding: "var(--space-10) var(--space-6)" }}>
        <div style={{ marginBottom: "var(--space-8)" }}>
          <h1 className="text-h1">Student Dashboard</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Welcome back, {session?.user?.name}!</p>
        </div>

        {!profile && (
          <div style={{
            background: "var(--color-accent-subtle)", border: "1px solid var(--color-accent)",
            borderRadius: "var(--radius-xl)", padding: "var(--space-6)", marginBottom: "var(--space-6)",
          }}>
            <h3 style={{ color: "var(--color-primary)", marginBottom: "var(--space-2)" }}>⚠️ Profile Not Complete</h3>
            <p style={{ color: "var(--color-text-2)" }}>Your profile hasn&apos;t been set up yet. Please complete it to appear on the team page.</p>
            <Link href="/student/profile" className="btn btn-primary btn-sm" style={{ marginTop: "var(--space-3)" }}>Complete Profile</Link>
          </div>
        )}

        <div className="grid-3" style={{ marginBottom: "var(--space-8)" }}>
          {[
            { label: "My Projects", value: myProjects.length, icon: "🔭" },
            { label: "Blog Posts", value: myPosts.length, icon: "✍️" },
            { label: "Profile", value: profile ? "Complete" : "Incomplete", icon: "👤" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: "2rem", marginBottom: "var(--space-2)" }}>{s.icon}</div>
              <div className="stat-number" style={{ fontSize: "1.8rem" }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card card-body" style={{ marginBottom: "var(--space-8)" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "var(--space-5)" }}>Quick Actions</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
            <Link href="/student/blog?action=new" className="btn btn-primary">✍️ Write Blog Post</Link>
            <Link href="/student/profile" className="btn btn-outline">👤 Edit Profile</Link>
            <Link href="/projects" className="btn btn-ghost">🔭 View Projects</Link>
          </div>
        </div>

        {/* My projects */}
        {myProjects.length > 0 && (
          <div style={{ marginBottom: "var(--space-8)" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "var(--space-4)" }}>My Projects</h2>
            <div className="grid-3">
              {myProjects.map((pm: any) => (
                <Link key={pm.id} href={`/projects/${pm.project.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card card-body">
                    <span className={`badge ${pm.project.status === "ONGOING" ? "badge-success" : "badge-info"}`}>{pm.project.status}</span>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginTop: "var(--space-3)", color: "var(--color-secondary)" }}>{pm.project.title}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Role: {pm.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* My blog posts */}
        {myPosts.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "var(--space-4)" }}>My Blog Posts</h2>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Title</th><th>Status</th><th>Created</th><th></th></tr></thead>
                <tbody>
                  {myPosts.map((p: any) => (
                    <tr key={p.id}>
                      <td><strong>{p.title}</strong></td>
                      <td><span className={`badge ${p.status === "PUBLISHED" ? "badge-success" : "badge-neutral"}`}>{p.status}</span></td>
                      <td style={{ color: "var(--color-text-muted)" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td>{p.status === "PUBLISHED" && <Link href={`/blog/${p.slug}`} className="btn btn-ghost btn-sm">View</Link>}</td>
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
