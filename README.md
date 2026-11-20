# Erica Portfolio (React + Vite)

## Run it on your computer

1. Install Node.js (version 18 or newer) from https://nodejs.org
2. Open a terminal in this folder and run:

       npm install
       npm run dev

3. Your browser opens at http://localhost:5173

## Where to change things

| I want to change...                          | Open this file                |
| -------------------------------------------- | ----------------------------- |
| My text, projects, certificates, CV, contact | `src/data.js`                 |
| My photos                                    | `public/images/` (see below)  |
| Colors, fonts, page margins                  | top of `src/styles/base.css`  |
| How one section looks                        | the matching file in `src/styles/` |
| How one section is built                     | the matching file in `src/components/` |
| How long the loading screen shows            | `LOADING_TIME` in `src/App.jsx` |

### Style files (`src/styles/`)

Each file styles one part of the page and holds its own phone and tablet rules at the bottom.

    base.css       colors, fonts, buttons, small shared pieces
    nav.css        logo and menu (hamburger on phones)
    hero.css       greeting and portrait
    about.css      "Who am I?" and the timeline
    cards.css      project and certificate cards, including the hover effect
    carousel.css   the carousel
    work.css       Featured work and Certifications sections
    modal.css      pop-up windows and photo gallery
    contact.css    contact card
    cv.css         CV page and PDF printing
    loader.css     loading screen

### Component files (`src/components/`)

    Nav, Hero, About, Work, Certifications, Contact   the sections, top to bottom
    CardList      cards in a row, or a carousel when there are more than 3
    Carousel      the carousel itself
    Modal         the pop-up window
    Gallery       the photo gallery in the project pop-up
    SafeImage     shows a placeholder when a photo file is missing
    CvPage        the CV page
    CvLink        the "CV" button
    Loader        the loading screen

## Where to put your images

All images go in `public/images/`:

    public/images/
      portrait/           erica.jpg
      projects/
        edel/             cover.jpg, 1.jpg, 2.jpg, 3.jpg, 4.jpg
        project-2/        cover.jpg, 1.jpg, 2.jpg, 3.jpg
        project-3/        cover.jpg, 1.jpg, 2.jpg, 3.jpg
      certificates/       cert-1.jpg, cert-2.jpg, cert-3.jpg

Save a file with the same name and refresh the page: it appears automatically.
If a file is missing, the site shows a colored placeholder instead.
Using .png or a different file name? Change the path in `src/data.js`.

## Adding or removing projects and certificates

Copy or delete a block in the `projects` or `certifications` list in `src/data.js`.
- 1 to 3 cards stay centered in a row
- More than 3 becomes a swipeable carousel (change the number with `carouselAfter`)
- If a list is empty, that section and its menu link are hidden

## CV page

The **CV** button in the hero opens a CV page at `http://localhost:5173/#/cv`.
**Download PDF** opens the print window: choose "Save as PDF" and turn off "Headers and footers".

The CV is built from `src/data.js`:
- `cv`: headline, summary, experience, skills, languages, PDF file name
- `background`: shown as Education
- `certifications`: shown as Certifications
- `contact`: shown under your name

The layout is ATS-friendly: one column, standard section names, Arial text, and no tables, photos, or icons.
Tips: use real dates, start each bullet with an action verb, and use keywords from the job post.

## Keeping the site fast

The code does not slow down as you add content. The thing that can is **image size**.

- Compress photos before adding them (free tools: squoosh.app or tinypng.com).
  Good targets: portrait about 900px wide and under 200 KB; project covers about
  1200px wide and under 250 KB; gallery photos about 1600px wide and under 400 KB;
  certificates under 300 KB. WebP or JPG work best.
- Do not use phone or camera originals (often 3 to 10 MB each).
- Publish with `npm run build`, not `npm run dev`. The build makes the code smaller and faster.
- Keep the `package-lock.json` file that `npm install` creates. It locks the library
  versions so the site behaves the same later.
- Photos load only when they are about to be seen, and the carousel only does work
  when it moves, so adding more projects is fine.

## Build for publishing

    npm run build

The finished site is created in the `dist` folder. Upload it to Netlify, Vercel, or GitHub Pages.
