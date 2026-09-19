import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publications",
  description: "Research papers, patents, and publications from the Bioresources Technology and Industrial Biotechnology Laboratory.",
};

async function getPublications(type?: string) {
  try {
    return await prisma.publication.findMany({
      where: type ? { type: type as any } : undefined,
      orderBy: [{ isFeatured: "desc" }, { year: "desc" }],
      include: { creator: { select: { name: true } } },
    });
  } catch {
    return [];
  }
}

const TYPE_COLORS: Record<string, string> = {
  JOURNAL: "badge-info",
  CONFERENCE: "badge-success",
  BOOK_CHAPTER: "badge-warning",
  PATENT: "badge-accent",
  THESIS: "badge-neutral",
  OTHER: "badge-neutral",
};

export default async function PublicationsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const publications = await getPublications(type);

  return (
    <>
      <div className="page-header">
        <div className="container page-header-content">
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>Research Output</div>
          <h1 className="text-h1">Publications</h1>
          <p>Peer-reviewed research, patents, and academic contributions from our lab.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filter tabs */}
          <div data-reveal="fade" style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
            {[
              { label: "All", value: "" },
              { label: "Journal Articles", value: "JOURNAL" },
              { label: "Conference Papers", value: "CONFERENCE" },
              { label: "Book Chapters", value: "BOOK_CHAPTER" },
              { label: "Patents", value: "PATENT" },
              { label: "Theses", value: "THESIS" },
            ].map((tab) => (
              <Link
                key={tab.value}
                href={tab.value ? `/publications?type=${tab.value}` : "/publications"}
                className={`btn btn-sm ${(!type && !tab.value) || type === tab.value ? "btn-primary" : "btn-ghost"}`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Count */}
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: "var(--space-6)" }}>
            {publications.length} publication{publications.length !== 1 ? "s" : ""} found
          </p>

          {publications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-20) 0", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>📄</div>
              <p>No publications found yet.</p>
            </div>
          ) : (
            <div className="reveal-stagger" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {publications.map((pub) => (
                <div key={pub.id} className="pub-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-4)", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
                      <span className={`badge ${TYPE_COLORS[pub.type] ?? "badge-neutral"}`}>
                        {pub.type.replace("_", " ")}
                      </span>
                      {pub.isFeatured && <span className="badge badge-warning">Featured Paper</span>}
                      <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
                        {pub.year}
                      </span>
                    </div>
                    {pub.citationCount && (
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", background: "var(--color-surface-2)", padding: "2px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border-subtle)" }}>
                        {pub.citationCount} Citations
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", lineHeight: 1.4, margin: 0 }}>
                    {pub.doi ? (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                        style={{ color: "inherit", textDecoration: "none" }}
                        className="hover-accent">
                        {pub.title}
                      </a>
                    ) : pub.title}
                  </h3>

                  <div style={{ fontSize: "0.875rem", color: "var(--color-text-2)", lineHeight: 1.5 }}>
                    <strong style={{ color: "var(--color-secondary)", fontWeight: 600 }}>Authors:</strong> {pub.authors}
                  </div>

                  {pub.journal && (
                    <div style={{ fontSize: "0.875rem", color: "var(--color-primary)", fontStyle: "italic" }}>
                      {pub.journal}
                    </div>
                  )}

                  {pub.abstract && (
                    <p style={{ fontSize: "0.825rem", color: "var(--color-text-muted)", lineHeight: 1.6, margin: 0 }}>
                      {pub.abstract}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)", flexWrap: "wrap" }}>
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                        className="btn btn-sm btn-outline">
                        View DOI (Crossref / Publisher) →
                      </a>
                    )}
                    {pub.pdfUrl && (
                      <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer"
                        className="btn btn-sm btn-ghost">
                        Download Full-Text PDF ↓
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
