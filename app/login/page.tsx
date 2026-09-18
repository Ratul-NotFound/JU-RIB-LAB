"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-secondary)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "var(--space-6)",
    }}>
      <div style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-10)",
        width: "100%", maxWidth: 440,
        border: "1px solid var(--color-border)",
      }}>
        {/* Institutional seal */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <div style={{
            width: 48, height: 48,
            background: "var(--color-primary)",
            borderRadius: "var(--radius-sm)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.9rem", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#FFFFFF",
            margin: "0 auto var(--space-4)",
          }}>
            BTIB
          </div>
          <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>
            Academic Access Portal
          </div>
          <h1 style={{ fontSize: "1.35rem", fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "var(--space-1)" }}>
            Bioresources Technology Lab
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Jahangirnagar University · Department of BGE
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">University Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="form-input"
              placeholder="user@juniv.edu"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div style={{
              background: "#FEE2E2", color: "#991B1B",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              border: "1px solid #FECACA",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            id="login-btn"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)", padding: "var(--space-3)" }}
          >
            {loading ? "Authenticating…" : "Authenticate →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
          <Link href="/" style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
            ← Return to Lab Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
