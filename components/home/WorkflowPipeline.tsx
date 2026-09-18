"use client";

import { useState } from "react";

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Biological Sampling & Quality Control",
    tag: "Wet Lab Preparation",
    icon: "🌱",
    desc: "Ethical field collection of crop landraces, medicinal flora, and microbial consortia. High-molecular-weight DNA/RNA extraction with automated fluorometric NanoDrop & Qubit QC.",
    details: ["RIN > 8.0 RNA Quality", "Cryogenic Nitrogen Storage", "Sterile Biosafety Cabinet Type II"],
  },
  {
    step: "02",
    title: "High-Throughput Next-Gen Sequencing",
    tag: "Omics Core",
    icon: "🧬",
    desc: "Library preparation (Illumina TruSeq & Oxford Nanopore ultra-long reads) paired with deep coverage sequencing for de-novo assembly and variant calling.",
    details: ["30x WGS Coverage", "Paired-End 150bp Read Length", "Direct RNA Splicing Capture"],
  },
  {
    step: "03",
    title: "In-Silico Bioinformatic Analytics",
    tag: "Computational Biology",
    icon: "💻",
    desc: "Linux HPC cluster pipelines: differential transcriptome expression (DESeq2), molecular docking, AlphaFold protein folding predictions, and GWAS linkage mapping.",
    details: ["Phylogenetic Trees", "Binding Energy ΔG Modeling", "Genome-Wide Association (GWAS)"],
  },
  {
    step: "04",
    title: "CRISPR-Cas9 & Functional In-Vitro Validation",
    tag: "Genetic Engineering",
    icon: "🔬",
    desc: "Targeted sgRNA synthesis, plant tissue transformation via Agrobacterium tumefaciens, and Western Blot / qPCR confirmation of targeted gene expression.",
    details: ["Off-target Cleavage < 0.01%", "Tissue Culture Regeneration", "Enzyme Kinetic Assays"],
  },
  {
    step: "05",
    title: "Translational Bio-Solutions & Publications",
    tag: "Scientific Output",
    icon: "📄",
    desc: "Disseminating discoveries in peer-reviewed high-impact Q1 journals, filing biotechnological patents, and deploying resilient crop varieties to farmers.",
    details: ["Open-Access Data Repositories", "National Agro-tech Transfer", "Peer-Reviewed Publications"],
  },
];

export default function WorkflowPipeline() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="section" style={{ background: "var(--color-bg)" }}>
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Scientific Methodology</div>
          <h2 className="section-title">The Scientific Discovery Pipeline</h2>
          <p className="section-subtitle">
            From field sample to molecular discovery — our standardized five-stage pipeline ensures rigorous data integrity, reproducibility, and high translational value.
          </p>
        </div>

        {/* Steps Progress Ribbon */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "var(--space-3)",
            marginBottom: "var(--space-10)",
          }}
        >
          {PIPELINE_STEPS.map((s, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                style={{
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-xl)",
                  background: isActive ? "var(--color-primary)" : "var(--color-surface)",
                  color: isActive ? "white" : "var(--color-text)",
                  border: isActive ? "2px solid var(--color-accent)" : "1.5px solid var(--color-border)",
                  boxShadow: isActive ? "0 10px 25px rgba(10, 79, 60, 0.2)" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.25s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "110px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: isActive ? "var(--color-accent)" : "var(--color-text-muted)",
                    }}
                  >
                    {s.step}
                  </span>
                  <span style={{ fontSize: "1.2rem" }}>{s.icon}</span>
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    marginTop: "var(--space-2)",
                  }}
                >
                  {s.title.split("&")[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Showcase */}
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-2xl)",
            border: "1.5px solid var(--color-border)",
            padding: "var(--space-10)",
            boxShadow: "var(--shadow-lg)",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "var(--space-10)",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "var(--space-3)" }}>
              <span className="badge badge-accent">{PIPELINE_STEPS[activeStep].tag}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                PHASE {PIPELINE_STEPS[activeStep].step} OF 05
              </span>
            </div>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "var(--space-4)" }}>
              {PIPELINE_STEPS[activeStep].title}
            </h3>
            <p style={{ fontSize: "1.05rem", color: "var(--color-text-2)", lineHeight: 1.7, marginBottom: "var(--space-6)" }}>
              {PIPELINE_STEPS[activeStep].desc}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {PIPELINE_STEPS[activeStep].details.map((d) => (
                <div key={d} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "var(--color-accent)", fontWeight: 800, fontSize: "1.1rem" }}>✓</span>
                  <span style={{ fontWeight: 600, color: "var(--color-secondary)", fontSize: "0.95rem" }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-8)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "inset 0 0 30px rgba(0,0,0,0.3)",
              minHeight: "260px",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "var(--space-3)" }}>
              {PIPELINE_STEPS[activeStep].icon}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "4px" }}>
              PROTOCOL ASSURANCE
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, maxWidth: "260px" }}>
              Standard Operating Procedure #BGE-{PIPELINE_STEPS[activeStep].step}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
