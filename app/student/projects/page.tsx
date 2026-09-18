"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  category: string | null;
  tags: string[];
}

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STATUS_BADGE: Record<string, string> = {
    ONGOING: "badge-success",
    COMPLETED: "badge-info",
    UPCOMING: "badge-warning",
    PAUSED: "badge-neutral",
  };

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "80vh" }}>
      <div className="container" style={{ padding: "var(--space-10) var(--space-6)" }}>
        <div style={{ marginBottom: "var(--space-8)" }}>
          <Link href="/student/dashboard" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "0.9rem" }}>
            ← Dashboard
          </Link>
          <h1 className="text-h1" style={{ marginTop: "var(--space-2)" }}>Lab Projects Directory</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Browse lab research projects, track objectives, and explore ongoing experiments</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>Loading projects…</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>🔭</div>
            <p>No projects listed currently.</p>
          </div>
        ) : (
          <div className="grid-3" style={{ gap: "var(--space-6)" }}>
            {projects.map((p) => (
              <div key={p.id} className="card card-body" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                    <span className={`badge ${STATUS_BADGE[p.status] ?? "badge-neutral"}`}>{p.status}</span>
                    {p.category && <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{p.category}</span>}
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-2)" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
                    {p.description}
                  </p>
                  {p.tags && p.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", marginBottom: "var(--space-4)" }}>
                      {p.tags.map((t) => (
                        <span key={t} className="badge badge-neutral" style={{ fontSize: "0.75rem" }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Link href={`/projects/${p.slug}`} className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                    View Project Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
