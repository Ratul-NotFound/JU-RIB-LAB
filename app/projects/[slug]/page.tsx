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
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project) return { title: "Project Not Found" };
    return { title: project.title, description: project.description };
  } catch {
    return { title: "Research Project — BGE Lab" };
  }
}

const STATUS_COLORS: Record<string, string> = {
  ONGOING: "badge-success",
  COMPLETED: "badge-info",
  UPCOMING: "badge-warning",
  PAUSED: "badge-neutral",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let project: any = null;

  try {
    project = await prisma.project.findUnique({
      where: { slug },
      include: {
        members: {
          include: { profile: true },
        },
        creator: { select: { name: true } },
      },
    });
  } catch {}

  // Fallback demo data if DB is not yet populated
  if (!project) {
    if (slug === "crispr-rice-salinity" || slug === "crispr-cas9-rice-salinity") {
      project = {
        title: "CRISPR/Cas9 Targeted Mutagenesis for Salinity Tolerance in Coastal Rice",
        slug,
        description:
          "Developing climate-resilient rice varieties using precision CRISPR-Cas9 genome editing targeting OsHKT and OsNHX ion-transporter genes in Bangladeshi coastal cultivars.",
        content: `<h3>Research Overview</h3>
<p>Coastal agriculture in southern Bangladesh is critically threatened by rising sea levels and soil salinity. This project uses state-of-the-art CRISPR/Cas9 ribonucleoprotein (RNP) complexes to introduce targeted non-homologous end joining (NHEJ) and prime edits in key salinity-responsive transporters.</p>
<h3>Methodology & Experimental Pipeline</h3>
<ul>
  <li><strong>Guide RNA Design & Validation:</strong> In silico off-target prediction and in vitro cleavage assays against target exon regions.</li>
  <li><strong>Tissue Culture & Transformation:</strong> Agrobacterium-mediated calli transformation and particle bombardment for transgene-free editing.</li>
  <li><strong>Phenotypic & Ion-flux Screening:</strong> Non-invasive microelectrode ion flux estimation (MIFE) to evaluate Na+/K+ homeostatic regulation.</li>
</ul>
<h3>Key Findings & Publications</h3>
<p>Preliminary regenerated lines demonstrated up to 40% higher shoot K+/Na+ ratios under 150 mM NaCl stress compared to wild-type controls.</p>`,
        status: "ONGOING",
        category: "Plant Biotechnology & Genomics",
        isFeatured: true,
        tags: ["CRISPR", "Salinity", "Oryza sativa", "Gene Editing", "Food Security"],
        fundingSource: "Ministry of Science and Technology, Bangladesh (Grant: BGE-2024-09)",
        startDate: new Date("2023-07-01"),
        endDate: null,
        members: [
          {
            id: "m1",
            role: "Principal Investigator",
            profile: {
              fullName: "Dr. Md. Shahedur Rahman",
              slug: "dr-md-shahedur-rahman",
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
      <div className="page-header">
        <div className="container page-header-content">
          <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)", flexWrap: "wrap" }}>
            <span className={`badge ${STATUS_COLORS[project.status] ?? "badge-neutral"}`}>{project.status}</span>
            {project.isFeatured && <span className="badge badge-accent">Featured Project</span>}
            {project.category && <span className="badge badge-neutral">{project.category}</span>}
          </div>
          <h1 className="text-h1">{project.title}</h1>
          <p>{project.description}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-10)", alignItems: "start" }}>
            {/* Main content */}
            <div>
              {project.content ? (
                <div
                  className="prose"
                  style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--color-text-2)" }}
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              ) : (
                <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--color-text-2)" }}>
                  {project.description}
                </p>
              )}

              {project.tags && project.tags.length > 0 && (
                <div style={{ marginTop: "var(--space-8)" }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
                    Research Keywords
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    {project.tags.map((tag: string) => (
                      <span key={tag} className="badge badge-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              {/* Project details */}
              <div className="card card-body">
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "var(--space-4)", color: "var(--color-secondary)" }}>
                  Project Overview
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-faint)", fontWeight: 700, marginBottom: 2 }}>
                      Status
                    </div>
                    <span className={`badge ${STATUS_COLORS[project.status] ?? "badge-neutral"}`}>{project.status}</span>
                  </div>
                  {project.startDate && (
                    <div>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-faint)", fontWeight: 700, marginBottom: 2 }}>
                        Start Date
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--color-text-2)" }}>
                        {new Date(project.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                      </div>
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-faint)", fontWeight: 700, marginBottom: 2 }}>
                        End Date
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--color-text-2)" }}>
                        {new Date(project.endDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                      </div>
                    </div>
                  )}
                  {project.fundingSource && (
                    <div>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-faint)", fontWeight: 700, marginBottom: 2 }}>
                        Funding / Grant
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--color-text-2)" }}>{project.fundingSource}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Team */}
              {project.members && project.members.length > 0 && (
                <div className="card card-body">
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "var(--space-4)", color: "var(--color-secondary)" }}>
                    Research Investigators
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {project.members.map((m: any) => (
                      <Link
                        key={m.id}
                        href={`/members/${m.profile.slug}`}
                        style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", textDecoration: "none" }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          {m.profile.fullName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text)" }}>
                            {m.profile.fullName}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{m.role}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link href="/projects" className="btn btn-outline" style={{ textAlign: "center" }}>
                ← All Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
