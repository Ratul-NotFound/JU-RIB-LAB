import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publications",
  description: "Research papers, patents, and publications from the BGE Lab.",
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
          <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {publications.map((pub) => (
                <div key={pub.id} className="card card-body">
                  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "var(--radius-md)",
                      background: "var(--color-accent-subtle)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.4rem", flexShrink: 0,
                    }}>
                      📄
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
                        <span className={`badge ${TYPE_COLORS[pub.type] ?? "badge-neutral"}`}>{pub.type.replace("_", " ")}</span>
                        {pub.isFeatured && <span className="badge badge-accent">Featured</span>}
                        <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{pub.year}</span>
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-1)", lineHeight: 1.4 }}>
                        {pub.doi ? (
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                            style={{ color: "inherit", textDecoration: "none" }}
                            className="hover-accent">
                            {pub.title}
                          </a>
                        ) : pub.title}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>
                        {pub.authors}
                      </p>
                      {pub.journal && (
                        <p style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontStyle: "italic" }}>
                          {pub.journal}
                        </p>
                      )}
                      {pub.abstract && (
                        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "var(--space-2)", lineHeight: 1.5 }}>
                          {pub.abstract.slice(0, 200)}…
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
                        {pub.doi && (
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                            className="btn btn-sm btn-outline">
                            DOI →
                          </a>
                        )}
                        {pub.pdfUrl && (
                          <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer"
                            className="btn btn-sm btn-ghost">
                            PDF ↓
                          </a>
                        )}
                        {pub.citationCount && (
                          <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center" }}>
                            🔖 {pub.citationCount} citations
                          </span>
                        )}
                      </div>
                    </div>
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
