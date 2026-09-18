"use client";

import { useState } from "react";
import type { Metadata } from "next";

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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "var(--space-12)", alignItems: "start" }}>
            {/* Contact info */}
            <div>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-6)" }}>Lab Information</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                {[
                  { icon: "📍", label: "Address", val: "Department of Biotechnology & Genetic Engineering, Jahangirnagar University, Savar, Dhaka-1342, Bangladesh" },
                  { icon: "✉️", label: "Email", val: "bge@juniv.edu" },
                  { icon: "📞", label: "Phone", val: "+880 2 7791045" },
                  { icon: "🕘", label: "Office Hours", val: "Sunday–Thursday: 9:00 AM – 5:00 PM" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "var(--radius-md)",
                      background: "var(--color-accent-subtle)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.3rem", flexShrink: 0,
                    }}>
                      {item.icon}
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
                height: 200,
                background: "linear-gradient(135deg, var(--color-surface-3), var(--color-accent-subtle))",
                borderRadius: "var(--radius-xl)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid var(--color-border)",
                flexDirection: "column", gap: "var(--space-2)",
              }}>
                <div style={{ fontSize: "2rem" }}>🗺️</div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                  Jahangirnagar University, Savar
                </div>
                <a
                  href="https://maps.google.com/?q=Jahangirnagar+University+Savar+Dhaka"
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div className="card card-body" style={{ padding: "var(--space-8)" }}>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-6)" }}>Send a Message</h2>
              {status === "sent" ? (
                <div style={{
                  textAlign: "center", padding: "var(--space-12) var(--space-8)",
                  background: "var(--color-accent-subtle)", borderRadius: "var(--radius-xl)",
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>✅</div>
                  <h3 style={{ color: "var(--color-primary)", marginBottom: "var(--space-2)" }}>Message Sent!</h3>
                  <p style={{ color: "var(--color-text-muted)" }}>We&apos;ll get back to you as soon as possible.</p>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: "var(--space-6)" }} onClick={() => setStatus("idle")}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                  <div className="grid-2" style={{ gap: "var(--space-4)" }}>
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Full Name *</label>
                      <input id="name" name="name" type="text" required className="form-input"
                        placeholder="Your name" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input id="email" name="email" type="email" required className="form-input"
                        placeholder="your@email.com" value={form.email} onChange={handleChange} />
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
