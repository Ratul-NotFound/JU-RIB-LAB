import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "About the Lab",
  description: "Learn about the history, vision, mission, and facilities of the Bioresources Technology and Industrial Biotechnology Laboratory at Jahangirnagar University.",
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
          <div className="split-2-col">
            <div>
              <div className="highlight-bar" />
              <h2 className="text-h2" style={{ marginBottom: "var(--space-5)" }}>Who We Are</h2>
              <div style={{ fontSize: "1.05rem", color: "var(--color-text-2)", lineHeight: 1.8 }}>
                {settings?.about ? (
                  <p>{settings.about}</p>
                ) : (
                  <>
                    <p style={{ marginBottom: "var(--space-4)" }}>
                      The Bioresources Technology and Industrial Biotechnology Laboratory at Jahangirnagar University is one of
                      Bangladesh&apos;s leading research centers dedicated to advancing research in bioresources utilization, bioprocess engineering, and sustainable industrial biotechnology.
                    </p>
                    <p style={{ marginBottom: "var(--space-4)" }}>
                      Our interdisciplinary team of faculty, researchers, and students work together on projects
                      spanning genomics, molecular biology, bioprocesses, and bioinformatics.
                    </p>
                    <p>
                      We are committed to producing world-class research that addresses real challenges in bioresources,
                      agriculture, health, and environmental sustainability.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div style={{
              position: "relative",
              borderRadius: "var(--radius-2xl)",
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-xl)",
              minHeight: 320,
            }}>
              <img
                src="/images/hero-lab.jpg"
                alt="Bioresources Technology and Industrial Biotechnology Laboratory Facility"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  minHeight: 320,
                }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(10, 26, 47, 0.85) 0%, rgba(10, 26, 47, 0.2) 60%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "var(--space-6)",
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  color: "#ffffff",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  width: "fit-content",
                  marginBottom: "var(--space-2)",
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent-light)", display: "inline-block" }} />
                  BTIB Central Laboratory
                </div>
                <div style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.4 }}>
                  Advancing life sciences through innovation &amp; bioresources engineering
                </div>
                <div style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.8rem", marginTop: 4 }}>
                  Jahangirnagar University · Savar, Dhaka
                </div>
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
          <div className="timeline-container">
            <div className="timeline-line" />
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={`timeline-item ${i % 2 === 0 ? "even" : "odd"}`}>
                <div className="timeline-content">
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-accent)" }}>{m.year}</div>
                  <div style={{ fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-1)" }}>{m.title}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{m.desc}</div>
                </div>
                <div className="timeline-dot" />
                <div className="timeline-spacer" />
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
              { icon: "🌿", title: "Photobioreactor & Algae Unit", desc: "State-of-the-art microalgae cultivation systems and 'Liquid-Tree' urban carbon capture prototypes." },
              { icon: "⚙️", title: "Microbial Fermentation Suite", desc: "Benchtop biofermenters for batch, fed-batch, and solid-state microbial production." },
              { icon: "🔬", title: "Bioprocess & Separation Lab", desc: "High-speed refrigerated centrifugation, cross-flow filtration, and protein purification units." },
              { icon: "🧪", title: "Enzyme Engineering Facility", desc: "UV-Vis spectrophotometry, gel electrophoresis, and kinetic biocatalysis workstations." },
              { icon: "💻", title: "Computational Biology Cluster", desc: "Dedicated workstations for molecular docking, MD simulations, and multi-omics analysis." },
              { icon: "♻️", title: "Biomaterials Processing Center", desc: "Facilities for agro-waste extraction, biopolymer synthesis, and sustainable bioplastics." },
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
