import Link from "next/link";

const QUICK_LINKS = [
  { href: "/about", label: "About the Lab" },
  { href: "/research", label: "Research Areas" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/members", label: "Our Team" },
];

const RESOURCES = [
  { href: "/blog", label: "Blog" },
  { href: "/activities", label: "Activities & Events" },
  { href: "/contact", label: "Contact Us" },
  { href: "/login", label: "Member Login" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                }}
              >
                🧬
              </div>
              <div className="footer-logo-name">BTIB Lab</div>
            </div>
            <p className="footer-desc">
              The Bioresources Technology and Industrial Biotechnology Laboratory at Jahangirnagar University is
              committed to cutting-edge research in bioresources utilization, bioprocess engineering, and sustainable industrial biotechnology.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                f
              </a>
              <a href="#" className="social-link" aria-label="Twitter/X" target="_blank" rel="noopener noreferrer">
                𝕏
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                in
              </a>
              <a href="#" className="social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                ▶
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              {RESOURCES.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-heading">Contact</h3>
            <ul className="footer-links" style={{ gap: "var(--space-4)" }}>
              <li style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>Address</span>
                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                  Department of Biotechnology &amp; Genetic Engineering,<br />
                  Jahangirnagar University, Savar, Dhaka
                </span>
              </li>
              <li>
                <a href="mailto:bge@juniv.edu">bge@juniv.edu</a>
              </li>
              <li>
                <a href="tel:+8801700000000">+880 1700-000000</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {currentYear} Bioresources Technology and Industrial Biotechnology Laboratory, Jahangirnagar University. All rights reserved.</p>
          <p>Built with 💚 for science</p>
        </div>
      </div>
    </footer>
  );
}
