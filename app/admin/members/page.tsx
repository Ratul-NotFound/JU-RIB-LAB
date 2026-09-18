"use client";

import { useState, useEffect } from "react";

interface Member {
  id: string;
  userId: string;
  slug: string;
  fullName: string;
  designation: string | null;
  department: string | null;
  bio: string | null;
  avatarUrl: string | null;
  phone: string | null;
  linkedin: string | null;
  googleScholar: string | null;
  researchGate: string | null;
  orcid: string | null;
  website: string | null;
  isActive: boolean;
  user: {
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
    isActive: boolean;
  };
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "STUDENT" as "ADMIN" | "TEACHER" | "STUDENT",
    designation: "",
    department: "Biotechnology & Genetic Engineering",
    bio: "",
    avatarUrl: "",
    phone: "",
    linkedin: "",
    googleScholar: "",
    researchGate: "",
    orcid: "",
    website: "",
    isActive: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMembers(data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditMember(null);
    setForm({
      fullName: "",
      email: "",
      password: "",
      role: "STUDENT",
      designation: "",
      department: "Biotechnology & Genetic Engineering",
      bio: "",
      avatarUrl: "",
      phone: "",
      linkedin: "",
      googleScholar: "",
      researchGate: "",
      orcid: "",
      website: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEdit = (m: Member) => {
    setEditMember(m);
    setForm({
      fullName: m.fullName,
      email: m.user?.email ?? "",
      password: "",
      role: m.user?.role ?? "STUDENT",
      designation: m.designation ?? "",
      department: m.department ?? "Biotechnology & Genetic Engineering",
      bio: m.bio ?? "",
      avatarUrl: m.avatarUrl ?? "",
      phone: m.phone ?? "",
      linkedin: m.linkedin ?? "",
      googleScholar: m.googleScholar ?? "",
      researchGate: m.researchGate ?? "",
      orcid: m.orcid ?? "",
      website: m.website ?? "",
      isActive: m.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMember) {
        await fetch(`/api/members/${editMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/members", {
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
    if (!confirm("Are you sure you want to remove this member? This action cannot be undone.")) return;
    setDeleteId(id);
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  };

  const filteredMembers = members.filter((m) => {
    if (roleFilter === "ALL") return true;
    return m.user?.role === roleFilter;
  });

  const ROLE_BADGE: Record<string, string> = {
    ADMIN: "badge-danger",
    TEACHER: "badge-primary",
    STUDENT: "badge-info",
  };

  return (
    <div className="dashboard-content">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <div className="page-title">Lab Members & Faculty</div>
          <div className="page-subtitle">Manage faculty teachers, student researchers, and lab administrators</div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="ALL">All Roles ({members.length})</option>
            <option value="TEACHER">Faculty / Teachers</option>
            <option value="STUDENT">Students / Researchers</option>
            <option value="ADMIN">Administrators</option>
          </select>
          <button id="new-member-btn" className="btn btn-primary" onClick={openNew}>
            ➕ Add Member
          </button>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>Loading members…</div>
        ) : filteredMembers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>👥</div>
            <p>No members found. Click "Add Member" to register faculty or students.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: "var(--color-primary-light)",
                          color: "var(--color-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          m.fullName.charAt(0)
                        )}
                      </div>
                      <div>
                        <strong style={{ color: "var(--color-secondary)" }}>{m.fullName}</strong>
                        <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{m.department}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${ROLE_BADGE[m.user?.role ?? "STUDENT"] ?? "badge-neutral"}`}>
                      {m.user?.role ?? "STUDENT"}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "var(--color-text-muted)" }}>{m.designation ?? "—"}</span>
                  </td>
                  <td>
                    <span style={{ color: "var(--color-text)" }}>{m.user?.email ?? "—"}</span>
                  </td>
                  <td>
                    <span className={`badge ${m.isActive ? "badge-success" : "badge-neutral"}`}>
                      {m.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <a href={`/members/${m.slug}`} target="_blank" className="btn btn-ghost btn-sm">
                        View
                      </a>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(m)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleDelete(m.id)}
                        disabled={deleteId === m.id}
                        style={{ background: "#FEE2E2", color: "#991B1B", border: "none" }}
                      >
                        {deleteId === m.id ? "…" : "Delete"}
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
              <h2 className="modal-title">{editMember ? "Edit Member Profile" : "Register New Lab Member"}</h2>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)} aria-label="Close">
                ✕
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      required
                      className="form-input"
                      placeholder="e.g. Dr. Md. Shahedur Rahman"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      required
                      type="email"
                      className="form-input"
                      placeholder="user@juniv.edu"
                      value={form.email}
                      disabled={!!editMember}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                    >
                      <option value="STUDENT">Student / Researcher</option>
                      <option value="TEACHER">Faculty / Teacher</option>
                      <option value="ADMIN">Lab Administrator</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password {editMember && "(leave blank to keep)"}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder={editMember ? "••••••••" : "Default: BGE@2025!"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">Designation / Title</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Professor / PhD Researcher"
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      className="form-input"
                      placeholder="Biotechnology & Genetic Engineering"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Biographical Summary</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Short bio, research interests, specializations…"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  />
                </div>

                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">Avatar Image URL</label>
                    <input
                      className="form-input"
                      placeholder="https://…"
                      value={form.avatarUrl}
                      onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      placeholder="+880 1712-345678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">Google Scholar Profile URL</label>
                    <input
                      className="form-input"
                      placeholder="https://scholar.google.com/…"
                      value={form.googleScholar}
                      onChange={(e) => setForm({ ...form, googleScholar: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ResearchGate URL</label>
                    <input
                      className="form-input"
                      placeholder="https://researchgate.net/profile/…"
                      value={form.researchGate}
                      onChange={(e) => setForm({ ...form, researchGate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">LinkedIn URL</label>
                    <input
                      className="form-input"
                      placeholder="https://linkedin.com/in/…"
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ORCID iD</label>
                    <input
                      className="form-input"
                      placeholder="0000-0002-1825-0097"
                      value={form.orcid}
                      onChange={(e) => setForm({ ...form, orcid: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="isActive" className="form-label" style={{ margin: 0 }}>
                    Active Lab Member (visible in public member directories)
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
