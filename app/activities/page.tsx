import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Activities & Events",
  description: "Seminars, workshops, and events at the BGE Lab.",
};

async function getActivities() {
  try {
    return await prisma.activity.findMany({
      orderBy: { eventDate: "desc" },
    });
  } catch {
    return [];
  }
}

const ACTIVITY_ICONS: Record<string, string> = {
  SEMINAR: "🎓",
  WORKSHOP: "🔧",
  CONFERENCE: "🏛️",
  FIELDWORK: "🌿",
  TRAINING: "📚",
  OTHER: "📅",
};

export default async function ActivitiesPage() {
  const activities = await getActivities();
  const now = new Date();
  const upcoming = activities.filter((a) => new Date(a.eventDate) >= now);
  const past = activities.filter((a) => new Date(a.eventDate) < now);

  return (
    <>
      <div className="page-header">
        <div className="container page-header-content">
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>Events</div>
          <h1 className="text-h1">Activities & Events</h1>
          <p>Seminars, workshops, and scientific events organized by our lab.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div style={{ marginBottom: "var(--space-16)" }}>
              <div className="section-eyebrow" style={{ justifyContent: "flex-start", marginBottom: "var(--space-6)" }}>Upcoming</div>
              <div className="grid-3">
                {upcoming.map((activity) => (
                  <Link key={activity.id} href={`/activities/${activity.slug}`} style={{ textDecoration: "none" }}>
                    <div className="card card-body" style={{ borderLeft: "4px solid var(--color-accent)" }}>
                      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: "var(--radius-md)",
                          background: "var(--color-accent-subtle)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.6rem", flexShrink: 0,
                        }}>
                          {ACTIVITY_ICONS[activity.type] ?? "📅"}
                        </div>
                        <div>
                          <span className="badge badge-success" style={{ marginBottom: "var(--space-2)" }}>Upcoming</span>
                          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-1)" }}>
                            {activity.title}
                          </h3>
                          <div style={{ fontSize: "0.8rem", color: "var(--color-accent)", fontWeight: 600 }}>
                            📅 {new Date(activity.eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                          </div>
                          {activity.location && (
                            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: 2 }}>📍 {activity.location}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div>
              <div className="section-eyebrow" style={{ justifyContent: "flex-start", marginBottom: "var(--space-6)" }}>Past Events</div>
              <div className="grid-3">
                {past.map((activity) => (
                  <Link key={activity.id} href={`/activities/${activity.slug}`} style={{ textDecoration: "none" }}>
                    <div className="card card-body" style={{ opacity: 0.85 }}>
                      <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>
                        {ACTIVITY_ICONS[activity.type] ?? "📅"}
                      </div>
                      <span className="badge badge-neutral" style={{ marginBottom: "var(--space-2)" }}>{activity.type}</span>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-1)" }}>
                        {activity.title}
                      </h3>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        {new Date(activity.eventDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                      {activity.location && (
                        <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>📍 {activity.location}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activities.length === 0 && (
            <div style={{ textAlign: "center", padding: "var(--space-20) 0", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>📅</div>
              <p>No activities listed yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
