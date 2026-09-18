"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string | null;
  year: number;
  doi: string | null;
  abstract: string | null;
  pdfUrl: string | null;
  type: string;
  citationCount: number | null;
  isFeatured: boolean;
}

export default function TeacherPublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPub, setEditPub] = useState<Publication | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    authors: "",
    journal: "",
    year: new Date().getFullYear(),
    doi: "",
    abstract: "",
    pdfUrl: "",
    type: "JOURNAL",
    citationCount: "",
    isFeatured: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/publications");
      const data = await res.json();
      if (Array.isArray(data)) setPublications(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditPub(null);
    setForm({
      title: "",
      authors: "",
      journal: "",
      year: new Date().getFullYear(),
      doi: "",
      abstract: "",
      pdfUrl: "",
      type: "JOURNAL",
      citationCount: "",
      isFeatured: false,
    });
    setShowModal(true);
  };

  const openEdit = (p: Publication) => {
    setEditPub(p);
    setForm({
      title: p.title,
      authors: p.authors,
      journal: p.journal ?? "",
      year: p.year,
      doi: p.doi ?? "",
      abstract: p.abstract ?? "",
      pdfUrl: p.pdfUrl ?? "",
      type: p.type,
      citationCount: p.citationCount ? String(p.citationCount) : "",
      isFeatured: p.isFeatured,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      year: parseInt(String(form.year)),
      citationCount: form.citationCount ? parseInt(form.citationCount) : null,
    };
    try {
      if (editPub) {
        await fetch(`/api/publications/${editPub.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/publications", {
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

  const TYPE_BADGE: Record<string, string> = {
    JOURNAL: "badge-primary",
    CONFERENCE: "badge-success",
    BOOK_CHAPTER: "badge-info",
    PATENT: "badge-warning",
    THESIS: "badge-neutral",
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
            <h1 className="text-h1" style={{ marginTop: "var(--space-2)" }}>My Research Publications</h1>
            <p style={{ color: "var(--color-text-muted)" }}>Manage peer-reviewed articles, conference proceedings, and books</p>
          </div>
          <button className="btn btn-primary" onClick={openNew}>
            ➕ Add Publication
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>Loading publications…</div>
          ) : publications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>📄</div>
              <p>No publications registered yet. Click "Add Publication" to list your papers.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title & Authors</th>
                  <th>Type</th>
                  <th>Journal / Venue</th>
                  <th>Year</th>
                  <th>DOI</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {publications.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ color: "var(--color-secondary)" }}>{p.title}</strong>
                      <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{p.authors}</div>
                    </td>
                    <td>
                      <span className={`badge ${TYPE_BADGE[p.type] ?? "badge-neutral"}`}>{p.type}</span>
                    </td>
                    <td>
                      <span style={{ color: "var(--color-text-muted)" }}>{p.journal ?? "—"}</span>
                    </td>
                    <td>
                      <strong>{p.year}</strong>
                    </td>
                    <td>
                      {p.doi ? (
                        <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", fontSize: "0.85rem" }}>
                          {p.doi}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>
                        Edit
                      </button>
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
                <h2 className="modal-title">{editPub ? "Edit Publication" : "Add New Publication"}</h2>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)} aria-label="Close">
                  ✕
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <div className="form-group">
                    <label className="form-label">Article / Paper Title *</label>
                    <input
                      required
                      className="form-input"
                      placeholder="e.g. CRISPR/Cas9-mediated Genome Editing in Crop Species"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Authors List (as shown on publication) *</label>
                    <input
                      required
                      className="form-input"
                      placeholder="e.g. Rahman, M. S., Ahmed, T., Islam, M. R."
                      value={form.authors}
                      onChange={(e) => setForm({ ...form, authors: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "var(--space-4)" }}>
                    <div className="form-group">
                      <label className="form-label">Journal / Conference Name</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Nature Biotechnology / Frontiers in Genetics"
                        value={form.journal}
                        onChange={(e) => setForm({ ...form, journal: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year</label>
                      <input
                        type="number"
                        className="form-input"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select
                        className="form-select"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                      >
                        <option value="JOURNAL">Journal</option>
                        <option value="CONFERENCE">Conference</option>
                        <option value="BOOK_CHAPTER">Book Chapter</option>
                        <option value="PATENT">Patent</option>
                        <option value="THESIS">Thesis</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                    <div className="form-group">
                      <label className="form-label">DOI (e.g. 10.1038/s41587-020-0000-0)</label>
                      <input
                        className="form-input"
                        placeholder="10.1038/..."
                        value={form.doi}
                        onChange={(e) => setForm({ ...form, doi: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Full Text PDF URL</label>
                      <input
                        className="form-input"
                        placeholder="https://..."
                        value={form.pdfUrl}
                        onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Abstract</label>
                    <textarea
                      rows={3}
                      className="form-textarea"
                      placeholder="Brief abstract of the publication…"
                      value={form.abstract}
                      onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <input
                      type="checkbox"
                      id="teacherPubFeatured"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      style={{ width: 16, height: 16 }}
                    />
                    <label htmlFor="teacherPubFeatured" className="form-label" style={{ margin: 0 }}>
                      Feature this publication on homepage
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving…" : "Save Publication"}
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
