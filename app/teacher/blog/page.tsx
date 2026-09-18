"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  createdAt: string;
}

export default function TeacherBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverUrl: "",
    tags: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditPost(null);
    setForm({
      title: "",
      excerpt: "",
      content: "",
      coverUrl: "",
      tags: "",
      status: "DRAFT",
    });
    setShowModal(true);
  };

  const openEdit = (p: Post) => {
    setEditPost(p);
    setForm({
      title: p.title,
      excerpt: p.excerpt ?? "",
      content: (p as any).content ?? "",
      coverUrl: (p as any).coverUrl ?? "",
      tags: ((p as any).tags ?? []).join(", "),
      status: p.status,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editPost) {
        await fetch(`/api/blog/${editPost.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      load();
    } catch {}
    setSaving(false);
  };

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "80vh" }}>
      <div className="container" style={{ padding: "var(--space-10) var(--space-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)" }}>
          <div>
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <Link href="/teacher/dashboard" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "0.9rem" }}>
                ← Dashboard
              </Link>
            </div>
            <h1 className="text-h1" style={{ marginTop: "var(--space-2)" }}>Lab Insights & Articles</h1>
            <p style={{ color: "var(--color-text-muted)" }}>Write and publish research perspectives, protocols, and science notes</p>
          </div>
          <button className="btn btn-primary" onClick={openNew}>
            ✍️ Write Article
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>Loading articles…</div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>✍️</div>
              <p>No articles written yet. Click "Write Article" to compose your first post.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Article Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ color: "var(--color-secondary)" }}>{p.title}</strong>
                      {p.excerpt && (
                        <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.excerpt}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${p.status === "PUBLISHED" ? "badge-success" : "badge-neutral"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--color-text-muted)" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "var(--space-2)" }}>
                        <Link href={`/blog/${p.slug}`} target="_blank" className="btn btn-ghost btn-sm">
                          View
                        </Link>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
              <div className="modal-header">
                <h2 className="modal-title">{editPost ? "Edit Article" : "Write New Lab Article"}</h2>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)} aria-label="Close">
                  ✕
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <div className="form-group">
                    <label className="form-label">Article Title *</label>
                    <input
                      required
                      className="form-input"
                      placeholder="e.g. Advancements in Molecular Diagnostics for Plant Pathogens"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Summary / Excerpt</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      placeholder="A short hook summarizing what the reader will learn…"
                      value={form.excerpt}
                      onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    />
                  </div>

                  <div className="grid-form-2">
                    <div className="form-group">
                      <label className="form-label">Cover Image URL</label>
                      <input
                        className="form-input"
                        placeholder="https://images.unsplash.com/..."
                        value={form.coverUrl}
                        onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                      >
                        <option value="DRAFT">Draft (Unpublished)</option>
                        <option value="PUBLISHED">Published (Live on Website)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Article Content (Markdown / Text) *</label>
                    <textarea
                      required
                      rows={8}
                      className="form-textarea"
                      placeholder="Write your article content here with headers, bullet points, and citations…"
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tags (comma-separated)</label>
                    <input
                      className="form-input"
                      placeholder="Biotechnology, CRISPR, PCR, Bioinformatics"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving…" : "Save Article"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
