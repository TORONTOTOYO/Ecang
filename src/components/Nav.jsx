import { useState } from "react";
import { useContent } from "../content/ContentContext.jsx";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About me", href: "#about" },
  { label: "Projects", href: "#work" },
  { label: "Certifications", href: "#certifications" },
];

export default function Nav() {
  const { projects, certifications } = useContent();
  const [open, setOpen] = useState(false); // is the mobile menu open?
  const close = () => setOpen(false);

  // Links for sections that have no items are hidden
  const isEmpty = {
    "#work": projects.length === 0,
    "#certifications": certifications.items.length === 0,
  };

  return (
    <header className="nav">
      <a href="#home" className="logo" aria-label="Home">E</a>

      <ul id="menu" className={open ? "nav-links open" : "nav-links"}>
        {LINKS.filter((link) => !isEmpty[link.href]).map((link) => (
          <li key={link.label}>
            <a href={link.href} onClick={close}>{link.label}</a>
          </li>
        ))}
      </ul>

      {/* Hamburger button, only visible on tablets and phones */}
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="menu"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span /><span /><span />
      </button>
    </header>
  );
}
