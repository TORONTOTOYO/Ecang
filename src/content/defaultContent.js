// DEFAULT CONTENT
// This is what the site shows when Firebase is not set up yet, or before the admin
// saves anything. Once you save in the admin panel (#/admin), the live content
// comes from Firebase instead and this file is only the starting point.
//
// Images: "/images/portrait/erica.jpg" points to public/images/portrait/erica.jpg.
// In the admin panel, paste an image URL to display a photo.

// When a section has more cards than this number, it becomes a swipeable carousel.
const settings = { carouselAfter: 3 };

const profile = {
  name: "Erica",
  role: "Actress and communication graduate from Laguna",
  intro:
    "I tell stories on screen and behind the camera. Take a look at my film work, my background, and how to reach me.",
  portrait: "/images/portrait/erica.jpg",
};

const about = {
  title: "Who am I?",
  text: "",
};

const background = [
  {
    title: "Bachelor of Arts in Communication",
    place: "Laguna University, Santa Cruz, Laguna",
    year: "",
  },
];

const work = {
  title: "Featured work",
  blurb: "Films and projects I have been part of. Open any card to see videos, photos, and details.",
};

const showreels = {
  title: "Watch my reels",
  blurb: "A few short reels from acting to behind the camera. They play one by one, or pick the one you want.",
  autoPlay: true,
  intervalSeconds: 8,
  items: [],
};

const offCamera = {
  bagImage: "",
  bagTitle: "Erica's skills",
  items: [],
};

// "cover" is the card image. "images" are shown in the gallery when you press See more.
const projects = [
  {
    id: "edel",
    title: "EDEL",
    subtitle: "Sa Pagdating ng Takipsilim",
    role: "Production staff and actress",
    year: "",
    location: "",
    reelUrl: "",
    summary: "A short film about love and loss as the day turns to dusk.",
    description: [],
    cover: "/images/projects/edel/cover.jpg",
    images: [
      { src: "/images/projects/edel/1.jpg", caption: "Behind the scenes" },
      { src: "/images/projects/edel/2.jpg", caption: "On set" },
      { src: "/images/projects/edel/3.jpg", caption: "Film still" },
      { src: "/images/projects/edel/4.jpg", caption: "With the cast" },
    ],
  },
];

// Add your certificates. "image" is a photo or scan of the certificate.
const certifications = {
  title: "Certifications",
  blurb: "Trainings, workshops, and awards. Open any card to view the full certificate.",
  items: [],
};

// Content for the CV page (#/cv). Education, certifications, and contact details
// are taken from the other sections above, so you only edit them once.
const cv = {
  fileName: "Erica-CV", // name of the PDF file when saved
  email: "",
  headline: "Actress and Production Staff",
  summary:
    "Communication graduate from Laguna with experience in film acting and production support.",
  experience: [
    {
      role: "Production Staff and Actress",
      org: "EDEL: Sa Pagdating ng Takipsilim (short film)",
      location: "Laguna, Philippines",
      period: "",
      bullets: [],
    },
  ],
  skills: [
    { group: "Acting", items: ["Scene work", "Script analysis", "Improvisation"] },
    { group: "Production", items: ["Set assistance", "Scheduling", "Call sheets"] },
    { group: "Communication", items: ["Public speaking", "Writing", "Social media"] },
    { group: "Software", items: ["Microsoft Office", "Canva", "CapCut"] },
  ],
  languages: ["Filipino (native)", "English (fluent)"],
};

const contact = {
  title: "Let's work together",
  text: "Open to acting roles, production work, and film collaborations around Laguna and Metro Manila.",
};

// Look of the site (chosen in the admin panel > Appearance)
const theme = {
  autoMode: true,
  mode: "light",
  palette: "dusk",
  logoText: "E",
  logoImage: "",
  loaderStyle: "ring",
  accent: "", // optional custom colors (empty = use the palette)
  highlight: "",
  fonts: { heading: "Poppins", body: "DM Sans", accent: "Lora" },
};

// Which sections to show on the website (admin panel > Settings)
const sections = { home: true, about: true, showreels: true, work: true, offCamera: true, certifications: true, contact: true };

export const defaultContent = {
  theme,
  sections,
  settings,
  profile,
  about,
  background,
  work,
  showreels,
  projects,
  offCamera,
  certifications,
  cv,
  contact,
};