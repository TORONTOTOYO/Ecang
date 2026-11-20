import { useState } from "react";
import { nav, projects, certifications } from "../data.js";

// Menu links for sections that have no items are hidden
const isEmpty = {
  "#work": projects.length === 0,
  "#certifications": certifications.items.length === 0,
};

export default function Nav() {
  const [open, setOpen] = useState(false); // is the mobile menu open?
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <a href="#home" className="logo" aria-label="Home">E</a>

      <ul id="menu" className={open ? "nav-links open" : "nav-links"}>
        {nav.filter((item) => !isEmpty[item.href]).map((item) => (
          <li key={item.label}>
            <a href={item.href} onClick={close}>{item.label}</a>
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
