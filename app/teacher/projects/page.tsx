"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string | null;
  isFeatured: boolean;
  createdAt: string;
}

export default function TeacherProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    status: "ONGOING",
    category: "",
    isFeatured: false,
    tags: "",
    fundingSource: "",
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditProject(null);
    setForm({
      title: "",
      description: "",
      content: "",
      status: "ONGOING",
      category: "",
      isFeatured: false,
      tags: "",
      fundingSource: "",
    });
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditProject(p);
    setForm({
      title: (p as any).title,
      description: (p as any).description ?? "",
      content: (p as any).content ?? "",
      status: p.status,
      category: p.category ?? "",
      isFeatured: p.isFeatured,
      tags: ((p as any).tags ?? []).join(", "),
      fundingSource: (p as any).fundingSource ?? "",
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
      if (editProject) {
        await fetch(`/api/projects/${editProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/projects", {
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

  const STATUS_BADGE: Record<string, string> = {
    ONGOING: "badge-success",
    COMPLETED: "badge-info",
    UPCOMING: "badge-warning",
    PAUSED: "badge-neutral",
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
            <h1 className="text-h1" style={{ marginTop: "var(--space-2)" }}>Research Projects Management</h1>
            <p style={{ color: "var(--color-text-muted)" }}>Oversee, submit, and update your laboratory research initiatives</p>
          </div>
          <button className="btn btn-primary" onClick={openNew}>
            ➕ Propose New Project
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>Loading projects…</div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>🔭</div>
              <p>No projects registered yet. Propose your first research project.</p>
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
                    <td>
                      <strong style={{ color: "var(--color-secondary)" }}>{p.title}</strong>
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[p.status] ?? "badge-neutral"}`}>{p.status}</span>
                    </td>
                    <td>
                      <span style={{ color: "var(--color-text-muted)" }}>{p.category ?? "—"}</span>
                    </td>
                    <td>{p.isFeatured ? "⭐" : "—"}</td>
                    <td style={{ color: "var(--color-text-muted)" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "var(--space-2)" }}>
                        <Link href={`/projects/${p.slug}`} target="_blank" className="btn btn-ghost btn-sm">
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
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
              <div className="modal-header">
                <h2 className="modal-title">{editProject ? "Edit Project" : "New Research Project"}</h2>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)} aria-label="Close">
                  ✕
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <div className="form-group">
                    <label className="form-label">Project Title *</label>
                    <input
                      required
                      className="form-input"
                      placeholder="e.g. CRISPR/Cas9-mediated Disease Resistance in Rice"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Summary / Abstract *</label>
                    <textarea
                      required
                      rows={2}
                      className="form-textarea"
                      placeholder="Concise overview of project objectives and methodology…"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                      >
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="PAUSED">Paused</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Research Field / Category</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Molecular Biology"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                    <div className="form-group">
                      <label className="form-label">Funding Agency / Grant</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Ministry of Science & Tech, JU Grant"
                        value={form.fundingSource}
                        onChange={(e) => setForm({ ...form, fundingSource: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Keywords (comma-separated)</label>
                      <input
                        className="form-input"
                        placeholder="CRISPR, Oryza sativa, Drought"
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Detailed Content / Methodology</label>
                    <textarea
                      rows={4}
                      className="form-textarea"
                      placeholder="Extended project background, experimental design, and preliminary findings…"
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <input
                      type="checkbox"
                      id="teacherIsFeatured"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      style={{ width: 16, height: 16 }}
                    />
                    <label htmlFor="teacherIsFeatured" className="form-label" style={{ margin: 0 }}>
                      Feature on lab homepage
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving…" : "Save Project"}
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
