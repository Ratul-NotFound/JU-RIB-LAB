"use client";

import { useState } from "react";

const PRESET_GENES = [
  {
    name: "INS (Human Insulin Precursor)",
    organism: "Homo sapiens",
    dna: "ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCTTTGTGAACCAACACCTGTGCGGCTCACACCTGGTGGAAGCTCTCTACCTAGTGTGCGGGGAACGAGGCTTCTTCTACACACCCAAGACCCGCCGG",
    role: "Endocrine regulation of carbohydrate and fat metabolism",
  },
  {
    name: "DREB1A (Drought-Response Transcription Factor)",
    organism: "Oryza sativa (Rice)",
    dna: "ATGGAAGTCAGGAGTGACGGCGTCCAGCTGGGGCTGCGGCGGACGAGCGGCAGCAGCGGCGCGGCGGCGTCCGACCCGGCGGCGGCCTCGGCGCGGAAGCCCGCCGGGCGGACCAAGTTCAAGGAGACGCGCCACCCCGTGTACCGCGGCGTCCGGCGCCGCAAC",
    role: "Abiotic stress adaptation, drought and salinity survival in indigenous crops",
  },
  {
    name: "SpCas9 Target Locus (EMX1 Gene)",
    organism: "Synthetic Target",
    dna: "GAGTCCGAGCAGAAGAAGAAGGGCTCCCATCACATCAACCGGTGGCGCATTGCCACGAAGCAGGCCAATGGGGAGGACATCGATGTCACCTCCAATGAC",
    role: "Precision genome editing guide target for gene disruption and knockout",
  },
];

// Codon table map
const CODON_MAP: Record<string, { aa: string; name: string; type: "hydrophobic" | "polar" | "charged_pos" | "charged_neg" | "stop" }> = {
  ATG: { aa: "M", name: "Met", type: "hydrophobic" },
  GCC: { aa: "A", name: "Ala", type: "hydrophobic" },
  CTG: { aa: "L", name: "Leu", type: "hydrophobic" },
  TGG: { aa: "W", name: "Trp", type: "hydrophobic" },
  CGC: { aa: "R", name: "Arg", type: "charged_pos" },
  CTC: { aa: "L", name: "Leu", type: "hydrophobic" },
  CCC: { aa: "P", name: "Pro", type: "hydrophobic" },
  GCG: { aa: "A", name: "Ala", type: "hydrophobic" },
  GGA: { aa: "G", name: "Gly", type: "polar" },
  CCT: { aa: "P", name: "Pro", type: "hydrophobic" },
  GAC: { aa: "D", name: "Asp", type: "charged_neg" },
  CCA: { aa: "P", name: "Pro", type: "hydrophobic" },
  CAG: { aa: "Q", name: "Gln", type: "polar" },
  TTT: { aa: "F", name: "Phe", type: "hydrophobic" },
  GTG: { aa: "V", name: "Val", type: "hydrophobic" },
  AAC: { aa: "N", name: "Asn", type: "polar" },
  CAA: { aa: "Q", name: "Gln", type: "polar" },
  CAC: { aa: "H", name: "His", type: "charged_pos" },
  TGC: { aa: "C", name: "Cys", type: "polar" },
  GGC: { aa: "G", name: "Gly", type: "polar" },
  TCA: { aa: "S", name: "Ser", type: "polar" },
  GAA: { aa: "E", name: "Glu", type: "charged_neg" },
  GCT: { aa: "A", name: "Ala", type: "hydrophobic" },
  TAT: { aa: "Y", name: "Tyr", type: "polar" },
  AGT: { aa: "S", name: "Ser", type: "polar" },
  GGG: { aa: "G", name: "Gly", type: "polar" },
  CGG: { aa: "R", name: "Arg", type: "charged_pos" },
  CTT: { aa: "L", name: "Leu", type: "hydrophobic" },
  TAC: { aa: "Y", name: "Tyr", type: "polar" },
  ACA: { aa: "T", name: "Thr", type: "polar" },
  AAG: { aa: "K", name: "Lys", type: "charged_pos" },
  ACC: { aa: "T", name: "Thr", type: "polar" },
};

