// DEFAULT CONTENT
// This is what the site shows when Firebase is not set up yet, or before the admin
// saves anything. Once you save in the admin panel (#/admin), the live content
// comes from Firebase instead and this file is only the starting point.
//
// Images: "/images/portrait/erica.jpg" points to public/images/portrait/erica.jpg.
// In the admin panel you can also upload a photo or paste an image link.

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
  text: "Write two or three short sentences here: who you are, what you do, and what you want to work on next.",
};

const background = [
  {
    title: "Bachelor of Arts in Communication",
    place: "Laguna University, Santa Cruz, Laguna",
    year: "Add year",
  },
  {
    title: "Senior High School, with honors",
    place: "Add school name, Laguna",
    year: "Add year",
  },
  {
    title: "Elementary Education, with honors",
    place: "Add school name, Laguna",
    year: "Add year",
  },
];

const work = {
  title: "Featured work",
  blurb: "Films and projects I have been part of. Open any card to see more photos and details.",
};

// Add as many projects as you like: copy one block and change the values.
// "cover" is the card image. "images" are shown in the gallery when you press See more.
const projects = [
  {
    id: "edel",
    title: "EDEL",
    subtitle: "Sa Pagdating ng Takipsilim",
    role: "Production staff and actress",
    year: "Add year",
    summary: "A short film about love and loss as the day turns to dusk.",
    description: [
      "Write two or three sentences about this film: the story, where it was shot, and what it meant to you.",
      "Then describe your part: what you did as production staff and the role you played as an actress.",
    ],
    cover: "/images/projects/edel/cover.jpg",
    images: [
      { src: "/images/projects/edel/1.jpg", caption: "Behind the scenes" },
      { src: "/images/projects/edel/2.jpg", caption: "On set" },
      { src: "/images/projects/edel/3.jpg", caption: "Film still" },
      { src: "/images/projects/edel/4.jpg", caption: "With the cast" },
    ],
  },
  {
    id: "project-2",
    title: "Your second project",
    subtitle: "Add a subtitle",
    role: "Add your role",
    year: "Add year",
    summary: "Write one short sentence about this project.",
    description: ["Describe the project and what you did here."],
    cover: "/images/projects/project-2/cover.jpg",
    images: [
      { src: "/images/projects/project-2/1.jpg", caption: "Photo 1" },
      { src: "/images/projects/project-2/2.jpg", caption: "Photo 2" },
      { src: "/images/projects/project-2/3.jpg", caption: "Photo 3" },
    ],
  },
  {
    id: "project-3",
    title: "Your third project",
    subtitle: "Add a subtitle",
    role: "Add your role",
    year: "Add year",
    summary: "Write one short sentence about this project.",
    description: ["Describe the project and what you did here."],
    cover: "/images/projects/project-3/cover.jpg",
    images: [
      { src: "/images/projects/project-3/1.jpg", caption: "Photo 1" },
      { src: "/images/projects/project-3/2.jpg", caption: "Photo 2" },
      { src: "/images/projects/project-3/3.jpg", caption: "Photo 3" },
    ],
  },
];

// Add your certificates. "image" is a photo or scan of the certificate.
const certifications = {
  title: "Certifications",
  blurb: "Trainings, workshops, and awards. Open any card to view the full certificate.",
  items: [
    {
      title: "Add certificate title",
      issuer: "Add the school or organization",
      date: "Add date",
      image: "/images/certificates/cert-1.jpg",
    },
    {
      title: "Add certificate title",
      issuer: "Add the school or organization",
      date: "Add date",
      image: "/images/certificates/cert-2.jpg",
    },
    {
      title: "Add certificate title",
      issuer: "Add the school or organization",
      date: "Add date",
      image: "/images/certificates/cert-3.jpg",
    },
  ],
};

// Content for the CV page (#/cv). Education, certifications, and contact details
// are taken from the other sections above, so you only edit them once.
const cv = {
  fileName: "Erica-CV", // name of the PDF file when saved
  headline: "Actress and Production Staff",
  summary:
    "Communication graduate from Laguna with experience in film acting and production support. Write two or three sentences about your strengths, the roles you want, and what you bring to a team.",
  experience: [
    {
      role: "Production Staff and Actress",
      org: "EDEL: Sa Pagdating ng Takipsilim (short film)",
      location: "Laguna, Philippines",
      period: "Add year",
      bullets: [
        "Add what you did, starting with an action verb (for example: Performed, Assisted, Coordinated).",
        "Add a second achievement or responsibility from this project.",
      ],
    },
    {
      role: "Add your role",
      org: "Add project or organization",
      location: "Add location",
      period: "Add year",
      bullets: ["Add what you did here."],
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
  email: "erica@email.com",
  phone: "+63 900 000 0000",
  location: "Laguna, Philippines",
};

export const defaultContent = {
  settings,
  profile,
  about,
  background,
  work,
  projects,
  certifications,
  cv,
  contact,
};
