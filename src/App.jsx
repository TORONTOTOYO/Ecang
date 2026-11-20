import { useState, useEffect, useRef } from "react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Work from "./components/Work.jsx";
import Certifications from "./components/Certifications.jsx";
import Contact from "./components/Contact.jsx";
import CvPage from "./components/CvPage.jsx";
import Loader from "./components/Loader.jsx";

// How long the loading screen shows when switching pages (milliseconds)
const LOADING_TIME = 800;

// Two pages, chosen by the URL hash: "#/cv" shows the CV, anything else shows the portfolio.
const getPage = () => (window.location.hash === "#/cv" ? "cv" : "home");

export default function App() {
  const [page, setPage] = useState(getPage);
  const [loadingTo, setLoadingTo] = useState(null); // page we are loading, or null
  const currentPage = useRef(page);
  const timer = useRef(null);

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

  const loader = loadingTo && <Loader label={loadingTo === "cv" ? "Opening CV" : "Back to portfolio"} />;

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
        <Hero />
        <About />
        <Work />
        <Certifications />
        <Contact />
      </main>
      {loader}
    </>
  );
}
