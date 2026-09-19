import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const activity = await prisma.activity.findUnique({ where: { slug } });
    if (!activity) return { title: "Activity Not Found" };
    return {
      title: `${activity.title} — BGE Lab Events`,
      description: activity.description,
    };
  } catch {
    return { title: "Activity — BGE Lab" };
  }
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let activity: any = null;

  try {
    activity = await prisma.activity.findUnique({
      where: { slug },
      include: { creator: { select: { name: true } } },
    });
  } catch {}

  // Fallback demo data if DB is offline/unseeded
  if (!activity) {
    if (slug === "crispr-symposium-2025") {
      activity = {
        title: "National CRISPR & Genome Editing Symposium 2025",
        slug: "crispr-symposium-2025",
        description: "A two-day national symposium bringing together molecular biologists and researchers from across Bangladesh.",
        content: `### About the Symposium
The Department of Biotechnology & Genetic Engineering at Jahangirnagar University is pleased to host the **National CRISPR & Genome Editing Symposium 2025**.

#### Key Topics Covered:
- Precision Genome Editing with CRISPR-Cas9 and Cas12
- Plant Genetic Engineering for Climate Resilience in Bangladesh
- Therapeutics & Epigenetic Modulations
- Hands-on computational guide to gRNA design

#### Program Schedule:
- **Day 1**: Plenary talks and poster presentations by faculty and graduate students.
- **Day 2**: Practical lab demonstration and round-table discussions on bioethics and biosafety frameworks.`,
        thumbnailUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80",
        eventDate: new Date("2025-11-15T09:00:00Z"),
        endDate: new Date("2025-11-16T17:00:00Z"),
        location: "Auditorium & BGE Molecular Lab, Jahangirnagar University",
        type: "SYMPOSIUM",
        creator: { name: "Dr. Md. Shahedur Rahman" },
      };
    } else {
      notFound();
    }
  }

  const startDateStr = new Date(activity.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startTimeStr = new Date(activity.eventDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={{ padding: "var(--space-12) 0", minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 880 }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <Link href="/activities" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
            ← Back to All Activities & Events
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
            <span className="badge badge-primary">{activity.type}</span>
            {activity.isFeatured && <span className="badge badge-warning">⭐ Featured Event</span>}
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "var(--space-4)" }}>
            {activity.title}
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
            {activity.description}
          </p>
        </div>

        {/* Event Key Info Card */}
        <div
          data-reveal="fade"
          className="card"
          style={{
            padding: "var(--space-6)",
            marginBottom: "var(--space-8)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--space-6)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              📅 Date & Time
            </div>
            <div style={{ fontWeight: 600, color: "var(--color-text)", marginTop: "var(--space-1)" }}>
              {startDateStr}
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
              {startTimeStr}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              📍 Location
            </div>
            <div style={{ fontWeight: 600, color: "var(--color-text)", marginTop: "var(--space-1)" }}>
              {activity.location || "Department of BGE, JU"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              👤 Organizer / Host
            </div>
            <div style={{ fontWeight: 600, color: "var(--color-text)", marginTop: "var(--space-1)" }}>
              {activity.creator?.name || "BGE Laboratory"}
            </div>
          </div>
        </div>

        {/* Thumbnail if present */}
        {activity.thumbnailUrl && (
          <div data-reveal="scale" style={{ marginBottom: "var(--space-8)", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--color-border)" }}>
            <img
              src={activity.thumbnailUrl}
              alt={activity.title}
              style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* Full Content */}
        {activity.content && (
          <div
            data-reveal="fade"
            className="card"
            style={{
              padding: "var(--space-8)",
              background: "var(--color-surface)",
              lineHeight: 1.8,
              fontSize: "1.05rem",
              color: "var(--color-text)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ whiteSpace: "pre-line" }}>{activity.content}</div>
          </div>
        )}

        {/* Action button */}
        <div style={{ marginTop: "var(--space-8)", textAlign: "center" }}>
          <Link href="/contact" className="btn btn-primary btn-lg">
            Inquire About Participating / Registration
          </Link>
        </div>
      </div>
    </div>
  );
}
