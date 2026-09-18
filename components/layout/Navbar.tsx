"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/members", label: "Team" },
  { href: "/activities", label: "Activities" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const getDashboardLink = () => {
    if (!session) return "/login";
    const role = (session.user as any).role;
    if (role === "ADMIN") return "/admin";
    if (role === "TEACHER") return "/teacher/dashboard";
    return "/student/dashboard";
  };

  return (
    <>
      {/* Top Institutional Affiliation Header Bar */}
      <div style={{
        background: "#090D16",
        color: "#94A3B8",
        fontSize: "0.75rem",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "5px 0",
        position: "relative",
        zIndex: 101,
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", letterSpacing: "0.03em" }}>
            <span style={{ fontWeight: 700, color: "#E2E8F0" }}>Jahangirnagar University</span>
            <span>·</span>
            <span>Department of Biotechnology &amp; Genetic Engineering</span>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <span>Savar, Dhaka-1342, Bangladesh</span>
            <span>·</span>
            <a href="mailto:bge@juniv.edu" style={{ color: "#34D399", textDecoration: "none" }}>bge@juniv.edu</a>
          </div>
        </div>
      </div>

      <nav
        className={`navbar ${isTransparent ? "navbar-transparent" : "navbar-solid"}`}
        style={{ top: "auto", position: "sticky" }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container navbar-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo" aria-label="Bioresources Technology and Industrial Biotechnology Laboratory Home">
            <div className="nav-logo-icon" style={{
              background: "var(--color-primary)",
              color: "#FFFFFF",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
              fontFamily: "var(--font-mono)",
            }}>
              JU
            </div>
            <div className="nav-logo-text">
              <span className="nav-logo-name" style={{ letterSpacing: "-0.01em", fontWeight: 700 }}>BTIB Laboratory</span>
              <span className="nav-logo-sub" style={{ fontSize: "0.68rem" }}>Department of Biotechnology &amp; Genetic Engineering</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="nav-links" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? "active" : ""}`}
                  style={{
                    fontWeight: pathname === link.href ? 700 : 500,
                    borderBottom: pathname === link.href ? "2px solid var(--color-primary)" : "2px solid transparent",
                    borderRadius: 0,
                    padding: "8px 12px",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {session ? (
              <div style={{ position: "relative" }}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="user-menu-btn"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span>{session.user?.name?.split(" ")[0] || "Account"}</span>
                  <span style={{ fontSize: "0.7rem" }}>▼</span>
                </button>
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "#FFFFFF",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      minWidth: "170px",
                      overflow: "hidden",
                      zIndex: 200,
                    }}
                    role="menu"
                  >
                    <Link
                      href={getDashboardLink()}
                      className="sidebar-link"
                      style={{ color: "var(--color-text)", borderRadius: 0, padding: "10px 14px" }}
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setDropdownOpen(false); }}
                      className="sidebar-link"
                      style={{
                        color: "var(--color-danger)",
                        borderRadius: 0,
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 14px",
                        borderTop: "1px solid var(--color-border-subtle)",
                      }}
                      role="menuitem"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn btn-sm btn-primary">
                Portal Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span
                style={{
                  transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
                }}
              />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span
                style={{
                  transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "var(--nav-height)",
            left: 0,
            right: 0,
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border-subtle)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 99,
            padding: "var(--space-4) var(--space-6)",
            animation: "slideUp 0.2s ease",
          }}
        >
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: pathname === link.href ? "var(--color-primary)" : "var(--color-text-2)",
                    background: pathname === link.href ? "var(--color-accent-subtle)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
