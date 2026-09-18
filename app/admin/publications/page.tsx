"use client";

import { useState, useEffect } from "react";

interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string | null;
  year: number;
  type: string;
  isFeatured: boolean;
  doi: string | null;
}

export default function AdminPublicationsPage() {
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPub, setEditPub] = useState<Publication | null>(null);
  const [form, setForm] = useState({ title: "", authors: "", journal: "", year: new Date().getFullYear().toString(), doi: "", abstract: "", pdfUrl: "", type: "JOURNAL", citationCount: "", isFeatured: false });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const res = await fetch("/api/publications"); setPubs(await res.json()); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditPub(null); setForm({ title: "", authors: "", journal: "", year: new Date().getFullYear().toString(), doi: "", abstract: "", pdfUrl: "", type: "JOURNAL", citationCount: "", isFeatured: false }); setShowModal(true); };
  const openEdit = (p: Publication) => { setEditPub(p); setForm({ title: p.title, authors: p.authors, journal: p.journal ?? "", year: p.year.toString(), doi: p.doi ?? "", abstract: (p as any).abstract ?? "", pdfUrl: (p as any).pdfUrl ?? "", type: p.type, citationCount: (p as any).citationCount?.toString() ?? "", isFeatured: p.isFeatured }); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editPub) await fetch(`/api/publications/${editPub.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      else await fetch("/api/publications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setShowModal(false); load();
    } catch {} setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this publication?")) return;
    await fetch(`/api/publications/${id}`, { method: "DELETE" }); load();
  };

  const TYPE_BADGE: Record<string, string> = { JOURNAL: "badge-info", CONFERENCE: "badge-success", BOOK_CHAPTER: "badge-warning", PATENT: "badge-accent", THESIS: "badge-neutral", OTHER: "badge-neutral" };

  return (
    <div className="dashboard-content">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
        <div><div className="page-title">Publications</div><div className="page-subtitle">Manage research publications</div></div>
        <button id="new-publication-btn" className="btn btn-primary" onClick={openNew}>➕ Add Publication</button>
      </div>
      <div className="table-container">
        {loading ? <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>Loading…</div> : pubs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}><div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>📄</div><p>No publications yet.</p></div>
        ) : (
          <table className="table">
            <thead><tr><th>Title</th><th>Authors</th><th>Year</th><th>Type</th><th>Journal</th><th>Actions</th></tr></thead>
            <tbody>
              {pubs.map(p => (
                <tr key={p.id}>
                  <td><strong style={{ color: "var(--color-secondary)" }}>{p.title.slice(0, 50)}{p.title.length > 50 ? "…" : ""}</strong></td>
                  <td style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>{p.authors.slice(0, 40)}…</td>
                  <td>{p.year}</td>
                  <td><span className={`badge ${TYPE_BADGE[p.type] ?? "badge-neutral"}`}>{p.type.replace("_", " ")}</span></td>
                  <td style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>{p.journal ?? "—"}</td>
                  <td><div style={{ display: "flex", gap: "var(--space-2)" }}>
                    {p.doi && <a href={`https://doi.org/${p.doi}`} target="_blank" className="btn btn-ghost btn-sm">DOI</a>}
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
              <h2 className="modal-title">{editPub ? "Edit Publication" : "Add Publication"}</h2>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div className="form-group"><label className="form-label">Title *</label><input required className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Authors * (e.g. Smith J, Doe A)</label><input required className="form-input" value={form.authors} onChange={e => setForm({ ...form, authors: e.target.value })} /></div>
                <div className="grid-form-3">
                  <div className="form-group"><label className="form-label">Year *</label><input required type="number" className="form-input" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="JOURNAL">Journal</option><option value="CONFERENCE">Conference</option><option value="BOOK_CHAPTER">Book Chapter</option><option value="PATENT">Patent</option><option value="THESIS">Thesis</option><option value="OTHER">Other</option></select></div>
                  <div className="form-group"><label className="form-label">Citations</label><input type="number" className="form-input" value={form.citationCount} onChange={e => setForm({ ...form, citationCount: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Journal / Conference Name</label><input className="form-input" value={form.journal} onChange={e => setForm({ ...form, journal: e.target.value })} /></div>
                <div className="grid-form-2">
                  <div className="form-group"><label className="form-label">DOI</label><input className="form-input" placeholder="10.xxxx/xxxxx" value={form.doi} onChange={e => setForm({ ...form, doi: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">PDF URL</label><input className="form-input" placeholder="https://…" value={form.pdfUrl} onChange={e => setForm({ ...form, pdfUrl: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Abstract</label><textarea className="form-textarea" rows={3} value={form.abstract} onChange={e => setForm({ ...form, abstract: e.target.value })} /></div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <input type="checkbox" id="pubFeatured" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                  <label htmlFor="pubFeatured" className="form-label" style={{ margin: 0 }}>Featured publication</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Publication"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
