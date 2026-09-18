"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  {
    section: "Overview",
    links: [
      { href: "/admin", label: "Dashboard", icon: "📊" },
    ],
  },
  {
    section: "Content",
    links: [
      { href: "/admin/projects", label: "Projects", icon: "🔭" },
      { href: "/admin/publications", label: "Publications", icon: "📄" },
      { href: "/admin/activities", label: "Activities", icon: "📅" },
      { href: "/admin/blog", label: "Blog Posts", icon: "✍️" },
    ],
  },
  {
    section: "People",
    links: [
      { href: "/admin/members", label: "Members", icon: "👨‍🔬" },
    ],
  },
  {
    section: "Settings",
    links: [
      { href: "/admin/settings", label: "Lab Settings", icon: "⚙️" },
    ],
  },
];

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🧬</div>
        <div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.9rem" }}>BGE Lab Admin</div>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>Management Panel</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section-label">{group.section}</div>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link ${pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href)) ? "active" : ""}`}
              >
                <span style={{ fontSize: "1rem" }}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        {/* Quick public links */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "var(--space-4)", paddingTop: "var(--space-4)" }}>
          <div className="sidebar-section-label">Quick View</div>
          <Link href="/" target="_blank" className="sidebar-link">
            <span>🌐</span> View Website
          </Link>
        </div>
      </nav>

      {/* User info at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "var(--space-4) var(--space-5)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", gap: "var(--space-3)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: "0.9rem", flexShrink: 0,
        }}>
          {user?.name?.charAt(0) ?? "A"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.name ?? "Admin"}
          </div>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>Administrator</div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          title="Sign Out"
          aria-label="Sign Out"
        >
          ⇥
        </button>
      </div>
    </aside>
  );
}
