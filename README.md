# Erica Portfolio (React + Vite + Firebase)

The website only **displays** content. The content lives in **Firebase**, and you change it
from a private **admin panel** at `/#/admin`: edit text, add or delete projects and
certificates, upload photos, and update your CV. Nobody needs to touch the code.

    Visitors  -->  website  -->  reads content from Firebase (Firestore)
    Admin     -->  /#/admin -->  logs in (Firebase Auth) --> saves content + uploads photos (Storage)

## 1. Run it on your computer

1. Install Node.js (version 18 or newer) from https://nodejs.org
2. In this folder run:

       npm install
       npm run dev

3. Open http://localhost:5173

Without Firebase the site works too, using the sample text in `src/content/defaultContent.js`.

## 2. Set up Firebase (one time, about 10 minutes)

1. Go to https://console.firebase.google.com and click **Add project**.
2. **Add a web app**: Project overview > the `</>` icon > give it a name > Register.
   Copy the `firebaseConfig` values shown.
3. In this folder, copy `.env.example` to a new file named `.env` and paste the values:

       VITE_FIREBASE_API_KEY=...
       VITE_FIREBASE_AUTH_DOMAIN=...
       (and so on)

   Then stop and restart `npm run dev`.
4. **Authentication**: Build > Authentication > Get started > Sign-in method > turn on
   **Email/Password**. Then open the **Users** tab > **Add user** and create your admin
   email and password. Copy the **User UID** shown in the list. Put that same email in
   `.env` as `VITE_ADMIN_EMAIL=`.
   Also, if you see it, turn off new sign-ups so nobody else can create an account:
   Authentication > Settings > User actions > untick **Enable create (sign-up)**.
5. **Firestore**: Build > Firestore Database > Create database (production mode).
   Open **Rules**, paste the contents of `firestore.rules`, replace `PASTE_ADMIN_UID_HERE`
   with your User UID, and press **Publish**.
6. **Storage (for photo uploads)**: Build > Storage > Get started. Open **Rules**, paste the
   contents of `storage.rules` with your User UID, and press **Publish**.
   Note: Firebase currently requires the Blaze (pay as you go) plan to use Storage. It has a
   free monthly allowance that a portfolio will normally stay within, but check the Firebase
   pricing page. If you prefer not to use Storage, skip this step and paste image links
   (or use files in `public/images/`) in the admin panel instead.

### Only one admin

Three layers keep everyone else out:
1. You create the single admin account yourself, and the login page has no sign-up.
2. The admin page signs out any email that is not `VITE_ADMIN_EMAIL`.
3. The Firebase rules only let your admin User UID change content or upload photos.
   This is the real protection. Even if someone got into the admin page, saving would fail.

## 3. Use the admin panel

1. Open http://localhost:5173/#/admin and log in with the admin email and password.
2. Pick a tab: **Home and About**, **Projects**, **Certifications**, **CV**, **Contact**, **Settings**.
3. Add, edit, reorder (arrows), or delete items. Click an item's name to open it.
4. For photos, press **Upload photo** (photos are made smaller automatically) or paste an image link.
5. Press **Save changes**. The website updates right away for new visitors.

The first time, the editor shows the sample content. Replace it with yours and press Save.
There is no link to the admin page on the website. Keep the address to yourself;
the real protection is your login plus the Firebase rules.

## 4. Publishing

    npm run build

Upload the `dist` folder to Netlify, Vercel, Firebase Hosting, or GitHub Pages.
Add your `.env` values in the host's settings (environment variables), and add your website
address in Firebase: Authentication > Settings > **Authorized domains**.

## Where to change things in the code

| I want to change...                      | Open this file                         |
| ---------------------------------------- | -------------------------------------- |
| Colors, fonts, page margins              | top of `src/styles/base.css`           |
| How one section looks                    | the matching file in `src/styles/`     |
| How one section is built                 | the matching file in `src/components/` |
| What the admin panel can edit            | `src/admin/sections/`                  |
| The starting (sample) content            | `src/content/defaultContent.js`        |
| How long the loading screen shows        | `LOADING_TIME` in `src/App.jsx`        |

### Folders

    src/
      components/   the website sections (Nav, Hero, About, Work, Certifications, Contact, CV...)
      content/      loads the content: defaultContent.js, contentService.js (Firebase), ContentContext.jsx
      firebase/     app.js (connects to Firebase using .env)
      admin/        the admin panel: AdminPage, Login, fields, sections/
      styles/       one CSS file per part of the page (admin.css is only for the admin)

### How the content is stored

All content is one Firestore document: `content/site`. Every visit is one read.
Returning visitors see a saved copy instantly while the newest content loads in the background.
To add a new editable field: add it to `defaultContent.js`, add an input for it in the matching
file in `src/admin/sections/`, and show it in the matching component.

## Keeping the site fast

- Photos uploaded through the admin panel are resized (max 1600px wide) and compressed.
- The admin panel and the login code are loaded only on `/#/admin`, not for visitors.
- Photos load only when they are about to be seen.
- Publish with `npm run build`, not `npm run dev`.
- Keep the `package-lock.json` created by `npm install`.

## The CV page

The **CV** button opens `/#/cv`. **Download PDF** opens the print window: choose
"Save as PDF". The CV is built from the content you edit in the admin panel and uses an
ATS-friendly layout (one column, plain text, standard headings).
