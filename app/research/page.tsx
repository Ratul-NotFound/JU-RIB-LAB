import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Areas",
  description: "Explore the research themes and focus areas of the BGE Lab.",
};

const RESEARCH_THEMES = [
  {
    icon: "🧬",
    title: "Genomics & Next-Generation Sequencing",
    areas: ["Whole genome sequencing", "Metagenomics", "Transcriptomics (RNA-seq)", "Comparative genomics", "Epigenomics"],
    description: "We utilize state-of-the-art sequencing technologies to decode the genetic information of organisms ranging from microbes to complex plants and animals. Our genomics research helps unravel the molecular basis of biological traits and diseases.",
    color: "#0A4F3C",
  },
  {
    icon: "🔬",
    title: "Molecular Biology & Cell Biology",
    areas: ["Gene expression analysis", "Protein-protein interactions", "CRISPR-Cas9 gene editing", "Recombinant DNA technology", "Cell signaling pathways"],
    description: "Our molecular biology research focuses on understanding the fundamental mechanisms that govern cellular processes, with applications in medicine, agriculture, and environmental science.",
    color: "#1A1A2E",
  },
  {
    icon: "🌱",
    title: "Agricultural Biotechnology",
    areas: ["Crop improvement", "Disease resistance breeding", "Drought tolerance research", "Biopesticide development", "Soil microbiome studies"],
    description: "We apply biotechnological tools to develop improved crop varieties that can withstand climate change, resist diseases, and produce higher yields — contributing to food security in Bangladesh and beyond.",
    color: "#065F46",
  },
  {
    icon: "💊",
    title: "Medical Biotechnology & Biopharmaceuticals",
    areas: ["Diagnostic marker discovery", "Vaccine development", "Therapeutic protein production", "Cancer biomarker research", "Pharmacogenomics"],
    description: "Research aimed at developing novel diagnostics, vaccines, and therapeutic proteins to address unmet medical needs, particularly diseases prevalent in South Asia.",
    color: "#1E40AF",
  },
  {
    icon: "🦠",
    title: "Microbial Biotechnology",
    areas: ["Industrial fermentation", "Bioremediation", "Probiotic development", "Antimicrobial resistance", "Extremophile biology"],
    description: "Exploiting the extraordinary diversity of microorganisms for industrial, environmental, and biomedical applications. We study microbial communities and develop biotechnology-based solutions.",
    color: "#92400E",
  },
  {
    icon: "🖥️",
    title: "Bioinformatics & Computational Biology",
    areas: ["Genome assembly & annotation", "Phylogenetic analysis", "Structural bioinformatics", "Machine learning in biology", "Drug target prediction"],
    description: "Integrating computational tools with biological data to extract meaningful insights. Our bioinformatics team supports experimental research with powerful data analysis pipelines.",
    color: "#4C1D95",
  },
];

export default function ResearchPage() {
  return (
    <>
      <div className="page-header">
        <div className="container page-header-content">
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>Science</div>
          <h1 className="text-h1">Research Areas</h1>
          <p>Six major research domains driving our scientific mission.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
            {RESEARCH_THEMES.map((theme, i) => (
              <div key={theme.title} style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "1fr 2fr" : "2fr 1fr",
                gap: "var(--space-10)",
                alignItems: "center",
              }}>
                {i % 2 !== 0 && (
                  <div>
                    <div className="highlight-bar" />
                    <h2 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800, marginBottom: "var(--space-4)", color: "var(--color-secondary)" }}>
                      {theme.title}
                    </h2>
                    <p style={{ fontSize: "1rem", color: "var(--color-text-2)", lineHeight: 1.8, marginBottom: "var(--space-5)" }}>
                      {theme.description}
                    </p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      {theme.areas.map((area) => (
                        <li key={area} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "0.9rem", color: "var(--color-text-2)" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0 }} />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={{
                  background: `linear-gradient(135deg, ${theme.color}, ${theme.color}cc)`,
                  borderRadius: "var(--radius-2xl)",
                  padding: "var(--space-10)",
                  textAlign: "center",
                  color: "white",
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-4)",
                }}>
                  <div style={{ fontSize: "4rem" }}>{theme.icon}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>{theme.title}</div>
                  <div style={{ width: 40, height: 3, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
                  <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>{theme.areas.length} research focus areas</div>
                </div>
                {i % 2 === 0 && (
                  <div>
                    <div className="highlight-bar" />
                    <h2 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800, marginBottom: "var(--space-4)", color: "var(--color-secondary)" }}>
                      {theme.title}
                    </h2>
                    <p style={{ fontSize: "1rem", color: "var(--color-text-2)", lineHeight: 1.8, marginBottom: "var(--space-5)" }}>
                      {theme.description}
                    </p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      {theme.areas.map((area) => (
                        <li key={area} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "0.9rem", color: "var(--color-text-2)" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0 }} />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
