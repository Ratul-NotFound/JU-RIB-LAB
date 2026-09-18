import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Team Members",
  description: "Meet the faculty, researchers, and students of the Bioresources Technology and Industrial Biotechnology Laboratory.",
};

async function getMembers() {
  try {
    const profiles = await prisma.profile.findMany({
      where: { isActive: true },
      include: { user: { select: { role: true } } },
      orderBy: [{ user: { role: "asc" } }, { fullName: "asc" }],
    });
    return profiles;
  } catch {
    return [];
  }
}

export default async function MembersPage() {
  const members = await getMembers();

  const teachers = members.filter((m) => m.user.role === "ADMIN" || m.user.role === "TEACHER");
  const students = members.filter((m) => m.user.role === "STUDENT");

  return (
    <>
      <div className="page-header">
        <div className="container page-header-content">
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>Our People</div>
          <h1 className="text-h1">Lab Members</h1>
          <p>A diverse and passionate team of scientists, researchers, and innovators.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Faculty & Supervisors */}
          {teachers.length > 0 && (
            <div style={{ marginBottom: "var(--space-16)" }}>
              <div style={{ marginBottom: "var(--space-8)" }}>
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>Faculty</div>
                <h2 className="text-h2">Supervisors & Researchers</h2>
              </div>
              <div className="grid-4">
                {teachers.map((member) => (
                  <Link key={member.id} href={`/members/${member.slug}`} style={{ textDecoration: "none" }}>
                    <div className="member-card" style={{ padding: "var(--space-6) var(--space-4)", height: "100%" }}>
                      <div className="member-avatar-placeholder">
                        {member.fullName.charAt(0)}
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-1)" }}>
                        {member.fullName}
                      </h3>
                      {member.designation && (
                        <div style={{ fontSize: "0.8rem", color: "var(--color-accent)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
                          {member.designation}
                        </div>
                      )}
                      {member.department && (
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          {member.department}
                        </div>
                      )}
                      {member.bio && (
                        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginTop: "var(--space-3)" }}>
                          {member.bio.slice(0, 80)}…
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center", marginTop: "var(--space-4)", flexWrap: "wrap" }}>
                        {member.googleScholar && (
                          <a href={member.googleScholar} target="_blank" rel="noopener noreferrer"
                            className="badge badge-primary" onClick={(e) => e.stopPropagation()}>Scholar</a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                            className="badge badge-neutral" onClick={(e) => e.stopPropagation()}>LinkedIn</a>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {students.length > 0 && (
            <div>
              <div style={{ marginBottom: "var(--space-8)" }}>
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>Students</div>
                <h2 className="text-h2">Graduate & Undergraduate Students</h2>
              </div>
              <div className="grid-4">
                {students.map((member) => (
                  <Link key={member.id} href={`/members/${member.slug}`} style={{ textDecoration: "none" }}>
                    <div className="member-card" style={{ padding: "var(--space-5) var(--space-4)", height: "100%" }}>
                      <div className="member-avatar-placeholder" style={{ width: 80, height: 80, fontSize: "1.5rem" }}>
                        {member.fullName.charAt(0)}
                      </div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-1)" }}>
                        {member.fullName}
                      </h3>
                      {member.designation && (
                        <div style={{ fontSize: "0.75rem", color: "var(--color-accent)", fontWeight: 600 }}>
                          {member.designation}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {members.length === 0 && (
            <div style={{ textAlign: "center", padding: "var(--space-20) 0", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>👨‍🔬</div>
              <p>Team profiles coming soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
