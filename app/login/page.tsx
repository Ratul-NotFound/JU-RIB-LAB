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
      background: "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary-dark) 60%, var(--color-primary) 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      padding: "var(--space-6)",
    }}>
      {/* BG decoration */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,200,150,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,150,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div style={{
        position: "absolute", top: "20%", right: "10%",
        width: 300, height: 300,
        background: "radial-gradient(circle, rgba(0,200,150,0.15), transparent 70%)",
        borderRadius: "50%",
      }} />

      <div style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderRadius: "var(--radius-2xl)",
        padding: "var(--space-10)",
        width: "100%", maxWidth: 440,
        boxShadow: "var(--shadow-xl)",
        position: "relative", zIndex: 1,
        animation: "slideUp 0.3s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <div style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            borderRadius: "var(--radius-lg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", margin: "0 auto var(--space-4)",
          }}>
            🧬
          </div>
          <h1 style={{ fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "var(--space-1)" }}>
            Sign In to BTIB Lab
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Welcome back! Please enter your credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="form-input"
              placeholder="your@email.com"
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
              borderRadius: "var(--radius-md)",
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
            style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)", padding: "var(--space-4)" }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
          <Link href="/" style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
