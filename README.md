# Erica Portfolio (React + Vite + Firebase)

The website only **displays** content. The content lives in **Firebase**, and you change it
from a private **admin panel** at `/#/admin`: edit text, add or delete projects and
certificates, add image links, and update your CV. Nobody needs to touch the code.

    Visitors  -->  website  -->  reads content from Firebase (Firestore)
   Admin     -->  /#/admin -->  logs in (Firebase Auth) --> saves content (Firestore)

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
4. **Authentication (Google sign-in)**: Build > Authentication > Get started > Sign-in method >
   **Google** > Enable > choose a support email > Save. There is no password to create:
   you log in with your Google account. In Authentication > Users, copy your user's UID into
   `.env` as `VITE_ADMIN_UID=...`. Leave Email/Password turned off.
5. **Firestore**: Build > Firestore Database > Create database (production mode).
   Open **Rules**, paste the contents of `firestore.rules`, replace `PASTE_ADMIN_UID_HERE`
   with the same UID, and press **Publish**.
### Only one admin

Two layers keep everyone else out:
1. The admin page signs out any Google account whose Firebase UID does not match `VITE_ADMIN_UID`.
2. The Firebase rules only let that UID change content.
   This is the real protection. Even if someone got into the admin page, saving would fail.

## 3. Use the admin panel

1. Open http://localhost:5173/#/admin and press **Continue with Google**. Choose your admin Gmail.
2. Pick a tab: **Home and About**, **Projects**, **Certifications**, **CV**, **Contact**, **Appearance**, **Settings**.
3. Add, edit, reorder (arrows), or delete items. Click an item's name to open it.
4. In **Settings**, switch portfolio sections on or off. In **Appearance**, choose colors and fonts; day/night mode changes automatically at 6am and 6pm local time.
5. For photos, paste an image URL or use a file in `public/images/`.
6. Press **Save changes**. The website updates right away for new visitors.

The first time, the editor shows the sample content. Replace it with yours and press Save.
There is no link to the admin page on the website. Keep the address to yourself;
the real protection is your login plus the Firebase rules.

## 4. Publishing

    npm run build

Upload the `dist` folder to Netlify, Vercel, Firebase Hosting, or GitHub Pages.
Add your `.env` values in the host's settings (environment variables), and add your website
address in Firebase: Authentication > Settings > **Authorized domains**.

The production build prerenders the homepage and `/cv/` from the public `content/site` Firestore
document. Configure `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_PROJECT_ID` in the build environment
to include the latest saved content. If Firestore is unavailable during the build, it prerenders
the default content instead. React hydrates the generated HTML and refreshes content from Firestore.

Showreels are managed in the admin **Showreels** tab. Add a public, embed-enabled Facebook video or
reel URL; private Facebook videos cannot be played in the site carousel.

## Protected contact form (Vercel)

The public site does not store or display the recipient email. Configure these values in
Vercel > Project Settings > Environment Variables, then redeploy:

- `VITE_TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key. This is public and is used by the browser.
- `TURNSTILE_SECRET_KEY`: Turnstile secret key. Server-only; never prefix it with `VITE_`.
- `RESEND_API_KEY`: Resend API key for sending messages.
- `CONTACT_TO_EMAIL`: private recipient address.
- `CONTACT_FROM_EMAIL`: sender address on a domain verified with Resend.
- `CONTACT_ALLOWED_ORIGINS`: exact site origins, comma-separated, such as `https://example.com,https://www.example.com`.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST credentials for per-IP rate limiting.

Create a Cloudflare Turnstile widget for the deployed hostname, verify a sender domain with Resend,
and create an Upstash Redis database. The form fails closed if any service is missing or unavailable.
After deploying this version, sign in to the admin once; it removes the old email field from the
public Firestore content document. Firestore content is public-read by design, so do not store
private information in that document.

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

- The admin panel and the login code are loaded only on `/#/admin`, not for visitors.
- Photos load only when they are about to be seen.
- Publish with `npm run build`, not `npm run dev`.
- Keep the `package-lock.json` created by `npm install`.

## The CV page

The **CV** button opens `/#/cv`. **Download PDF** opens the print window: choose
"Save as PDF". The CV is built from the content you edit in the admin panel and uses an
ATS-friendly layout (one column, plain text, standard headings).
