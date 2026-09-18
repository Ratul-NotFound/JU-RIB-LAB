"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Scroll detection for sticky navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Close drawer on Escape key press or window resize above 1140px
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setMenuOpen(false);
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    const handleResize = () => {
      if (window.innerWidth > 1140) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleKeyDown]);

  const getDashboardLink = () => {
    if (!session) return "/login";
    const role = (session.user as any)?.role;
    if (role === "ADMIN") return "/admin";
    if (role === "TEACHER") return "/teacher/dashboard";
    return "/student/dashboard";
  };

  return (
    <header className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}>
      {/* Main Navigation Bar */}
      <nav
        className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container navbar-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo" aria-label="Bioresources Technology and Industrial Biotechnology Laboratory Home">
            <div className="nav-logo-icon">
              JU
            </div>
            <div className="nav-logo-text">
              <span className="nav-logo-name">BTIB Lab</span>
              <span className="nav-logo-sub">Jahangirnagar University</span>
            </div>
          </Link>

          {/* Desktop nav links (hidden on tablet & mobile) */}
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
              <div className="hide-tablet-mobile" style={{ position: "relative" }}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="user-menu-btn"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>{session.user?.name?.split(" ")[0] || "Account"}</span>
                  <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>▼</span>
                </button>
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "rgba(255, 255, 255, 0.96)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      minWidth: "190px",
                      overflow: "hidden",
                      zIndex: 300,
                      boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)",
                    }}
                    role="menu"
                  >
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--color-border-subtle)", background: "var(--color-surface-2)" }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-secondary)" }}>{session.user?.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--color-primary)", fontWeight: 600 }}>{(session.user as any)?.role}</div>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      className="sidebar-link"
                      style={{ color: "var(--color-text)", borderRadius: 0, padding: "10px 14px", display: "block", fontSize: "0.85rem", textDecoration: "none" }}
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      Dashboard →
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
                        fontSize: "0.85rem",
                        background: "none",
                        cursor: "pointer",
                      }}
                      role="menuitem"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn btn-sm btn-primary hide-tablet-mobile" style={{ whiteSpace: "nowrap" }}>
                Portal Login
              </Link>
            )}

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              className={`hamburger ${menuOpen ? "hamburger-active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
      </nav>

      {/* Professional Slide-Over Mobile & iPad Navigation Drawer */}
      {menuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMenuOpen(false)}
          role="presentation"
        >
          <div
            id="mobile-navigation-drawer"
            className="mobile-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="nav-logo-icon" style={{ width: 34, height: 34, fontSize: "0.75rem" }}>
                  JU
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--color-secondary)", lineHeight: 1.2 }}>BTIB Laboratory</div>
                  <div style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>Jahangirnagar University</div>
                </div>
              </div>
              <button
                className="btn-drawer-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
              >
                ✕
              </button>
            </div>

            {/* User Session Info Pill (if logged in) */}
            {session && (
              <div style={{ padding: "12px 16px", background: "var(--color-primary-subtle)", borderBottom: "1px solid var(--color-primary-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)" }}>
                    {session.user?.name}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--color-primary)", opacity: 0.8 }}>
                    {(session.user as any)?.role} Account
                  </div>
                </div>
                <Link
                  href={getDashboardLink()}
                  className="btn btn-sm btn-primary"
                  style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
            )}

            {/* Drawer Links List */}
            <div className="mobile-drawer-body">
              <div className="mobile-nav-heading">
                Menu Navigation
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "4px", margin: 0, padding: 0 }}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`mobile-nav-link ${pathname === link.href ? "active" : ""}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{link.label}</span>
                      <span className="mobile-nav-arrow">→</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Portal CTA in Mobile Drawer */}
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--color-border)" }}>
                {session ? (
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                    className="btn btn-outline w-full"
                    style={{ justifyContent: "center", padding: "11px", color: "var(--color-danger)", borderColor: "var(--color-border)" }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="btn btn-primary w-full"
                    style={{ justifyContent: "center", padding: "12px", fontSize: "0.925rem" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Academic Portal Login →
                  </Link>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="mobile-drawer-footer">
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-secondary)" }}>
                Dept. of Biotechnology &amp; Genetic Engineering
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "2px", lineHeight: 1.4 }}>
                Savar, Dhaka-1342 · <a href="mailto:bge@juniv.edu" style={{ color: "var(--color-primary)", fontWeight: 600 }}>bge@juniv.edu</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

