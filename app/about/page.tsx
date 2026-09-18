import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "About the Lab",
  description: "Learn about the history, vision, mission, and facilities of the BGE Lab at Jahangirnagar University.",
};

async function getSettings() {
  try {
    return await prisma.labSettings.findUnique({ where: { id: "singleton" } });
  } catch {
    return null;
  }
}

const MILESTONES = [
  { year: "1990", title: "Lab Founded", desc: "Established as a pioneering research laboratory at Jahangirnagar University." },
  { year: "2000", title: "First Major Grant", desc: "Received national research funding for genomics studies." },
  { year: "2010", title: "International Collaboration", desc: "Partnered with leading global research institutions." },
  { year: "2015", title: "Genomics Center Opened", desc: "Inaugurated state-of-the-art next-generation sequencing facility." },
  { year: "2020", title: "100+ Publications", desc: "Crossed milestone of 100 peer-reviewed publications." },
  { year: "2024", title: "Digital Lab Launch", desc: "Launched this comprehensive digital presence for the lab." },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <div className="page-header">
        <div className="container page-header-content">
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>About Us</div>
          <h1 className="text-h1">About the Lab</h1>
          <p>{settings?.university ?? "Jahangirnagar University"} — Department of Biotechnology &amp; Genetic Engineering</p>
        </div>
      </div>

      {/* ── About Text ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-16)", alignItems: "center" }}>
            <div>
              <div className="highlight-bar" />
              <h2 className="text-h2" style={{ marginBottom: "var(--space-5)" }}>Who We Are</h2>
              <div style={{ fontSize: "1.05rem", color: "var(--color-text-2)", lineHeight: 1.8 }}>
                {settings?.about ? (
                  <p>{settings.about}</p>
                ) : (
                  <>
                    <p style={{ marginBottom: "var(--space-4)" }}>
                      The Biotechnology and Genetic Engineering Laboratory at Jahangirnagar University is one of
                      Bangladesh&apos;s leading research centers dedicated to advancing the frontiers of life sciences.
                    </p>
                    <p style={{ marginBottom: "var(--space-4)" }}>
                      Our interdisciplinary team of faculty, researchers, and students work together on projects
                      spanning genomics, molecular biology, agricultural biotechnology, and bioinformatics.
                    </p>
                    <p>
                      We are committed to producing world-class research that addresses real challenges in health,
                      agriculture, and environmental sustainability.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, var(--color-accent-subtle), var(--color-surface-3))",
              borderRadius: "var(--radius-2xl)",
              padding: "var(--space-10)",
              textAlign: "center",
              border: "1px solid var(--color-border)",
            }}>
              <div style={{ fontSize: "6rem", marginBottom: "var(--space-4)" }}>🧬</div>
              <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                Advancing life sciences through<br />
                <strong style={{ color: "var(--color-primary)" }}>innovation &amp; collaboration</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="section-sm" style={{ background: "var(--color-surface)" }}>
        <div className="container">
          <div className="grid-2">
            <div style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
              borderRadius: "var(--radius-xl)", padding: "var(--space-8)", color: "white",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>🎯</div>
              <h3 style={{ color: "white", fontSize: "1.3rem", fontWeight: 700, marginBottom: "var(--space-4)" }}>Our Vision</h3>
              <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
                {settings?.vision ?? "To be a globally recognized center of excellence in biotechnology and genetic engineering, driving scientific breakthroughs that improve lives and sustain our planet."}
              </p>
            </div>
            <div style={{
              background: "linear-gradient(135deg, var(--color-navy), var(--color-secondary))",
              borderRadius: "var(--radius-xl)", padding: "var(--space-8)", color: "white",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>🚀</div>
              <h3 style={{ color: "white", fontSize: "1.3rem", fontWeight: 700, marginBottom: "var(--space-4)" }}>Our Mission</h3>
              <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
                {settings?.mission ?? "To foster cutting-edge research, develop skilled scientists, and translate scientific discoveries into solutions that benefit society through innovation, education, and collaboration."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Our Journey</div>
            <h2 className="section-title">Key Milestones</h2>
          </div>
          <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0,
              width: 2, background: "var(--color-border)", transform: "translateX(-50%)",
            }} />
            {MILESTONES.map((m, i) => (
              <div key={m.year} style={{
                display: "flex",
                flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                gap: "var(--space-8)",
                marginBottom: "var(--space-8)",
                alignItems: "center",
              }}>
                <div style={{ flex: 1, textAlign: i % 2 === 0 ? "right" : "left" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-accent)" }}>{m.year}</div>
                  <div style={{ fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-1)" }}>{m.title}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{m.desc}</div>
                </div>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: "var(--color-accent)",
                  border: "3px solid var(--color-surface)",
                  boxShadow: "0 0 0 3px var(--color-accent)",
                  flexShrink: 0, zIndex: 1,
                }} />
                <div style={{ flex: 1 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Facilities ── */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Infrastructure</div>
            <h2 className="section-title">Lab Facilities</h2>
          </div>
          <div className="grid-3">
            {[
              { icon: "🧪", title: "Molecular Biology Lab", desc: "PCR machines, gel electrophoresis, and spectrophotometry equipment." },
              { icon: "🖥️", title: "Bioinformatics Suite", desc: "High-performance computing cluster for genomic data analysis." },
              { icon: "🔬", title: "Microscopy Center", desc: "Fluorescence, confocal, and electron microscopy facilities." },
              { icon: "🌡️", title: "Cell Culture Room", desc: "Sterile facilities for mammalian and bacterial cell culture." },
              { icon: "🧬", title: "Sequencing Unit", desc: "Next-generation DNA sequencing capabilities." },
              { icon: "📚", title: "Research Library", desc: "Comprehensive collection of journals and research databases." },
            ].map((f) => (
              <div key={f.title} className="card card-body">
                <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "var(--space-2)", color: "var(--color-secondary)" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
