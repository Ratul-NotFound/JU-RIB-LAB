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
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>Research Directory</div>
          <h1 className="text-h1">Faculty & Lab Members</h1>
          <p>Supervisors, postdoctoral scholars, doctoral candidates, and graduate researchers.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Faculty & Supervisors */}
          {teachers.length > 0 && (
            <div style={{ marginBottom: "var(--space-16)" }}>
              <div style={{ marginBottom: "var(--space-8)" }}>
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>Supervisors & Investigators</div>
                <h2 className="text-h2">Faculty & Principal Investigators</h2>
              </div>
              <div className="grid-4">
                {teachers.map((member) => (
                  <Link key={member.id} href={`/members/${member.slug}`} style={{ textDecoration: "none" }}>
                    <div className="member-card" style={{ padding: "var(--space-6) var(--space-5)", height: "100%", display: "flex", flexDirection: "column" }}>
                      <div className="member-avatar-placeholder" style={{ background: "var(--color-primary)", color: "#FFFFFF", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                        {member.fullName.charAt(0)}
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-1)" }}>
                        {member.fullName}
                      </h3>
                      {member.designation && (
                        <div style={{ fontSize: "0.8rem", color: "var(--color-accent)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
                          {member.designation}
                        </div>
                      )}
                      {member.department && (
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                          {member.department}
                        </div>
                      )}
                      {member.bio && (
                        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginTop: "var(--space-3)", flex: 1 }}>
                          {member.bio.slice(0, 80)}…
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center", marginTop: "var(--space-4)", flexWrap: "wrap" }}>
                        {member.googleScholar && (
                          <span className="badge badge-primary" style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>Scholar</span>
                        )}
                        {member.orcid && (
                          <span className="badge badge-neutral" style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>ORCID</span>
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
                <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>Research Fellows & Trainees</div>
                <h2 className="text-h2">Graduate & Undergraduate Researchers</h2>
              </div>
              <div className="grid-4">
                {students.map((member) => (
                  <Link key={member.id} href={`/members/${member.slug}`} style={{ textDecoration: "none" }}>
                    <div className="member-card" style={{ padding: "var(--space-5) var(--space-4)", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <div className="member-avatar-placeholder" style={{ width: 64, height: 64, fontSize: "1.25rem", borderRadius: "var(--radius-sm)", background: "var(--color-surface-2)", color: "var(--color-primary)", border: "1px solid var(--color-border)" }}>
                        {member.fullName.charAt(0)}
                      </div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-1)" }}>
                        {member.fullName}
                      </h3>
                      {member.designation && (
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
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
              <p>Team profiles coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