const HEATMAP_DATA = [
  { gene: "OsDREB1", ctrl: 1.0, drought: 4.8, salt: 3.9, heat: 2.1, cold: 5.2 },
  { gene: "OsNAC6", ctrl: 1.0, drought: 3.4, salt: 4.1, heat: 1.8, cold: 2.9 },
  { gene: "OsWRKY45", ctrl: 1.0, drought: 2.2, salt: 1.9, heat: 3.7, cold: 1.4 },
  { gene: "OsAPX2", ctrl: 1.0, drought: 3.8, salt: 3.5, heat: 4.2, cold: 2.1 },
  { gene: "OsHSP70", ctrl: 1.0, drought: 1.5, salt: 1.8, heat: 6.9, cold: 1.2 },
  { gene: "OsLEA3", ctrl: 1.0, drought: 5.6, salt: 4.9, heat: 2.3, cold: 3.1 },
];

export default function BioWorkbench() {
  const [activeTab, setActiveTab] = useState<"dna" | "heatmap" | "microscope">("dna");
  const [selectedGeneIdx, setSelectedGeneIdx] = useState(0);
  const [channels, setChannels] = useState({ dapi: true, gfp: true, rfp: true });
  const [hoverHeatmap, setHoverHeatmap] = useState<{ gene: string; cond: string; val: number } | null>(null);

  const curGene = PRESET_GENES[selectedGeneIdx];

  // Transcribe & translate
  const codons: string[] = [];
  for (let i = 0; i < curGene.dna.length - 2; i += 3) {
    codons.push(curGene.dna.slice(i, i + 3));
  }

  const getHeatmapColor = (val: number) => {
    if (val <= 1.0) return "rgba(30, 58, 138, 0.5)"; // Low/Control - Navy/Blue
    if (val < 2.5) return "rgba(16, 185, 129, 0.6)"; // Medium - Emerald
    if (val < 4.5) return "rgba(245, 158, 11, 0.8)"; // High - Amber
    return "rgba(239, 68, 68, 0.9)"; // Extreme Induction - Red
  };

  return (
    <div
      style={{
        borderRadius: "var(--radius-2xl)",
        background: "linear-gradient(180deg, #091E2A 0%, #06151E 100%)",
        border: "1px solid rgba(0, 240, 200, 0.2)",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.4)",
        overflow: "hidden",
        color: "white",
      }}
    >
      {/* Workbench Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 24px",
          background: "rgba(0, 0, 0, 0.4)",
          borderBottom: "1px solid rgba(0, 240, 200, 0.15)",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, #00C896, #00F0FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            🔬
          </div>
          <div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
              Interactive Bio-Workbench & In-Silico Lab
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.55)", fontFamily: "var(--font-mono)" }}>
              Simulating Department of Biotechnology & Genetic Engineering Research Workflows
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "inline-flex",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "var(--radius-full)",
            padding: "4px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {[
            { id: "dna", label: "🧬 DNA Sequence & Codons" },
            { id: "heatmap", label: "📊 RNA-seq Heatmap" },
            { id: "microscope", label: "🔬 Fluorescence Optics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: activeTab === tab.id ? "var(--color-accent)" : "transparent",
                color: activeTab === tab.id ? "#041E17" : "rgba(255, 255, 255, 0.75)",
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: DNA Sequencer & Codon Translator */}
      {activeTab === "dna" && (
        <div style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--color-accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Target Genetic Locus
              </span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "2px" }}>{curGene.name}</h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.65)" }}>{curGene.role}</p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {PRESET_GENES.map((g, idx) => (
                <button
                  key={g.name}
                  onClick={() => setSelectedGeneIdx(idx)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--radius-md)",
                    border: selectedGeneIdx === idx ? "1px solid var(--color-accent)" : "1px solid rgba(255,255,255,0.15)",
                    background: selectedGeneIdx === idx ? "rgba(0, 200, 150, 0.15)" : "rgba(0,0,0,0.3)",
                    color: selectedGeneIdx === idx ? "#00E599" : "rgba(255,255,255,0.7)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Sample #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* DNA Strand Track */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.5)", marginBottom: "6px" }}>
              SENSE STRAND 5' ➔ 3' ({curGene.dna.length} bp)
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                background: "rgba(0, 0, 0, 0.4)",
                padding: "14px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                maxHeight: "130px",
                overflowY: "auto",
              }}
            >
              {curGene.dna.split("").map((base, i) => {
                const color =
                  base === "A" ? "#00F0FF" : base === "T" ? "#FF5F56" : base === "G" ? "#00E599" : "#FFBD2E";
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      width: "16px",
                      textAlign: "center",
                      color: color,
                      fontWeight: 700,
                    }}
                  >
                    {base}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Translated Codons & Amino Acid Residue Chain */}
          <div>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.5)", marginBottom: "6px" }}>
              IN-SILICO TRANSLATION (PROTEIN PRIMARY STRUCTURE)
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: "10px",
              }}
            >
              {codons.slice(0, 18).map((triplet, i) => {
                const mapped = CODON_MAP[triplet] || { aa: "X", name: triplet, type: "polar" };
                const bg =
                  mapped.type === "hydrophobic"
                    ? "rgba(59, 130, 246, 0.25)"
                    : mapped.type === "charged_pos"
                    ? "rgba(16, 185, 129, 0.25)"
                    : mapped.type === "charged_neg"
                    ? "rgba(239, 68, 68, 0.25)"
                    : "rgba(245, 158, 11, 0.25)";

                const border =
                  mapped.type === "hydrophobic"
                    ? "#3B82F6"
                    : mapped.type === "charged_pos"
                    ? "#10B981"
                    : mapped.type === "charged_neg"
                    ? "#EF4444"
                    : "#F59E0B";

                return (
                  <div
                    key={i}
                    style={{
                      flexShrink: 0,
                      background: bg,
                      border: `1px solid ${border}`,
                      borderRadius: "var(--radius-md)",
                      padding: "8px 12px",
                      textAlign: "center",
                      minWidth: "54px",
                    }}
                  >
                    <div style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.6)" }}>
                      {triplet}
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", marginTop: "2px" }}>
                      {mapped.aa}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.8)", fontWeight: 600 }}>
                      {mapped.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: RNA-seq Heatmap */}
      {activeTab === "heatmap" && (
        <div style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Differential Gene Expression Profile (log2 Fold Change)</h3>
              <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.6)" }}>
                RNA-seq transcriptome data from indigenous Bangladesh stress-tolerant cultivars
              </p>
            </div>
            {hoverHeatmap && (
              <div
                style={{
                  background: "rgba(0, 240, 200, 0.15)",
                  border: "1px solid rgba(0, 240, 200, 0.4)",
                  borderRadius: "var(--radius-md)",
                  padding: "6px 14px",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <strong>{hoverHeatmap.gene}</strong> in {hoverHeatmap.cond}: <span style={{ color: "#00E599" }}>{hoverHeatmap.val}x Fold Change</span>
              </div>
            )}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "6px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>GENE</th>
                  {["Control", "Drought", "Salinity 150mM", "Heat Shock 42°C", "Cold Shock 4°C"].map((c) => (
                    <th key={c} style={{ textAlign: "center", padding: "8px", fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEATMAP_DATA.map((row) => (
                  <tr key={row.gene}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.85rem", color: "#00F0FF", padding: "6px 10px" }}>
                      {row.gene}
                    </td>
                    {[
                      { cond: "Control", val: row.ctrl },
                      { cond: "Drought", val: row.drought },
                      { cond: "Salinity", val: row.salt },
                      { cond: "Heat", val: row.heat },
                      { cond: "Cold", val: row.cold },
                    ].map((cell, idx) => (
                      <td
                        key={idx}
                        onMouseEnter={() => setHoverHeatmap({ gene: row.gene, cond: cell.cond, val: cell.val })}
                        onMouseLeave={() => setHoverHeatmap(null)}
                        style={{
                          background: getHeatmapColor(cell.val),
                          borderRadius: "var(--radius-sm)",
                          textAlign: "center",
                          padding: "10px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "transform 0.15s ease",
                        }}
                      >
                        +{cell.val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Color bar legend */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>Basal Expression (1.0x)</span>
            <div
              style={{
                width: 140,
                height: 10,
                borderRadius: 5,
                background: "linear-gradient(90deg, rgba(30, 58, 138, 0.8), rgba(16, 185, 129, 0.8), rgba(245, 158, 11, 0.9), rgba(239, 68, 68, 1))",
              }}
            />
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>Overexpressed (7.0x)</span>
          </div>
        </div>
      )}

      {/* Tab 3: Fluorescence Microscopy Simulation */}
      {activeTab === "microscope" && (
        <div style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Fluorescence Confocal Microscopy Viewport</h3>
              <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.6)" }}>
                HeLa / Nicotiana benthamiana leaf protoplast subcellular localization
              </p>
            </div>

            {/* Filter checkboxes */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setChannels({ ...channels, dapi: !channels.dapi })}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  border: channels.dapi ? "1px solid #3B82F6" : "1px solid rgba(255,255,255,0.2)",
                  background: channels.dapi ? "rgba(59, 130, 246, 0.3)" : "rgba(0,0,0,0.3)",
                  color: channels.dapi ? "#60A5FA" : "rgba(255,255,255,0.5)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🔵 DAPI (Nucleus)
              </button>
              <button
                onClick={() => setChannels({ ...channels, gfp: !channels.gfp })}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  border: channels.gfp ? "1px solid #10B981" : "1px solid rgba(255,255,255,0.2)",
                  background: channels.gfp ? "rgba(16, 185, 129, 0.3)" : "rgba(0,0,0,0.3)",
                  color: channels.gfp ? "#34D399" : "rgba(255,255,255,0.5)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🟢 GFP (Cytoplasm/Membrane)
              </button>
              <button
                onClick={() => setChannels({ ...channels, rfp: !channels.rfp })}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  border: channels.rfp ? "1px solid #EF4444" : "1px solid rgba(255,255,255,0.2)",
                  background: channels.rfp ? "rgba(239, 68, 68, 0.3)" : "rgba(0,0,0,0.3)",
                  color: channels.rfp ? "#F87171" : "rgba(255,255,255,0.5)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🔴 RFP (Mitochondria)
              </button>
            </div>
          </div>

          {/* Microscope Viewport Screen */}
          <div
            style={{
              height: "240px",
              borderRadius: "var(--radius-xl)",
              background: "#02070D",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(0, 240, 200, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Grid overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(rgba(0, 240, 200, 0.15) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Cell 1 */}
            <div
              style={{
                position: "absolute",
                left: "25%",
                top: "30%",
                width: 140,
                height: 110,
                borderRadius: "50% 60% 40% 70% / 60% 50% 70% 40%",
                background: channels.gfp ? "radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)" : "transparent",
                border: channels.gfp ? "1.5px dashed rgba(16,185,129,0.6)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: channels.gfp ? "0 0 20px rgba(16,185,129,0.4)" : "none",
              }}
            >
              {channels.dapi && (
                <div
                  style={{
                    width: 44,
                    height: 36,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #60A5FA 0%, #1D4ED8 80%)",
                    boxShadow: "0 0 16px rgba(59,130,246,0.8)",
                  }}
                />
              )}
              {channels.rfp && (
                <>
                  <div style={{ position: "absolute", top: 15, right: 25, width: 8, height: 8, borderRadius: "50%", background: "#EF4444", boxShadow: "0 0 8px #EF4444" }} />
                  <div style={{ position: "absolute", bottom: 20, left: 30, width: 10, height: 6, borderRadius: "50%", background: "#EF4444", boxShadow: "0 0 8px #EF4444" }} />
                </>
              )}
            </div>

            {/* Cell 2 */}
            <div
              style={{
                position: "absolute",
                right: "22%",
                top: "20%",
                width: 160,
                height: 130,
                borderRadius: "60% 40% 70% 50% / 50% 70% 40% 60%",
                background: channels.gfp ? "radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)" : "transparent",
                border: channels.gfp ? "1.5px dashed rgba(16,185,129,0.6)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: channels.gfp ? "0 0 20px rgba(16,185,129,0.4)" : "none",
              }}
            >
              {channels.dapi && (
                <div
                  style={{
                    width: 50,
                    height: 40,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #60A5FA 0%, #1D4ED8 80%)",
                    boxShadow: "0 0 16px rgba(59,130,246,0.8)",
                  }}
                />
              )}
              {channels.rfp && (
                <>
                  <div style={{ position: "absolute", top: 25, left: 20, width: 9, height: 9, borderRadius: "50%", background: "#EF4444", boxShadow: "0 0 8px #EF4444" }} />
                  <div style={{ position: "absolute", bottom: 25, right: 35, width: 8, height: 8, borderRadius: "50%", background: "#EF4444", boxShadow: "0 0 8px #EF4444" }} />
                </>
              )}
            </div>

            {/* Viewport HUD Crosshairs */}
            <div style={{ position: "absolute", top: 12, left: 16, fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "rgba(0, 240, 200, 0.7)" }}>
              MAG: 100x OIL IMMERSION // NA 1.40
            </div>
            <div style={{ position: "absolute", bottom: 12, right: 16, fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "rgba(0, 240, 200, 0.7)" }}>
              FOV: 120 μm x 120 μm
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
