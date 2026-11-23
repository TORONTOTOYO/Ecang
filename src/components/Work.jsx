import { useState, useCallback } from "react";
import { useContent } from "../content/ContentContext.jsx";
import SafeImage from "./SafeImage.jsx";
import Carousel from "./Carousel.jsx";
import Modal from "./Modal.jsx";
import Gallery from "./Gallery.jsx";

export default function Work() {
  const { work, projects } = useContent();
  const [selectedProject, setSelectedProject] = useState(null);
  const close = useCallback(() => setSelectedProject(null), []);
  const featured = projects[0];
  const remaining = projects.slice(1);

  if (!featured) return null;

  const project = selectedProject;
  const images = project?.images || [];

  return (
    <section id="work" className="work">
      <div className="section-head">
        <div>
          <h2 className="section-title">{work.title}</h2>
        </div>
        <p>{work.blurb}</p>
      </div>

      <article className="work-featured">
        <SafeImage className="work-featured-image" src={featured.cover} alt={`${featured.title} cover photo`} index={0} />
        <div className="work-featured-content">
          <span className="work-featured-label">Featured project</span>
          <h3>{featured.title}</h3>
          {featured.subtitle && <p className="work-featured-subtitle">{featured.subtitle}</p>}
          <p className="work-featured-meta">
            {[featured.role, featured.year].filter(Boolean).join(" · ")}
          </p>
          {featured.summary && <p className="work-featured-summary">{featured.summary}</p>}
          <button className="work-featured-action" onClick={() => setSelectedProject(featured)} aria-haspopup="dialog">
            See more <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>

      {remaining.length > 0 && (
        <div className="work-carousel" style={{ "--work-card-count": Math.min(3, remaining.length) }}>
          <Carousel label="More featured projects">
            {remaining.map((project, index) => (
              <article className="work-card" key={project.id}>
                <SafeImage className="work-card-image" src={project.cover} alt={`${project.title} cover photo`} index={index + 1} />
                <div className="work-card-body">
                  <h3>{project.title}</h3>
                  {project.role && <p className="work-card-meta">{[project.role, project.year].filter(Boolean).join(" · ")}</p>}
                  <button className="work-card-action" onClick={() => setSelectedProject(project)} aria-haspopup="dialog">
                    See more <span aria-hidden="true">·</span>
                  </button>
                </div>
              </article>
            ))}
          </Carousel>
        </div>
      )}

      {/* Pop-up window with the gallery and details */}
      {project && (
        <Modal onClose={close} label={project.title}>
          <div className={images.length ? "detail" : "detail single"}>
            <Gallery images={images} title={project.title} />
            <div className="detail-text">
              <h2>{project.title}</h2>
              {project.subtitle && <p className="subtitle">{project.subtitle}</p>}
              <p className="detail-meta">
                {project.role && <span className="pill">{project.role}</span>}
                {project.year && <span className="pill">{project.year}</span>}
              </p>
              {(project.description || []).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
