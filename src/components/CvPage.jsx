import { useEffect } from "react";
import { useContent } from "../content/ContentContext.jsx";

// ATS-friendly layout: one column, standard section names, plain text,
// no tables, icons, photos, or graphics. Saved PDFs keep selectable text.
export default function CvPage() {
  const { profile, background, certifications, cv } = useContent();
  // The browser uses the page title as the default PDF file name.
  useEffect(() => {
    const previous = document.title;
    document.title = cv.fileName;
    return () => { document.title = previous; };
  }, []);

  return (
    <div className="cv-page">
      <div className="cv-toolbar">
        <button className="btn" onClick={() => window.print()}>
          Download PDF
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" />
          </svg>
        </button>
      </div>
      <p className="cv-hint">
        In the window that opens, set the destination to “Save as PDF”. If a date or web address still appears, turn off “Headers and footers”.
      </p>

      <article className="cv-sheet">
        <div className="cv-space head" aria-hidden="true" />
        <div className="cv-content">
        <h1>{profile.name}</h1>
        <p className="cv-headline">{cv.headline}</p>
        {cv.email && (
          <p>
            <a className="cv-email" href={`mailto:${cv.email}`}>{cv.email}</a>
          </p>
        )}

        <h2>Professional Summary</h2>
        <p>{cv.summary}</p>

        <h2>Experience</h2>
        {cv.experience.map((job, i) => (
          <div className="cv-entry" key={i}>
            <div className="cv-row">
              <strong>{job.role}</strong>
              <span>{job.period}</span>
            </div>
            <div className="cv-row">
              <span>{job.org}</span>
              <span>{job.location}</span>
            </div>
            <ul>{job.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
          </div>
        ))}

        <h2>Education</h2>
        {background.map((item, i) => (
          <div className="cv-entry" key={i}>
            <div className="cv-row">
              <strong>{item.title}</strong>
              <span>{item.year}</span>
            </div>
            <div>{item.place}</div>
          </div>
        ))}

        <h2>Skills</h2>
        <ul>
          {cv.skills.map((g) => (
            <li key={g.group}><strong>{g.group}:</strong> {g.items.join(", ")}</li>
          ))}
        </ul>

        {certifications.items.length > 0 && (
          <>
            <h2>Certifications</h2>
            <ul>
              {certifications.items.map((c, i) => (
                <li key={i}>
                  {[c.title, c.issuer, c.date].filter(Boolean).join(", ")}
                </li>
              ))}
            </ul>
          </>
        )}

        {cv.languages.length > 0 && (
          <>
            <h2>Languages</h2>
            <p>{cv.languages.join(", ")}</p>
          </>
        )}
        </div>
        <div className="cv-space foot" aria-hidden="true" />
      </article>
    </div>
  );
}
