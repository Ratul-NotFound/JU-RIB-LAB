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
            <div data-reveal="left">
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
            <div
              data-reveal="right"
              style={{
                position: "relative",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                minHeight: 320,
              }}
            >
              <img
                src="/images/hero-lab.jpg"
                alt="Bioresources Technology and Industrial Biotechnology Laboratory Facility"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  minHeight: 320,
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "rgba(15, 23, 42, 0.85)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "var(--space-6)",
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-sm)",
                  color: "#FFFFFF",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  width: "fit-content",
                  marginBottom: "var(--space-2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  <span style={{ width: 6, height: 6, background: "var(--color-accent-light)", display: "inline-block" }} />
                  BTIB Central Laboratory
                </div>
                <div style={{ color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.4 }}>
                  Advancing bioresources utilization &amp; industrial biotechnology
                </div>
                <div style={{ color: "#94A3B8", fontSize: "0.8rem", marginTop: 4 }}>
                  Jahangirnagar University · Savar, Dhaka
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="section-sm" style={{ background: "#FFFFFF", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <div className="grid-2 reveal-stagger" style={{ gap: "var(--space-6)" }}>
            <div className="card" style={{
              background: "var(--color-bg)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--space-8)",
              border: "1px solid var(--color-border)",
            }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-primary)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
                Institutional Objective
              </div>
              <h3 style={{ color: "var(--color-secondary)", fontSize: "1.3rem", fontWeight: 800, marginBottom: "var(--space-3)" }}>
                Our Vision
              </h3>
              <p style={{ color: "var(--color-text-2)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                {settings?.vision ?? "To be a globally recognized center of excellence in biotechnology and genetic engineering, driving scientific breakthroughs that improve lives and sustain our planet."}
              </p>
            </div>
            <div className="card" style={{
              background: "var(--color-bg)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--space-8)",
              border: "1px solid var(--color-border)",
            }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-primary)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
                Scientific Mandate
              </div>
              <h3 style={{ color: "var(--color-secondary)", fontSize: "1.3rem", fontWeight: 800, marginBottom: "var(--space-3)" }}>
                Our Mission
              </h3>
              <p style={{ color: "var(--color-text-2)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                {settings?.mission ?? "To foster cutting-edge research, develop skilled scientists, and translate scientific discoveries into solutions that benefit society through innovation, education, and collaboration."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section">
        <div className="container">
          <div className="section-header" data-reveal="fade">
            <div className="section-eyebrow">Our Journey</div>
            <h2 className="section-title">Key Milestones</h2>
          </div>
          <div className="timeline-container">
            <div className="timeline-line" />
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={`timeline-item ${i % 2 === 0 ? "even" : "odd"}`} data-reveal="scale">
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
          <div className="section-header" data-reveal="fade">
            <div className="section-eyebrow">Infrastructure</div>
            <h2 className="section-title">Lab Facilities</h2>
          </div>
          <div className="grid-3 reveal-stagger">
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
