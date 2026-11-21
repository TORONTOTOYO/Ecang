import { useEffect, useState } from "react";
import "../styles/admin.css";
import Loader from "../components/Loader.jsx";
import Login from "./Login.jsx";
import { isFirebaseConfigured, adminEmail, firebaseConfig } from "../firebase/app.js";
import { watchUser, logout, fetchAdminContent, saveAdminContent } from "./firebaseAdmin.js";
import { defaultContent } from "../content/defaultContent.js";
import { setIn } from "./helpers.js";
import HomeSection from "./sections/HomeSection.jsx";
import ProjectsSection from "./sections/ProjectsSection.jsx";
import CertificationsSection from "./sections/CertificationsSection.jsx";
import CvSection from "./sections/CvSection.jsx";
import ContactSection from "./sections/ContactSection.jsx";
import SettingsSection from "./sections/SettingsSection.jsx";
import AppearanceSection from "./sections/AppearanceSection.jsx";
import BrandLogo from "../components/BrandLogo.jsx";

// The admin tabs. To add a tab, add a line here and a section file in ./sections.
const TABS = [
  { id: "home", label: "Home and About", Section: HomeSection },
  { id: "projects", label: "Projects", Section: ProjectsSection },
  { id: "certs", label: "Certifications", Section: CertificationsSection },
  { id: "cv", label: "CV", Section: CvSection },
  { id: "contact", label: "Contact", Section: ContactSection },
  { id: "appearance", label: "Appearance", Section: AppearanceSection },
  { id: "settings", label: "Settings", Section: SettingsSection },
];

export default function AdminPage() {
  if (!isFirebaseConfigured) return <SetupNotice />;
  if (!adminEmail) return <SetupNotice missingEmail />;
  return <AuthGate />;
}

function SetupNotice({ missingEmail = false }) {
  return (
    <div className="adm adm-center">
      <div className="adm-panel adm-login">
        <h1>{missingEmail ? "Admin email is missing" : "Firebase is not set up yet"}</h1>
        <p className="adm-hint">
          {missingEmail ? (
            <>Add your admin Gmail address to the <code>.env</code> file as <code>VITE_ADMIN_EMAIL=you@gmail.com</code>, then restart <code>npm run dev</code>.</>
          ) : (
            <>Copy the file <code>.env.example</code> to <code>.env</code>, fill in your Firebase details, and restart <code>npm run dev</code>. The README explains each step.</>
          )}
        </p>
        <a className="adm-link" href="#home">← Back to the website</a>
      </div>
    </div>
  );
}

// Shows the login form, or the editor once the admin is signed in.
// Only the email in VITE_ADMIN_EMAIL may enter. Anyone else is signed out right away.
function AuthGate() {
  const [user, setUser] = useState(undefined); // undefined = checking, null = signed out
  const [denied, setDenied] = useState(false);

  useEffect(
    () =>
      watchUser(async (signedIn) => {
        const notAllowed = signedIn && signedIn.email?.toLowerCase() !== adminEmail.toLowerCase();
        if (notAllowed) {
          setDenied(true);
          setUser(null);
          await logout();
          return;
        }
        if (signedIn) setDenied(false);
        setUser(signedIn);
      }),
    []
  );

  if (user === undefined) return <Loader label="Checking login" />;
  if (!user) return <Login notice={denied ? "This account is not allowed to use the admin panel." : ""} />;
  return <Editor user={user} />;
}

function Editor({ user }) {
  const [draft, setDraft] = useState(null);      // content being edited
  const [savedJson, setSavedJson] = useState(""); // what is currently saved
  const [tab, setTab] = useState(TABS[0].id);
  const [status, setStatus] = useState({ kind: "", text: "" });

  // Load the latest saved content
  useEffect(() => {
    fetchAdminContent()
      .then((content) => {
        setDraft(content);
        setSavedJson(JSON.stringify(content));
      })
      .catch((error) => setStatus({ kind: "error", text: `Could not load your content: ${error.message}` }));
  }, []);

  const dirty = draft !== null && JSON.stringify(draft) !== savedJson;

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (path, value) => setDraft((current) => setIn(current, path, value));

  const save = async () => {
    setStatus({ kind: "busy", text: "Saving..." });
    try {
      await saveAdminContent(draft);
      setSavedJson(JSON.stringify(draft));
      setStatus({ kind: "ok", text: "Saved. Your website is updated." });
    } catch (error) {
      setStatus({
        kind: "error",
        text: error.code === "permission-denied"
          ? `Not allowed to save. Signed in as ${user.email}, project "${firebaseConfig.projectId}". In Firebase > Firestore Database > Rules, the email must match this exactly and the rules must be published.`
          : `Could not save: ${error.message}`,
      });
    }
  };

  const reset = () => {
    if (window.confirm("Replace everything in the editor with the sample content?")) setDraft(defaultContent);
  };

  if (!draft) {
    return status.kind === "error" ? (
      <div className="adm adm-center"><p className="adm-error">{status.text}</p></div>
    ) : (
      <Loader label="Loading your content" />
    );
  }

  const { Section } = TABS.find((t) => t.id === tab);

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-top-inner">
          <div className="adm-brand">
            <BrandLogo className="logo" />
            <div>
              <strong>Admin</strong>
              <small>{user.email}</small>
            </div>
          </div>

          <div className="adm-top-actions">
            <span className={`adm-status ${status.kind}`} role="status">
              {dirty ? "Unsaved changes" : status.text}
            </span>
            <a className="btn btn-sm btn-outline" href={window.location.pathname} target="_blank" rel="noopener">View site</a>
            <button className="btn btn-sm" onClick={save} disabled={!dirty || status.kind === "busy"}>Save changes</button>
            <button className="adm-link" onClick={logout}>Log out</button>
          </div>
        </div>

        <nav className="adm-tabs" aria-label="Sections">
          {TABS.map((t) => (
            <button key={t.id} className={t.id === tab ? "adm-tab active" : "adm-tab"} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="adm-main">
        <Section content={draft} update={update} onReset={reset} />
      </main>
    </div>
  );
}
