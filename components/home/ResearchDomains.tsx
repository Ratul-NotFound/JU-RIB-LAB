"use client";

import { useState } from "react";
import Link from "next/link";

const DOMAINS = [
  {
    id: "genomics",
    icon: "🧬",
    title: "Plant & Agricultural Genomics",
    subtitle: "Climate-Resilient Crops & Food Security",
    desc: "Deciphering the genetic architecture of indigenous Bangladesh rice, jute, and pulse varieties. Utilizing RNA-seq transcriptomics and GWAS to identify stress-inducible promoters, drought-responsive transcription factors, and salinity-tolerance loci.",
    projects: ["Genomics of Local Saline-Tolerant Rice Landraces", "Jute Fiber Quality Marker Discovery"],
    metrics: ["18+ Cultivars Sequenced", "4 Novel Stress Regulators Identified"],
    equipment: ["Illumina NovaSeq", "Bio-Rad ddPCR", "Plant Growth Chambers"],
  },
  {
    id: "molecular",
    icon: "🔬",
    title: "Molecular Diagnostics & Human Genetics",
    subtitle: "Precision Disease Markers & Therapeutics",
    desc: "Investigating genetic variants associated with metabolic disorders, cardiovascular diseases, and hereditary cancers in the Bangladeshi population. Developing low-cost multiplex PCR and isothermal LAMP molecular diagnostic assays.",
    projects: ["Type-2 Diabetes Genetic Risk Allele Profiling", "Multiplex Isothermal LAMP Assay for Dengue & Chikungunya"],
    metrics: ["1,400+ Patient Cohort Samples", "3 Diagnostic Primer Sets Validated"],
    equipment: ["Roche LightCycler 480", "High-Resolution Melting (HRM)"],
  },
  {
    id: "microbial",
    icon: "🧫",
    title: "Microbial Biotechnology & Bioremediation",
    subtitle: "Environmental Cleanup & Industrial Enzymes",
    desc: "Screening indigenous extremophiles, textile-effluent degrading bacteria, and mangrove metagenomes. Engineering industrial enzymes (cellulases, proteases, chitinases) and microbial bio-fertilizers for sustainable agriculture.",
    projects: ["Bioremediation of Tannery & Textile Dye Effluents", "Marine Metagenome Secondary Metabolite Mining"],
    metrics: ["420+ Bacterial Strains Banked", "5 Commercial Enzymes Characterized"],
    equipment: ["Eppendorf BioFlo 320 Bioreactor", "Gas Chromatography-MS"],
  },
  {
    id: "bioinfo",
    icon: "💻",
    title: "Computational Biology & Structural Bioinformatics",
    subtitle: "In-Silico Drug Design & Protein Dynamics",
    desc: "High-performance molecular dynamics simulations, AlphaFold structural modeling, reverse vaccinology, and deep-learning prediction of protein-ligand interactions for drug discovery against emerging viral and multidrug-resistant bacterial pathogens.",
    projects: ["Virtual Screening of Phytocompounds against SARS-CoV-2", "Pan-Genome Analysis of Vibrio cholerae"],
    metrics: ["24+ Published In-Silico Pipelines", "8 Protein Target PDB Submissions"],
    equipment: ["NVIDIA GPU HPC Cluster", "GROMACS / AutoDock Vina Suite"],
  },
];

export default function ResearchDomains() {
  const [activeId, setActiveId] = useState(DOMAINS[0].id);
  const activeDomain = DOMAINS.find((d) => d.id === activeId) || DOMAINS[0];

  return (
    <section className="section" style={{ background: "var(--color-bg)" }}>
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Scientific Frontiers</div>
          <h2 className="section-title">Core Research Domains</h2>
          <p className="section-subtitle">
            Pioneering interdisciplinary research tackling national challenges in agriculture, human health, environmental sustainability, and computational life sciences.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "var(--space-8)", alignItems: "stretch" }}>
          {/* Domain Selection Tabs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {DOMAINS.map((d) => {
              const isSelected = d.id === activeId;
              return (
                <div
                  key={d.id}
                  onClick={() => setActiveId(d.id)}
                  style={{
                    padding: "var(--space-5)",
                    borderRadius: "var(--radius-xl)",
                    background: isSelected ? "var(--color-surface)" : "var(--color-surface-2)",
                    border: isSelected ? "2px solid var(--color-accent)" : "1.5px solid var(--color-border)",
                    boxShadow: isSelected ? "var(--shadow-md)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-4)",
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "var(--radius-lg)",
                      background: isSelected ? "var(--color-accent-subtle)" : "var(--color-surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.6rem",
                      flexShrink: 0,
                    }}
                  >
                    {d.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: 2 }}>
                      {d.title}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                      {d.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Domain Detailed Card */}
          <div
            className="card card-body"
            style={{
              padding: "var(--space-8)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "var(--color-surface)",
              border: "1.5px solid var(--color-border)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "var(--space-4)" }}>
                <span style={{ fontSize: "2.5rem" }}>{activeDomain.icon}</span>
                <div>
                  <span className="badge badge-accent" style={{ marginBottom: 4 }}>RESEARCH PILLAR</span>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-secondary)" }}>
                    {activeDomain.title}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: "1rem", color: "var(--color-text-2)", lineHeight: 1.7, marginBottom: "var(--space-6)" }}>
                {activeDomain.desc}
              </p>

              {/* Ongoing Projects in this Domain */}
              <div style={{ marginBottom: "var(--space-6)" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
                  Featured Key Initiatives
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                  {activeDomain.projects.map((p) => (
                    <div key={p} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "var(--color-secondary)", fontWeight: 500 }}>
                      <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>➔</span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics & Equipment Pills */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
                <div style={{ background: "var(--color-surface-2)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600, marginBottom: 4 }}>MILESTONES</div>
                  {activeDomain.metrics.map((m) => (
                    <div key={m} style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-secondary)" }}>{m}</div>
                  ))}
                </div>
                <div style={{ background: "var(--color-surface-2)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600, marginBottom: 4 }}>CORE HARDWARE</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)" }}>
                    {activeDomain.equipment.join(" · ")}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-4)" }}>
              <Link href="/research" className="btn btn-primary">
                Explore Research Publications →
              </Link>
              <Link href="/projects" className="btn btn-outline">
                View Ongoing Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
