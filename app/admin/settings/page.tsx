"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    labName: "", university: "", tagline: "", about: "", vision: "", mission: "",
    address: "", email: "", phone: "", foundedYear: "", facebookUrl: "", twitterUrl: "", linkedinUrl: "", youtubeUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        setForm({
          labName: data.labName ?? "", university: data.university ?? "",
          tagline: data.tagline ?? "", about: data.about ?? "",
          vision: data.vision ?? "", mission: data.mission ?? "",
          address: data.address ?? "", email: data.email ?? "",
          phone: data.phone ?? "", foundedYear: data.foundedYear?.toString() ?? "",
          facebookUrl: data.facebookUrl ?? "", twitterUrl: data.twitterUrl ?? "",
          linkedinUrl: data.linkedinUrl ?? "", youtubeUrl: data.youtubeUrl ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, foundedYear: form.foundedYear ? parseInt(form.foundedYear) : null }) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="dashboard-content" style={{ textAlign: "center", color: "var(--color-text-muted)" }}>Loading settings…</div>;

  return (
    <div className="dashboard-content">
      <div style={{ marginBottom: "var(--space-8)" }}>
        <div className="page-title">Lab Settings</div>
        <div className="page-subtitle">Configure your lab website information</div>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: 800 }}>
        {/* Basic Info */}
        <div className="card card-body">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "var(--space-5)", color: "var(--color-secondary)" }}>🏷️ Basic Information</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div className="grid-form-2">
              <div className="form-group"><label className="form-label">Lab Name</label><input className="form-input" value={form.labName} onChange={e => setForm({ ...form, labName: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">University</label><input className="form-input" value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} /></div>
            </div>
            <div className="form-group"><label className="form-label">Tagline (hero subtitle)</label><input className="form-input" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">About (long description)</label><textarea className="form-textarea" rows={4} value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} /></div>
            <div className="grid-form-2">
              <div className="form-group"><label className="form-label">Vision</label><textarea className="form-textarea" rows={3} value={form.vision} onChange={e => setForm({ ...form, vision: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Mission</label><textarea className="form-textarea" rows={3} value={form.mission} onChange={e => setForm({ ...form, mission: e.target.value })} /></div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card card-body">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "var(--space-5)", color: "var(--color-secondary)" }}>📞 Contact Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <div className="grid-form-3">
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Founded Year</label><input type="number" className="form-input" value={form.foundedYear} onChange={e => setForm({ ...form, foundedYear: e.target.value })} /></div>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="card card-body">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "var(--space-5)", color: "var(--color-secondary)" }}>🔗 Social Media</h3>
          <div className="grid-form-2">
            <div className="form-group"><label className="form-label">Facebook URL</label><input className="form-input" placeholder="https://facebook.com/…" value={form.facebookUrl} onChange={e => setForm({ ...form, facebookUrl: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Twitter/X URL</label><input className="form-input" placeholder="https://twitter.com/…" value={form.twitterUrl} onChange={e => setForm({ ...form, twitterUrl: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">LinkedIn URL</label><input className="form-input" placeholder="https://linkedin.com/…" value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">YouTube URL</label><input className="form-input" placeholder="https://youtube.com/…" value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} /></div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <button type="submit" className="btn btn-primary btn-lg" id="save-settings-btn" disabled={saving}>
            {saving ? "Saving…" : "💾 Save Settings"}
          </button>
          {saved && <span style={{ color: "var(--color-success)", fontWeight: 600 }}>✅ Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}
