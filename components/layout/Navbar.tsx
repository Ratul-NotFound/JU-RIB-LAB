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
      <nav
        className={`navbar ${isTransparent ? "navbar-transparent" : "navbar-solid"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container navbar-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo" aria-label="BGE Lab Home">
            <div className="nav-logo-icon">🧬</div>
            <div className="nav-logo-text">
              <span className="nav-logo-name">BGE Lab</span>
              <span className="nav-logo-sub">Jahangirnagar University</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="nav-links" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? "active" : ""}`}
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
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border-subtle)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-lg)",
                      minWidth: "160px",
                      overflow: "hidden",
                      zIndex: 200,
                    }}
                    role="menu"
                  >
                    <Link
                      href={getDashboardLink()}
                      className="sidebar-link"
                      style={{ color: "var(--color-text-2)", borderRadius: 0 }}
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
                Sign In
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
