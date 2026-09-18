import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Areas",
  description: "Explore the core research themes of the Bioresources Technology and Industrial Biotechnology Laboratory.",
};

const RESEARCH_THEMES = [
  {
    icon: "🦠",
    title: "Microbial Biotechnology",
    image: "/images/hero-lab.jpg",
    areas: ["Industrial enzyme production (amylases, proteases, cellulases)", "Fermentation technology & optimization", "Microbial secondary metabolites", "Probiotics and functional cultures", "Antimicrobial compound screening"],
    description: "Our microbial biotechnology research investigates beneficial bacterial and fungal strains to develop scalable bio-based production platforms for high-value enzymes, pharmaceuticals, and industrial biochemicals.",
    color: "#0A4F3C",
  },
  {
    icon: "⚙️",
    title: "Bioprocess Engineering",
    image: "/images/fermentation.jpg",
    areas: ["Bioreactor design & operation", "Upstream & downstream bioprocess optimization", "Bio-separation and membrane filtration", "Submerged and solid-state fermentation", "Process scale-up and techno-economics"],
    description: "Bridging laboratory discoveries and commercial applications through advanced bioprocess engineering. We optimize cultivation conditions, mass transfer, and yield efficiency for green industrial biomanufacturing.",
    color: "#1A1A2E",
  },
  {
    icon: "🌿",
    title: "Algae Biotechnology & Carbon Capture",
    image: "/images/liquid-tree.jpg",
    areas: ["'Liquid-Tree' urban photobioreactor innovation", "High-density microalgae mass cultivation", "Biological CO2 capture and air purification", "Biofuel and lipid feedstock synthesis", "Wastewater phytoremediation"],
    description: "Pioneering microalgal technology for environmental sustainability. Our flagship 'Liquid-Tree' photobioreactor initiative utilizes microalgae to capture atmospheric carbon dioxide and generate clean oxygen in urban environments.",
    color: "#065F46",
  },
  {
    icon: "♻️",
    title: "Biomaterial Processing & Waste Valorization",
    image: "/images/fermentation.jpg",
    areas: ["Agro-industrial residue valorization", "Biodegradable bioplastics and biopolymers", "Chitosan and bio-composite synthesis", "Lignocellulosic biomass processing", "Circular bio-economy solutions"],
    description: "Transforming agricultural and industrial bio-waste into high-value functional materials, biodegradable packaging, and sustainable biochemicals to advance circular bio-economy principles.",
    color: "#92400E",
  },
  {
    icon: "🧬",
    title: "Protein Structure & Enzyme Engineering",
    image: "/images/hero-lab.jpg",
    areas: ["Protein 3D structure modeling and MD simulation", "Molecular docking and binding site analysis", "Recombinant enzyme expression systems", "Thermostability and catalytic optimization", "Enzyme immobilization techniques"],
    description: "Employing structural biology and protein engineering to design novel biocatalysts with improved thermal stability, specificity, and catalytic efficiency for industrial and environmental applications.",
    color: "#1E40AF",
  },
  {
    icon: "💻",
    title: "Computational Biology & Bioinformatics",
    image: "/images/hero-lab.jpg",
    areas: ["Metagenomic profiling of bioresources", "Metabolic pathway modeling & flux analysis", "Multi-omics data integration pipelines", "In silico drug and target prediction", "Machine learning in bioprocess modeling"],
    description: "Integrating powerful computational pipelines with experimental biological data to decode complex molecular networks, predict metabolic fluxes, and guide laboratory strain development.",
    color: "#4C1D95",
  },
];

export default function ResearchPage() {
  return (
    <>
      <div className="page-header">
        <div className="container page-header-content">
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>Science &amp; Innovation</div>
          <h1 className="text-h1">Research Areas</h1>
          <p>Six specialized research domains driving the mission of BTIB Lab at Jahangirnagar University.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
            {RESEARCH_THEMES.map((theme, i) => (
              <div key={theme.title} className={i % 2 === 0 ? "split-research-item" : "split-research-item reverse"}>
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
                  position: "relative",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  minHeight: 280,
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}>
                  <img
                    src={theme.image}
                    alt={theme.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(15, 23, 42, 0.88)",
                  }} />
                  <div style={{
                    position: "relative",
                    zIndex: 1,
                    padding: "var(--space-6)",
                    color: "#ffffff",
                    textAlign: "left",
                  }}>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      padding: "4px 12px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "var(--space-3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#E2E8F0",
                    }}>
                      <span>{theme.icon}</span> Research Domain
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, fontFamily: "var(--font-heading)", color: "#ffffff", marginBottom: 4 }}>
                      {theme.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                      {theme.areas.length} core focus areas · BTIB Lab
                    </div>
                  </div>
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
