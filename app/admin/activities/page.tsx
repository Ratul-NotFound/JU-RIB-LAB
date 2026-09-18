"use client";

import { useState, useEffect } from "react";

interface Activity {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  type: string;
  eventDate: string;
  endDate: string | null;
  isFeatured: boolean;
  thumbnailUrl: string | null;
  creator?: { name: string | null };
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    thumbnailUrl: "",
    eventDate: "",
    endDate: "",
    location: "Department of BGE, Jahangirnagar University",
    type: "SEMINAR",
    isFeatured: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/activities");
      const data = await res.json();
      if (Array.isArray(data)) setActivities(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditActivity(null);
    setForm({
      title: "",
      description: "",
      content: "",
      thumbnailUrl: "",
      eventDate: new Date().toISOString().slice(0, 16),
      endDate: "",
      location: "Department of BGE, Jahangirnagar University",
      type: "SEMINAR",
      isFeatured: false,
    });
    setShowModal(true);
  };

  const openEdit = (a: Activity) => {
    setEditActivity(a);
    setForm({
      title: a.title,
      description: a.description,
      content: (a as any).content ?? "",
      thumbnailUrl: a.thumbnailUrl ?? "",
      eventDate: a.eventDate ? new Date(a.eventDate).toISOString().slice(0, 16) : "",
      endDate: a.endDate ? new Date(a.endDate).toISOString().slice(0, 16) : "",
      location: a.location ?? "",
      type: a.type,
      isFeatured: a.isFeatured,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editActivity) {
        await fetch(`/api/activities/${editActivity.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setShowModal(false);
      load();
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    setDeleteId(id);
    await fetch(`/api/activities/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  };

  const TYPE_BADGE: Record<string, string> = {
    SEMINAR: "badge-primary",
    WORKSHOP: "badge-success",
    CONFERENCE: "badge-info",
    FIELDWORK: "badge-warning",
    TRAINING: "badge-danger",
    OTHER: "badge-neutral",
  };

  return (
    <div className="dashboard-content">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
        <div>
          <div className="page-title">Lab Activities & Events</div>
          <div className="page-subtitle">Manage workshops, seminars, outreach, and scientific symposiums</div>
        </div>
        <button id="new-activity-btn" className="btn btn-primary" onClick={openNew}>
          ➕ Add Activity
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>Loading activities…</div>
        ) : activities.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>📅</div>
            <p>No activities or events recorded yet.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Activity Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Location</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong style={{ color: "var(--color-secondary)" }}>{a.title}</strong>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.description}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${TYPE_BADGE[a.type] ?? "badge-neutral"}`}>{a.type}</span>
                  </td>
                  <td style={{ color: "var(--color-text)", whiteSpace: "nowrap" }}>
                    {new Date(a.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td>
                    <span style={{ color: "var(--color-text-muted)" }}>{a.location ?? "—"}</span>
                  </td>
                  <td>{a.isFeatured ? "⭐" : "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <a href={`/activities/${a.slug}`} target="_blank" className="btn btn-ghost btn-sm">
                        View
                      </a>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleDelete(a.id)}
                        disabled={deleteId === a.id}
                        style={{ background: "#FEE2E2", color: "#991B1B", border: "none" }}
                      >
                        {deleteId === a.id ? "…" : "Delete"}
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
              <h2 className="modal-title">{editActivity ? "Edit Activity" : "Create New Lab Activity"}</h2>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)} aria-label="Close">
                ✕
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label">Activity Title *</label>
                  <input
                    required
                    className="form-input"
                    placeholder="e.g. Hands-on CRISPR Workshop 2025"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <div className="form-group">
                    <label className="form-label">Activity Type</label>
                    <select
                      className="form-select"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                      <option value="SEMINAR">Seminar</option>
                      <option value="WORKSHOP">Workshop</option>
                      <option value="CONFERENCE">Conference</option>
                      <option value="FIELDWORK">Field Work</option>
                      <option value="TRAINING">Training Session</option>
                      <option value="OTHER">Other Activity</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thumbnail / Cover URL</label>
                    <input
                      className="form-input"
                      placeholder="https://…"
                      value={form.thumbnailUrl}
                      onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <div className="form-group">
                    <label className="form-label">Event Start Date & Time *</label>
                    <input
                      required
                      type="datetime-local"
                      className="form-input"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event End Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Event Location</label>
                  <input
                    className="form-input"
                    placeholder="e.g. BGE Lab 204, Jahangirnagar University"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Summary *</label>
                  <textarea
                    required
                    rows={2}
                    className="form-textarea"
                    placeholder="Brief overview of the activity for event cards…"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Content / Schedule Details (Markdown / HTML)</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Detailed session outlines, speakers, requirements…"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="isFeatured" className="form-label" style={{ margin: 0 }}>
                    Highlight as Featured Event on Homepage & Calendar
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
