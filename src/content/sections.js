export const SECTION_DEFINITIONS = [
  { id: "home", label: "Home introduction", navLabel: "Home", href: "#home" },
  { id: "about", label: "About me", navLabel: "About me", href: "#about" },
  { id: "work", label: "Projects", navLabel: "Projects", href: "#work" },
  { id: "offCamera", label: "Erica's skills", navLabel: "Skills", href: "#skills" },
  { id: "certifications", label: "Certifications", navLabel: "Certifications", href: "#certifications" },
  { id: "contact", label: "Contact" },
];

export const DEFAULT_SECTION_ORDER = SECTION_DEFINITIONS.map((section) => section.id);

export function normalizeSectionOrder(order) {
  const known = new Set(DEFAULT_SECTION_ORDER);
  const seen = new Set();
  const result = [];
  for (const id of Array.isArray(order) ? order : []) {
    if (known.has(id) && !seen.has(id)) {
      result.push(id);
      seen.add(id);
    }
  }
  return [...result, ...DEFAULT_SECTION_ORDER.filter((id) => !seen.has(id))];
}
