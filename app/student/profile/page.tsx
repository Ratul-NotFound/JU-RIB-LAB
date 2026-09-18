"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    designation: "Undergraduate / Graduate Researcher",
    department: "Biotechnology & Genetic Engineering",
    bio: "",
    avatarUrl: "",
    phone: "",
    linkedin: "",
    googleScholar: "",
    researchGate: "",
    orcid: "",
    website: "",
  });

  useEffect(() => {
    fetch("/api/members/me")
      .then((r) => r.json())
      .then((member) => {
        if (member && !member.error) {
          setForm({
            fullName: member.fullName || "",
            designation: member.designation || "Research Student",
            department: member.department || "Biotechnology & Genetic Engineering",
            bio: member.bio || "",
            avatarUrl: member.avatarUrl || "",
            phone: member.phone || "",
            linkedin: member.linkedin || "",
            googleScholar: member.googleScholar || "",
            researchGate: member.researchGate || "",
            orcid: member.orcid || "",
            website: member.website || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/members/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch {}
    setSaving(false);
  };

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 760, padding: "var(--space-10) var(--space-6)" }}>
        <div style={{ marginBottom: "var(--space-8)" }}>
          <Link href="/student/dashboard" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "0.9rem" }}>
            ← Dashboard
          </Link>
          <h1 className="text-h1" style={{ marginTop: "var(--space-2)" }}>My Student Profile</h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Update your public researcher profile, thesis title, research interests, and academic links
          </p>
        </div>

        {success && (
          <div
            style={{
              padding: "var(--space-4)",
              background: "#ECFDF5",
              color: "#065F46",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-6)",
              border: "1px solid #A7F3D0",
              fontWeight: 600,
            }}
          >
            ✓ Profile updated successfully! Changes will appear across the lab directory.
          </div>
        )}

        <div className="card card-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
              Loading profile…
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    required
                    className="form-input"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Designation</label>
                  <input
                    className="form-input"
                    placeholder="e.g. MS Thesis Student / Research Assistant"
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Department & University</label>
                <input
                  className="form-input"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Research Bio & Interests</label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  placeholder="Describe your research focus, current thesis topic, laboratory techniques mastered, and academic goals…"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label">Profile Avatar URL</label>
                  <input
                    className="form-input"
                    placeholder="https://..."
                    value={form.avatarUrl}
                    onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    className="form-input"
                    placeholder="+880 1..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label">Google Scholar Profile URL</label>
                  <input
                    className="form-input"
                    placeholder="https://scholar.google.com/..."
                    value={form.googleScholar}
                    onChange={(e) => setForm({ ...form, googleScholar: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ResearchGate URL</label>
                  <input
                    className="form-input"
                    placeholder="https://researchgate.net/profile/..."
                    value={form.researchGate}
                    onChange={(e) => setForm({ ...form, researchGate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input
                    className="form-input"
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ORCID iD</label>
                  <input
                    className="form-input"
                    placeholder="0000-0002-..."
                    value={form.orcid}
                    onChange={(e) => setForm({ ...form, orcid: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving Changes…" : "Save Profile Details"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
