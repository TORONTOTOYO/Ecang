import { lazy, Suspense, useState, useEffect, useRef } from "react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Showreels from "./components/Showreels.jsx";
import Work from "./components/Work.jsx";
import Certifications from "./components/Certifications.jsx";
import Contact from "./components/Contact.jsx";
import CvPage from "./components/CvPage.jsx";
import Loader from "./components/Loader.jsx";
import HomeSkeleton from "./components/HomeSkeleton.jsx";
import { useContent, useContentReady } from "./content/ContentContext.jsx";
import { applyTheme, getNextModeChangeDelay, getThemeMode } from "./theme.js";

// The admin panel is loaded only when someone opens #/admin,
// so regular visitors never download it.
const AdminPage = lazy(() => import("./admin/AdminPage.jsx"));

// How long the loading screen shows when switching pages (milliseconds)
const LOADING_TIME = 800;
const LOADING_LABELS = { cv: "Opening CV", home: "Back to portfolio", admin: "Opening admin" };

// Pages, chosen by the URL hash: #/cv, #/admin, or anything else for the portfolio.
function getPage(initialPage = "home") {
  if (typeof window === "undefined") return initialPage;
  const hash = window.location.hash;
  if (hash === "#/cv") return "cv";
  if (hash === "#/admin") return "admin";
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/cv") return "cv";
  if (path === "/admin") return "admin";
  return "home";
}

export default function App({ initialPage, initialMode } = {}) {
  const contentReady = useContentReady();
  const { theme, sections } = useContent();
  const [mode, setMode] = useState(() => initialMode || getThemeMode(theme));
  const [page, setPage] = useState(() => getPage(initialPage));
  const [loadingTo, setLoadingTo] = useState(null); // page we are loading, or null
  const currentPage = useRef(page);
  const timer = useRef(null);

  useEffect(() => {
    setMode(getThemeMode(theme));
    if (theme.autoMode === false) return undefined;
    const timerId = setTimeout(() => setMode(getThemeMode(theme)), getNextModeChangeDelay());
    return () => clearTimeout(timerId);
  }, [mode, theme]);

  useEffect(() => {
    applyTheme(theme, mode);
  }, [theme, mode]);

  // When the hash changes, show the loading screen, then switch pages.
  useEffect(() => {
    const onHashChange = () => {
      const next = getPage();
      clearTimeout(timer.current);

      // Back on the page that is already showing: cancel loading
      if (next === currentPage.current) {
        setLoadingTo(null);
        return;
      }

      setLoadingTo(next);
      timer.current = setTimeout(() => {
        currentPage.current = next;
        setPage(next);
        setLoadingTo(null);
      }, LOADING_TIME);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      clearTimeout(timer.current);
    };
  }, []);

  // Start at the top of each page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  // Stop scrolling behind the loading screen
  useEffect(() => {
    document.body.style.overflow = loadingTo ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [loadingTo]);

  const loader = loadingTo && <Loader label={LOADING_LABELS[loadingTo]} />;

  if (page === "admin") {
    return (
      <>
        <Suspense fallback={<Loader label="Opening admin" />}>
          <AdminPage />
        </Suspense>
        {loader}
      </>
    );
  }

  // Use a page-shaped skeleton while first-visit content loads.
  if (!contentReady) return page === "home" ? <HomeSkeleton /> : <Loader label="Loading" />;

  if (page === "cv") {
    return (
      <>
        <CvPage />
        {loader}
      </>
    );
  }

  return (
    <>
      <Nav />
      <main>
        {sections.home && <Hero />}
        {sections.about && <About />}
        {sections.showreels && <Showreels />}
        {sections.work && <Work />}
        {sections.certifications && <Certifications />}
        {sections.contact && <Contact />}
      </main>
      {loader}
    </>
  );
}
