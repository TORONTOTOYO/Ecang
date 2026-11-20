import { useState, useCallback } from "react";
import { work, projects } from "../data.js";
import SafeImage from "./SafeImage.jsx";
import CardList from "./CardList.jsx";
import Modal from "./Modal.jsx";
import Gallery from "./Gallery.jsx";

export default function Work() {
  const [openId, setOpenId] = useState(null); // project shown in the pop-up window
  const close = useCallback(() => setOpenId(null), []);

  if (projects.length === 0) return null;

  const project = projects.find((p) => p.id === openId);
  const images = project?.images || [];

  return (
    <section id="work" className="work">
      <div className="section-head">
        <h2 className="section-title">{work.title}</h2>
        <p>{work.blurb}</p>
      </div>

      {/* One card per project */}
      <CardList label="Featured work">
        {projects.map((p, i) => (
          <article className="card" key={p.id}>
            <div className="card-media">
              <SafeImage src={p.cover} alt={`${p.title} cover photo`} index={i} />
            </div>
            <div className="card-body">
              <h3 className="card-title">{p.title}</h3>
              {p.subtitle && <p className="subtitle">{p.subtitle}</p>}
              {p.role && <span className="pill">{p.role}</span>}
              {p.summary && <p className="card-text">{p.summary}</p>}
              <div className="card-actions">
                <button className="btn btn-sm" onClick={() => setOpenId(p.id)} aria-haspopup="dialog">
                  See more
                </button>
              </div>
            </div>
          </article>
        ))}
      </CardList>

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
