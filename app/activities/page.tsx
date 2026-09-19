import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Activities & Events",
  description: "Seminars, workshops, and events at the Bioresources Technology and Industrial Biotechnology Laboratory.",
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
          <div className="section-eyebrow" style={{ color: "var(--color-accent)", justifyContent: "flex-start" }}>Academic Events</div>
          <h1 className="text-h1">Activities & Events</h1>
          <p>Scientific symposiums, technical workshops, and departmental seminars.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div style={{ marginBottom: "var(--space-16)" }}>
              <div data-reveal="fade" className="section-eyebrow" style={{ justifyContent: "flex-start", marginBottom: "var(--space-6)" }}>Upcoming Events</div>
              <div className="grid-3 reveal-stagger">
                {upcoming.map((activity) => (
                  <Link key={activity.id} href={`/activities/${activity.slug}`} style={{ textDecoration: "none" }}>
                    <div className="card card-body" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-3)" }}>
                        <span className="badge badge-primary">{activity.type}</span>
                        <span className="badge badge-success badge-live-pulse">Upcoming</span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-3)", lineHeight: 1.4 }}>
                        {activity.title}
                      </h3>
                      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "var(--space-1)", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        <div style={{ fontFamily: "var(--font-mono)", color: "var(--color-primary)", fontWeight: 600 }}>
                          {new Date(activity.eventDate).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                        </div>
                        {activity.location && (
                          <div style={{ color: "var(--color-text-muted)" }}>{activity.location}</div>
                        )}
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
              <div data-reveal="fade" className="section-eyebrow" style={{ justifyContent: "flex-start", marginBottom: "var(--space-6)" }}>Archived Events</div>
              <div className="grid-3 reveal-stagger">
                {past.map((activity) => (
                  <Link key={activity.id} href={`/activities/${activity.slug}`} style={{ textDecoration: "none" }}>
                    <div className="card card-body" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ marginBottom: "var(--space-3)" }}>
                        <span className="badge badge-neutral">{activity.type}</span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "var(--space-3)", lineHeight: 1.4 }}>
                        {activity.title}
                      </h3>
                      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "var(--space-1)", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        <div style={{ fontFamily: "var(--font-mono)" }}>
                          {new Date(activity.eventDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </div>
                        {activity.location && (
                          <div>{activity.location}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activities.length === 0 && (
            <div style={{ textAlign: "center", padding: "var(--space-20) 0", color: "var(--color-text-muted)" }}>
              <p>No activities listed yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
