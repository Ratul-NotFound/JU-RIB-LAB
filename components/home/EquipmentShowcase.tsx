"use client";

import { useState } from "react";

const INSTRUMENTS = [
  {
    id: "ngs",
    name: "Illumina NovaSeq 6000 & NextSeq 550",
    category: "High-Throughput Genomics",
    icon: "🧬",
    specs: "Up to 6 Tb throughput, dual flow-cell capability, 20 billion reads/run",
    applications: "Whole genome resequencing, RNA-seq transcriptomics, metagenomics, epigenetic methylation mapping.",
    status: "Active Sequencing Batch #814",
    temp: "18.5°C Chamber",
  },
  {
    id: "ddpcr",
    name: "Bio-Rad QX200 Droplet Digital PCR System",
    category: "Absolute Nucleic Acid Quantification",
    icon: "🧪",
    specs: "20,000 nanoliter droplets/well, single-copy detection limit, EvaGreen & probe chemistry",
    applications: "Rare mutation detection, copy number variation (CNV), viral load quantification, GMO screening.",
    status: "Calibrated & Operational",
    temp: "4.0°C Reagent Bay",
  },
  {
    id: "hplc",
    name: "Agilent 1290 Infinity II LC / 6545 Q-TOF MS",
    category: "Proteomics & Metabolomics",
    icon: "⚗️",
    specs: "Sub-ppm mass accuracy, 50,000 resolution, ultra-high pressure (1300 bar)",
    applications: "Natural product secondary metabolite isolation, peptide sequencing, pharmacokinetic profiling.",
    status: "Standby / Method Ready",
    temp: "35.0°C Column Oven",
  },
  {
    id: "confocal",
    name: "Leica TCS SP8 Laser Scanning Confocal Microscope",
    category: "Advanced Cellular Imaging",
    icon: "🔬",
    specs: "4 Laser lines (405, 488, 561, 633 nm), resonant scanner 8000 Hz, Hybrid (HyD) detectors",
    applications: "Live-cell imaging, 3D z-stack reconstruction, subcellular protein colocalization, FRAP/FRET.",
    status: "Laser Calibrated",
    temp: "22.0°C Cleanroom",
  },
  {
    id: "bioreactor",
    name: "Eppendorf BioFlo 320 Automated Bioprocess System",
    category: "Industrial Microbiology & Fermentation",
    icon: "🧫",
    specs: "5L & 14L autoclavable vessels, DO / pH / redox digital cascades, mass flow controllers",
    applications: "Recombinant enzyme production, microbial biomass scale-up, bioethanol optimization.",
    status: "Fermentation in Progress (37°C)",
    temp: "37.0°C Cultivation",
  },
  {
    id: "cryo",
    name: "Thermo Scientific Herafreeze -86°C Ultra-Low Freezers",
    category: "Cryogenic Biorepository",
    icon: "❄️",
    specs: "Dual-compressor redundancy, liquid CO2 emergency backup, 24/7 cloud temperature logging",
    applications: "Preservation of indigenous Bangladesh germplasm, bacterial culture banks, clinical tissue samples.",
    status: "-85.8°C Monitored",
    temp: "-85.8°C Core",
  },
];

export default function EquipmentShowcase() {
  const [selectedId, setSelectedId] = useState(INSTRUMENTS[0].id);
  const activeItem = INSTRUMENTS.find((i) => i.id === selectedId) || INSTRUMENTS[0];

  return (
    <section className="section" style={{ background: "var(--color-surface-2)" }}>
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Laboratory Infrastructure</div>
          <h2 className="section-title">World-Class Scientific Instrumentation</h2>
          <p className="section-subtitle">
            Our department is equipped with industry-standard analytical instruments enabling high-precision molecular biology, genomics, and bioprocessing research.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: "var(--space-8)",
            alignItems: "stretch",
          }}
        >
          {/* Left Instrument Selector List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {INSTRUMENTS.map((inst) => {
              const isSelected = inst.id === selectedId;
              return (
                <div
                  key={inst.id}
                  onClick={() => setSelectedId(inst.id)}
                  style={{
                    padding: "var(--space-4) var(--space-5)",
                    borderRadius: "var(--radius-xl)",
                    background: isSelected ? "var(--color-surface)" : "transparent",
                    border: isSelected ? "1.5px solid var(--color-accent)" : "1.5px solid var(--color-border)",
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
                      width: 44,
                      height: 44,
                      borderRadius: "var(--radius-lg)",
                      background: isSelected ? "var(--color-accent-subtle)" : "var(--color-surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      flexShrink: 0,
                    }}
                  >
                    {inst.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-accent)", fontWeight: 700, textTransform: "uppercase" }}>
                      {inst.category}
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-secondary)" }}>
                      {inst.name}
                    </div>
                  </div>
                  <div style={{ color: isSelected ? "var(--color-accent)" : "var(--color-text-faint)", fontSize: "1.1rem" }}>
                    →
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Selected Instrument High-Tech Specs Card */}
          <div
            style={{
              background: "linear-gradient(145deg, #0A2230 0%, #06151E 100%)",
              borderRadius: "var(--radius-2xl)",
              border: "1px solid rgba(0, 240, 200, 0.25)",
              padding: "var(--space-8)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background watermark */}
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                fontSize: "12rem",
                opacity: 0.05,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {activeItem.icon}
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <span
                  style={{
                    background: "rgba(0, 240, 180, 0.2)",
                    color: "var(--color-accent)",
                    padding: "4px 12px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {activeItem.category}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#00E599", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E599", display: "inline-block" }} />
                  {activeItem.status}
                </span>
              </div>

              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "var(--space-3)", color: "white" }}>
                {activeItem.name}
              </h3>

              <div
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                  marginBottom: "var(--space-5)",
                }}
              >
                <div style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.5)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
                  TECHNICAL SPECIFICATIONS
                </div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6 }}>
                  {activeItem.specs}
                </div>
              </div>

              <div style={{ marginBottom: "var(--space-6)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-accent)", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
                  Key Laboratory Applications
                </div>
                <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.6 }}>
                  {activeItem.applications}
                </p>
              </div>
            </div>

            {/* Bottom Status Gauge */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--space-4)",
                paddingTop: "var(--space-4)",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.5)", fontFamily: "var(--font-mono)" }}>CHAMBER / SENSOR</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#00F0FF", fontFamily: "var(--font-mono)" }}>
                  {activeItem.temp}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.5)", fontFamily: "var(--font-mono)" }}>OPERATIONAL INTEGRITY</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#00E599", fontFamily: "var(--font-mono)" }}>
                  ISO 17025 / GLP Certified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
