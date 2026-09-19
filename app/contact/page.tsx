"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire to an API route or email service
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <>
      <div className="page-header">
        <div className="container page-header-content">
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>Get In Touch</div>
          <h1 className="text-h1">Contact Us</h1>
          <p>Have a question or want to collaborate? We&apos;d love to hear from you.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="split-contact">
            {/* Contact info */}
            <div data-reveal="left">
              <h2 className="text-h3" style={{ marginBottom: "var(--space-6)" }}>Laboratory Directory & Facilities</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                {[
                  { tag: "LOCATION", label: "Postal & Physical Address", val: "Bioresources Technology & Industrial Biotechnology Laboratory, Department of Biotechnology & Genetic Engineering, Jahangirnagar University, Savar, Dhaka-1342, Bangladesh" },
                  { tag: "EMAIL", label: "Official Inquiry Mailbox", val: "bge@juniv.edu" },
                  { tag: "TEL", label: "Department PBX", val: "+880 2 7791045" },
                  { tag: "HOURS", label: "Laboratory Operational Hours", val: "Sunday – Thursday: 08:30 – 17:00 BST" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
                    <div style={{
                      width: 48, height: 32, borderRadius: "var(--radius-sm)",
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.65rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-primary)", flexShrink: 0,
                    }}>
                      {item.tag}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", marginBottom: 2 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--color-text-2)", lineHeight: 1.5 }}>
                        {item.val}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div style={{
                marginTop: "var(--space-8)",
                padding: "var(--space-6)",
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                display: "flex", flexDirection: "column", gap: "var(--space-3)",
              }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-secondary)" }}>
                  Campus Geolocation Coordinates
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                  23.8824° N, 90.2671° E · Savar, Dhaka-1342
                </div>
                <div>
                  <a
                    href="https://maps.google.com/?q=Jahangirnagar+University+Savar+Dhaka"
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div data-reveal="right" className="card card-body" style={{ padding: "var(--space-8)" }}>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-6)" }}>Direct Scientific Inquiry</h2>
              {status === "sent" ? (
                <div style={{
                  textAlign: "center", padding: "var(--space-12) var(--space-8)",
                  background: "var(--color-surface-2)", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                }}>
                  <h3 style={{ color: "var(--color-primary)", marginBottom: "var(--space-2)" }}>Inquiry Transmitted</h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Our departmental team will review your message and respond shortly.</p>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: "var(--space-6)" }} onClick={() => setStatus("idle")}>
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                  <div className="grid-form-2">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Full Name *</label>
                      <input id="name" name="name" type="text" required className="form-input"
                        placeholder="Dr. / Prof. / Scholar" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Institutional Email *</label>
                      <input id="email" name="email" type="email" required className="form-input"
                        placeholder="academic@institution.edu" value={form.email} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject *</label>
                    <select id="subject" name="subject" required className="form-select" value={form.subject} onChange={handleChange}>
                      <option value="">Select a subject…</option>
                      <option value="research">Research Collaboration</option>
                      <option value="admission">Student Admission</option>
                      <option value="visit">Lab Visit</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message *</label>
                    <textarea id="message" name="message" required className="form-textarea"
                      placeholder="Write your message here…" rows={6} value={form.message} onChange={handleChange} />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={status === "sending"}
                    style={{ width: "100%", justifyContent: "center" }}
                    id="contact-submit-btn"
                  >
                    {status === "sending" ? "Sending…" : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
