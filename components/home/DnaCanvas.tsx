"use client";

import { useEffect, useRef } from "react";

export default function DnaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const numPoints = 28;
    const basePairs = ["A-T", "T-A", "G-C", "C-G"];
    let angle = 0;

    // Floating background particles
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw floating bioluminescent particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 180, ${p.alpha})`;
        ctx.shadowColor = "rgba(0, 240, 180, 0.8)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // DNA Helix Geometry
      const centerX = width * 0.52;
      const helixHeight = height * 0.82;
      const startY = height * 0.09;
      const strandSpacing = helixHeight / numPoints;
      const amplitude = Math.min(width * 0.28, 140);

      angle += 0.022;

      for (let i = 0; i < numPoints; i++) {
        const currentAngle = angle + i * 0.35;
        const y = startY + i * strandSpacing;

        const x1 = centerX + Math.sin(currentAngle) * amplitude;
        const x2 = centerX - Math.sin(currentAngle) * amplitude;

        const z1 = Math.cos(currentAngle);
        const z2 = -z1;

        // Depth scale and alpha for 3D realism
        const scale1 = (z1 + 2) / 3;
        const scale2 = (z2 + 2) / 3;
        const alpha1 = (z1 + 1.2) / 2.2;
        const alpha2 = (z2 + 1.2) / 2.2;

        // Draw connecting base pair bond
        const bondGradient = ctx.createLinearGradient(x1, y, x2, y);
        bondGradient.addColorStop(0, `rgba(0, 229, 153, ${Math.max(0.15, alpha1 * 0.7)})`);
        bondGradient.addColorStop(0.5, `rgba(0, 240, 255, ${Math.max(0.2, (alpha1 + alpha2) * 0.4)})`);
        bondGradient.addColorStop(1, `rgba(59, 130, 246, ${Math.max(0.15, alpha2 * 0.7)})`);

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = bondGradient;
        ctx.lineWidth = Math.max(1, 2.5 * ((z1 + z2 + 2) / 3));
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Base pair code annotation on every 3rd rung
        if (i % 3 === 0 && (z1 > 0 || z2 > 0)) {
          const bpText = basePairs[i % basePairs.length];
          ctx.font = "600 10px 'JetBrains Mono', monospace";
          ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
          ctx.textAlign = "center";
          ctx.fillText(bpText, (x1 + x2) / 2, y - 4);
        }

        // Left node (Strand A - Emerald Bioluminescent)
        const radius1 = Math.max(3, 7.5 * scale1);
        ctx.beginPath();
        ctx.arc(x1, y, radius1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 230, 160, ${Math.max(0.3, alpha1)})`;
        ctx.shadowColor = "#00E599";
        ctx.shadowBlur = z1 > 0 ? 14 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner core of Strand A node
        ctx.beginPath();
        ctx.arc(x1, y, radius1 * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        // Right node (Strand B - Cyan/Azure Bioluminescent)
        const radius2 = Math.max(3, 7.5 * scale2);
        ctx.beginPath();
        ctx.arc(x2, y, radius2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${Math.max(0.3, alpha2)})`;
        ctx.shadowColor = "#00D2FF";
        ctx.shadowBlur = z2 > 0 ? 14 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner core of Strand B node
        ctx.beginPath();
        ctx.arc(x2, y, radius2 * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 460 }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {/* Hologram Scanner Line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.75), transparent)",
          boxShadow: "0 0 16px rgba(0,240,255,0.9)",
          animation: "scanLine 4s ease-in-out infinite alternate",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
