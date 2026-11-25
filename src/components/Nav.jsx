import { useState } from "react";
import { useContent } from "../content/ContentContext.jsx";
import BrandLogo from "./BrandLogo.jsx";
import { SECTION_DEFINITIONS } from "../content/sections.js";

export default function Nav() {
  const { projects, certifications, sections, sectionOrder, offCamera } = useContent();
  const [open, setOpen] = useState(false); // is the mobile menu open?
  const close = () => setOpen(false);

  // Links are hidden for sections that are switched off or empty
  const hidden = {
    "#about": !sections.about,
    "#work": !sections.work || projects.length === 0,
    "#skills": !sections.offCamera || (!offCamera.bagImage && !offCamera.items?.length),
    "#certifications": !sections.certifications || certifications.items.length === 0,
  };
  const firstSection = sectionOrder.find((id) => sections[id]);
  const links = sectionOrder.map((id) => SECTION_DEFINITIONS.find((section) => section.id === id))
    .filter((section) => section.href && !hidden[section.href]);

  return (
    <header className={firstSection === "home" ? "nav" : "nav nav-in-flow"}>
      <a href="#home" className="logo" aria-label="Home"><BrandLogo className="brand-content" /></a>

      <ul id="menu" className={open ? "nav-links open" : "nav-links"}>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.href} onClick={close}>{link.navLabel}</a>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
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
      </div>
    </header>
  );
}