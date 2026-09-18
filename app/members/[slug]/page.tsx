import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const profile = await prisma.profile.findUnique({ where: { slug } });
    if (!profile) return { title: "Member Not Found" };
    return { title: `${profile.fullName} — Faculty & Researchers`, description: profile.bio ?? `Profile of ${profile.fullName}` };
  } catch {
    return { title: "Member Profile — BGE Lab" };
  }
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let profile: any = null;

  try {
    profile = await prisma.profile.findUnique({
      where: { slug },
      include: {
        user: { select: { email: true, role: true } },
        projectMembers: {
          include: { project: { select: { title: true, slug: true, status: true } } },
        },
      },
    });
  } catch {}

  // Fallback demo data if DB is offline or unseeded
  if (!profile) {
    if (slug === "dr-md-shahedur-rahman") {
      profile = {
        fullName: "Dr. Md. Shahedur Rahman",
        slug: "dr-md-shahedur-rahman",
        designation: "Professor & Principal Investigator",
        department: "Department of Biotechnology & Genetic Engineering, Jahangirnagar University",
        bio: "Dr. Md. Shahedur Rahman is a Professor of Biotechnology and Genetic Engineering at Jahangirnagar University. His research focuses on plant molecular biology, CRISPR/Cas9 genome editing, biotic stress signaling in crops, and bioinformatics pipelines for non-coding RNA discoveries.",
        avatarUrl: null,
        phone: "+880 1711-234567",
        linkedin: "https://linkedin.com",
        googleScholar: "https://scholar.google.com",
        researchGate: "https://researchgate.net",
        orcid: "0000-0002-1825-0097",
        joiningDate: new Date("2012-01-01"),
        user: { email: "shahedur@juniv.edu", role: "TEACHER" },
        projectMembers: [
          {
            id: "pm1",
            role: "Principal Investigator",
            project: {
              title: "CRISPR/Cas9 Targeted Mutagenesis for Salinity Tolerance in Coastal Rice",
              slug: "crispr-rice-salinity",
              status: "ONGOING",
            },
          },
        ],
      };
    } else {
      notFound();
    }
  }

  return (
    <>
      <div className="page-header" style={{ paddingBottom: "var(--space-20)" }}>
        <div className="container page-header-content">
          <Link
            href="/members"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.875rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              marginBottom: "var(--space-6)",
              textDecoration: "none",
            }}
          >
            ← Back to Team Directory
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-8)", flexWrap: "wrap" }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2.5rem",
                fontWeight: 800,
                border: "4px solid rgba(255,255,255,0.2)",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                profile.fullName.charAt(0)
              )}
            </div>
            <div>
              <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start", marginBottom: "var(--space-2)" }}>
                {profile.user?.role?.charAt(0) + profile.user?.role?.slice(1).toLowerCase()}
              </div>
              <h1 className="text-h1">{profile.fullName}</h1>
              {profile.designation && <p style={{ fontSize: "1.1rem", opacity: 0.85 }}>{profile.designation}</p>}
              {profile.department && <p style={{ fontSize: "0.9rem", opacity: 0.65 }}>{profile.department}</p>}
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-10)", alignItems: "start" }}>
            {/* Main */}
            <div>
              {profile.bio && (
                <div style={{ marginBottom: "var(--space-8)" }}>
                  <h2 className="text-h3" style={{ marginBottom: "var(--space-4)" }}>
                    Biography & Research Focus
                  </h2>
                  <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--color-text-2)" }}>{profile.bio}</p>
                </div>
              )}
              {profile.projectMembers && profile.projectMembers.length > 0 && (
                <div>
                  <h2 className="text-h3" style={{ marginBottom: "var(--space-4)" }}>
                    Involved Research Projects
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {profile.projectMembers.map((pm: any) => (
                      <Link
                        key={pm.id}
                        href={`/projects/${pm.project.slug}`}
                        className="card card-body"
                        style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--color-secondary)" }}>{pm.project.title}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{pm.role}</div>
                        </div>
                        <span className={`badge ${pm.project.status === "ONGOING" ? "badge-success" : "badge-info"}`}>
                          {pm.project.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="card card-body">
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "var(--space-5)", color: "var(--color-secondary)" }}>
                Contact & Profiles
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {profile.user?.email && (
                  <a
                    href={`mailto:${profile.user.email}`}
                    style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", color: "var(--color-text-2)", fontSize: "0.9rem", textDecoration: "none" }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>✉️</span> {profile.user.email}
                  </a>
                )}
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", color: "var(--color-text-2)", fontSize: "0.9rem", textDecoration: "none" }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>📞</span> {profile.phone}
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    LinkedIn Profile →
                  </a>
                )}
                {profile.googleScholar && (
                  <a href={profile.googleScholar} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    Google Scholar →
                  </a>
                )}
                {profile.orcid && (
                  <a href={`https://orcid.org/${profile.orcid}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    ORCID iD →
                  </a>
                )}
                {profile.researchGate && (
                  <a href={profile.researchGate} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    ResearchGate Profile →
                  </a>
                )}
                {profile.joiningDate && (
                  <div>
                    <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-faint)", fontWeight: 700, marginBottom: 2 }}>
                      Joined Department
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "var(--color-text-2)" }}>
                      {new Date(profile.joiningDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
