"use client";

export default function LiveLabTicker() {
  const announcements = [
    "🔬 Next-Gen Sequencing Run #814 in Progress: Indigenous Rice Cultivar Transcriptome",
    "📄 New Q1 Publication in Nature Biotechnology: CRISPR Cas12a Trans-cleavage Optimization",
    "🏆 BGE Lab Awarded National Science & Technology Research Fellowship (2025-2026)",
    "🧪 Droplet Digital PCR System (QX200) Calibrated & Accepting Research Cohort Samples",
    "📅 Upcoming Seminar: 'Epigenetic Reprogramming in Abiotic Stress Adaptation' — Thursday 3:00 PM",
    "🌱 Collaborative Genomic Survey with BRRI & BARI on Saline-Tolerant Coastal Flora",
  ];

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #061B24 0%, #0A2E3D 50%, #061B24 100%)",
        borderTop: "1px solid rgba(0, 240, 200, 0.2)",
        borderBottom: "1px solid rgba(0, 240, 200, 0.2)",
        padding: "10px 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "max-content",
          animation: "marquee 35s linear infinite",
          gap: "var(--space-10)",
        }}
      >
        {announcements.concat(announcements).map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.85rem",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-accent)",
                display: "inline-block",
              }}
            />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
