// ALL YOUR CONTENT LIVES IN THIS FILE.
// Change the text, then save: the site updates by itself.
//
// Images live in /public/images (see the README.txt inside that folder).
// A path like "/images/portrait/erica.jpg" points to public/images/portrait/erica.jpg
// If the file does not exist yet, a colored placeholder is shown instead.

// When a section has more cards than this number, it becomes a swipeable carousel.
export const settings = { carouselAfter: 3 };

export const profile = {
  name: "Erica",
  role: "Arts and Communication Student",
  intro:
    "I tell stories on screen and behind the camera. Take a look at my film work, my background, and how to reach me.",
  portrait: "/images/portrait/erica.png",
};

export const about = {
  title: "Who am I?",
  text: "",
};

export const background = [
  {
    title: "Bachelor of Arts in Communication",
    place: "Laguna University, Santa Cruz, Laguna",
    year: "2023-2027",
  },
  {
    title: "Trace College Los Banos",
    place: "Los Banos, Laguna",
    year: "2021-2023",
  },
  {
    title: "Los Banos National High School",
    place: "Los Banos, Laguna",
    year: "2018-2021",
  },
  {
    title: "Los Banos Elementary School",
    place: "Los Banos, Laguna",
    year: "2012-2018",
  },
];

export const work = {
  title: "Featured work",
  blurb: "Films and projects I have been part of.",
};

// "cover" is the card image. "images" are shown in the gallery when you press See more.
export const projects = [
  {
    id: "edel",
    title: "EDEL",
    subtitle: "EDEL",
    role: "Production staff and actress",
    year: "",
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
  {
    id: "takipsilim",
    title: "Sa Pagdating ng Takipsilim",
    subtitle: "Sa Pagdating ng Takipsilim",
    role: "Production staff and actress",
    year: "",
    summary: "A short film about love and loss as the day turns to dusk.",
    description: [],
    cover: "/images/projects/takipsilim/cover.jpg",
    images: [
      { src: "/images/projects/edel/1.jpg", caption: "Behind the scenes" },
      { src: "/images/projects/edel/2.jpg", caption: "On set" },
      { src: "/images/projects/edel/3.jpg", caption: "Film still" },
      { src: "/images/projects/edel/4.jpg", caption: "With the cast" },
    ],
  },

];

export const certifications = {
  title: "Certifications",
  blurb: "Trainings, workshops, and awards.",
  items: [],
};

// Content for the CV page (#/cv). Education, certifications, and contact details
// are taken from the other sections above, so you only edit them once.
export const cv = {
  fileName: "Erica-CV", // name of the PDF file when saved
  headline: "Actress and Production Staffs",
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

};

export const contact = {
  title: "Let's work together",
  text: "Open to acting roles, production work, and film collaborations around Laguna and Metro Manila.",
  email: "",
  phone: "",
  location: "Laguna, Philippines",
};

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About me", href: "#about" },
  { label: "Projects", href: "#work" },
  { label: "Certifications", href: "#certifications" },
];
