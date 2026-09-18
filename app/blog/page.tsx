import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read articles, insights, and updates from the BTIB Lab team.",
};

async function getPosts(tag?: string) {
  try {
    return await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        ...(tag ? { tags: { has: tag } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      include: { author: { select: { name: true, image: true } } },
    });
  } catch {
    return [];
  }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const posts = await getPosts(tag);

  return (
    <>
      <div className="page-header">
        <div className="container page-header-content">
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>Dispatches & Insights</div>
          <h1 className="text-h1">Research Blog & News</h1>
          <p>Scientific perspectives, methodology write-ups, and laboratory breakthroughs.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {tag && (
            <div style={{ marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Filtering by domain:</span>
              <span className="badge badge-primary">{tag}</span>
              <Link href="/blog" className="btn btn-ghost btn-sm">Clear filter ×</Link>
            </div>
          )}

          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-20) 0", color: "var(--color-text-muted)" }}>
              <p>No articles published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div className="blog-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{
                      height: 140,
                      background: "var(--color-surface-2)",
                      borderBottom: "1px solid var(--color-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "var(--space-4)",
                    }}>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Lab Dispatch
                      </span>
                    </div>
                    <div className="blog-card-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <div className="blog-card-meta" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginBottom: "var(--space-2)" }}>
                        <span style={{ fontWeight: 600 }}>{post.author.name}</span>
                        <span>·</span>
                        <span>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : ""}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)", lineHeight: 1.4 }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.6, flex: 1 }}>
                          {post.excerpt.slice(0, 120)}…
                        </p>
                      )}
                      {post.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", marginTop: "var(--space-4)" }}>
                          {post.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="badge badge-neutral"
                              style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
