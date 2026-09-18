"use client";

import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string | null;
  isFeatured: boolean;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: "", description: "", status: "ONGOING", category: "", isFeatured: false, tags: "" });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditProject(null);
    setForm({ title: "", description: "", status: "ONGOING", category: "", isFeatured: false, tags: "" });
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditProject(p);
    setForm({ title: (p as any).title, description: (p as any).description ?? "", status: p.status, category: p.category ?? "", isFeatured: p.isFeatured, tags: ((p as any).tags ?? []).join(", ") });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    try {
      if (editProject) {
        await fetch(`/api/projects/${editProject.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      setShowModal(false);
      load();
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleteId(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  };

  const STATUS_BADGE: Record<string, string> = {
    ONGOING: "badge-success", COMPLETED: "badge-info", UPCOMING: "badge-warning", PAUSED: "badge-neutral",
  };

  return (
    <div className="dashboard-content">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
        <div>
          <div className="page-title">Projects</div>
          <div className="page-subtitle">Manage all research projects</div>
        </div>
        <button id="new-project-btn" className="btn btn-primary" onClick={openNew}>➕ New Project</button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>Loading…</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>🔭</div>
            <p>No projects yet. Create your first one!</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td><strong style={{ color: "var(--color-secondary)" }}>{p.title}</strong></td>
                  <td><span className={`badge ${STATUS_BADGE[p.status] ?? "badge-neutral"}`}>{p.status}</span></td>
                  <td><span style={{ color: "var(--color-text-muted)" }}>{p.category ?? "—"}</span></td>
                  <td>{p.isFeatured ? "⭐" : "—"}</td>
                  <td style={{ color: "var(--color-text-muted)" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <a href={`/projects/${p.slug}`} target="_blank" className="btn btn-ghost btn-sm">View</a>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-sm" onClick={() => handleDelete(p.id)}
                        disabled={deleteId === p.id}
                        style={{ background: "#FEE2E2", color: "#991B1B", border: "none" }}>
                        {deleteId === p.id ? "…" : "Delete"}
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editProject ? "Edit Project" : "New Project"}</h2>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)} aria-label="Close">✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input required className="form-input" placeholder="Project title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea required className="form-textarea" placeholder="Brief description of the project…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="ONGOING">Ongoing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="UPCOMING">Upcoming</option>
                      <option value="PAUSED">Paused</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input className="form-input" placeholder="e.g. Genomics" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input className="form-input" placeholder="DNA, genomics, CRISPR" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} style={{ width: 16, height: 16 }} />
                  <label htmlFor="isFeatured" className="form-label" style={{ margin: 0 }}>Feature on homepage</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Project"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
