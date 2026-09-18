"use client";

import { useState, useEffect } from "react";
import DnaCanvas from "./DnaCanvas";

const SEQUENCE_STREAM = [
  "5'-ATG GCG ACC CTG GAG AAG CTG ATG AAG GCC TTC GAG TCG CTC AAG TCC TTC CAG CAG CAG CAG-3'",
  "5'-CAG CAG CAG CCG CCG CCG CCG CCC CCA CCA CCG CCG CCG CCA CCT CCC GGC TCG GCC CCG GCG-3'",
  "5'-GAG GAG CCG CTG CAC CGA CCG AAA AAG GAA CTC TCG GCC ACC AAG AAG GAC CGG GTG AAC CAC-3'",
  "5'-TGT CTG ACA ATA TGT GAA AAC ATA GTG GCA CAG TCT CTC AGA AAT TCT CCA GAA TTT CAG AAA-3'",
];

export default function HeroBioVisual() {
  const [streamIndex, setStreamIndex] = useState(0);
  const [pulseCycle, setPulseCycle] = useState(32);
  const [tempVal, setTempVal] = useState(94.8);

  useEffect(() => {
    const seqTimer = setInterval(() => {
      setStreamIndex((prev) => (prev + 1) % SEQUENCE_STREAM.length);
    }, 4500);

    const telemetryTimer = setInterval(() => {
      setPulseCycle((prev) => (prev >= 40 ? 1 : prev + 1));
      setTempVal((prev) => +(94.0 + Math.random() * 1.5).toFixed(1));
    }, 2000);

    return () => {
      clearInterval(seqTimer);
      clearInterval(telemetryTimer);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "var(--radius-2xl)",
        background: "linear-gradient(145deg, rgba(10, 30, 45, 0.85) 0%, rgba(6, 18, 28, 0.95) 100%)",
        border: "1px solid rgba(0, 240, 200, 0.25)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(0, 240, 200, 0.05)",
        overflow: "hidden",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top Glass Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 20px",
          borderBottom: "1px solid rgba(0, 240, 200, 0.15)",
          background: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F56", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27C93F", display: "inline-block" }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              color: "rgba(0, 240, 200, 0.9)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            LAB HUD v3.8 // JU-BGE OMICS CORE
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#00E599",
              boxShadow: "0 0 8px #00E599",
              animation: "pulse-dot 1.8s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "rgba(255, 255, 255, 0.75)",
            }}
          >
            SEQUENCER ONLINE
          </span>
        </div>
      </div>

      {/* Main Canvas + Overlay Visuals */}
      <div style={{ position: "relative", height: 420 }}>
        <DnaCanvas />

        {/* Floating Telemetry Pill Top Right */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "rgba(5, 20, 30, 0.8)",
            border: "1px solid rgba(0, 240, 200, 0.25)",
            borderRadius: "var(--radius-lg)",
            padding: "12px 16px",
            backdropFilter: "blur(12px)",
            maxWidth: 180,
          }}
        >
          <div style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.5)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
            PCR THERMOCYCLER
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ color: "#00F0FF", fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              {tempVal}°C
            </span>
            <span style={{ fontSize: "0.75rem", color: "#00E599", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
              CYC {pulseCycle}/40
            </span>
          </div>
          <div
            style={{
              marginTop: 6,
              height: 3,
              width: "100%",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(pulseCycle / 40) * 100}%`,
                background: "linear-gradient(90deg, #00E599, #00F0FF)",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Floating Telemetry Pill Bottom Left */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            background: "rgba(5, 20, 30, 0.85)",
            border: "1px solid rgba(0, 240, 200, 0.25)",
            borderRadius: "var(--radius-lg)",
            padding: "12px 16px",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: 4 }}>
            <span style={{ fontSize: "0.9rem" }}>🧬</span>
            <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.6)", fontFamily: "var(--font-mono)" }}>
              GENOME FIDELITY
            </span>
          </div>
          <div style={{ color: "#FFFFFF", fontSize: "1.2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            99.984% <span style={{ fontSize: "0.75rem", color: "#00E599", fontWeight: 500 }}>Q40 SCORE</span>
          </div>
        </div>
      </div>

      {/* Real-Time Genomic Stream Marquee Footer */}
      <div
        style={{
          padding: "12px 18px",
          background: "rgba(0, 10, 18, 0.7)",
          borderTop: "1px solid rgba(0, 240, 200, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            background: "rgba(0, 240, 180, 0.2)",
            color: "#00E599",
            borderRadius: "var(--radius-sm)",
            padding: "3px 8px",
            fontSize: "0.68rem",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.05em",
            flexShrink: 0,
          }}
        >
          READOUT
        </span>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "rgba(255, 255, 255, 0.85)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            letterSpacing: "0.08em",
          }}
        >
          {SEQUENCE_STREAM[streamIndex]}
        </div>
      </div>
    </div>
  );
}
