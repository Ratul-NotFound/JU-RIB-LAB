"use client";

import { useState, useEffect } from "react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", tags: "", status: "DRAFT" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const res = await fetch("/api/blog"); setPosts(await res.json()); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditPost(null); setForm({ title: "", excerpt: "", content: "", tags: "", status: "DRAFT" }); setShowModal(true); };
  const openEdit = (p: any) => { setEditPost(p); setForm({ title: p.title, excerpt: p.excerpt ?? "", content: p.content, tags: (p.tags ?? []).join(", "), status: p.status }); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { ...form, tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) };
    try {
      if (editPost) await fetch(`/api/blog/${editPost.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      else await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setShowModal(false); load();
    } catch {} setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" }); load();
  };

  return (
    <div className="dashboard-content">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
        <div><div className="page-title">Blog Posts</div><div className="page-subtitle">Manage all blog articles</div></div>
        <button id="new-blog-btn" className="btn btn-primary" onClick={openNew}>➕ New Post</button>
      </div>
      <div className="table-container">
        {loading ? <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>Loading…</div> : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}><div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>✍️</div><p>No posts yet.</p></div>
        ) : (
          <table className="table">
            <thead><tr><th>Title</th><th>Author</th><th>Status</th><th>Published</th><th>Tags</th><th>Actions</th></tr></thead>
            <tbody>
              {posts.map((p: any) => (
                <tr key={p.id}>
                  <td><strong style={{ color: "var(--color-secondary)" }}>{p.title.slice(0, 50)}{p.title.length > 50 ? "…" : ""}</strong></td>
                  <td style={{ color: "var(--color-text-muted)" }}>{p.author?.name ?? "—"}</td>
                  <td><span className={`badge ${p.status === "PUBLISHED" ? "badge-success" : "badge-neutral"}`}>{p.status}</span></td>
                  <td style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "—"}</td>
                  <td>{(p.tags ?? []).slice(0, 2).map((t: string) => <span key={t} className="badge badge-primary" style={{ marginRight: 4 }}>{t}</span>)}</td>
                  <td><div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <a href={`/blog/${p.slug}`} target="_blank" className="btn btn-ghost btn-sm">View</a>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-sm" onClick={() => handleDelete(p.id)} style={{ background: "#FEE2E2", color: "#991B1B", border: "none" }}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editPost ? "Edit Post" : "New Blog Post"}</h2>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div className="form-group"><label className="form-label">Title *</label><input required className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Excerpt (short summary)</label><textarea className="form-textarea" rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Content * (HTML supported)</label><textarea required className="form-textarea" rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="<p>Write your article content here…</p>" /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                  <div className="form-group"><label className="form-label">Tags (comma-separated)</label><input className="form-input" placeholder="genomics, research" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Post"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
