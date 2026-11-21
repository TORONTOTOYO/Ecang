import { useState, useEffect } from "react";
import CvLink from "./CvLink.jsx";
import { useContent } from "../content/ContentContext.jsx";

export default function Hero() {
  const { profile } = useContent();
  // If the portrait file is missing, show a simple drawing instead
  const [portraitMissing, setPortraitMissing] = useState(!profile.portrait);
  useEffect(() => setPortraitMissing(!profile.portrait), [profile.portrait]);

  return (
    <section id="home" className="hero">
      <div className="hero-text">
        <h1>
          Hello, I'm<br />
          <em>{profile.name}.</em>
        </h1>
        <p className="role">{profile.role}</p>
        <p className="intro">{profile.intro}</p>
        <div className="hero-buttons">
          <a href="#work" className="btn">See my work</a>
          <CvLink className="btn-outline" />
        </div>
      </div>

      <div className="portrait">
        <div className="portrait-frame" />
        <div className="portrait-photo">
          {portraitMissing ? (
            <svg viewBox="0 0 420 540" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <circle cx="210" cy="215" r="70" fill="#F3D5C0" />
              <path d="M60 540c0-130 60-210 150-210s150 80 150 210z" fill="#9FB3E6" />
            </svg>
          ) : (
            <img
              src={profile.portrait}
              alt={`Portrait of ${profile.name}`}
              fetchPriority="high"
              decoding="async"
              onError={() => setPortraitMissing(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
