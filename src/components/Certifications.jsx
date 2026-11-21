import { useState, useCallback } from "react";
import { useContent } from "../content/ContentContext.jsx";
import SafeImage from "./SafeImage.jsx";
import CardList from "./CardList.jsx";
import Modal from "./Modal.jsx";

export default function Certifications() {
  const { certifications } = useContent();
  const { title, blurb, items } = certifications;
  const [openIndex, setOpenIndex] = useState(null); // certificate shown in the pop-up window
  const close = useCallback(() => setOpenIndex(null), []);

  if (items.length === 0) return null;

  const cert = openIndex === null ? null : items[openIndex];

  return (
    <section id="certifications" className="certs">
      <div className="section-head">
        <h2 className="section-title">{title}</h2>
        <p>{blurb}</p>
      </div>

      {/* One card per certificate */}
      <CardList label="Certifications">
        {items.map((item, i) => (
          <article className="card" key={i}>
            <div className="card-media">
              <SafeImage src={item.image} alt={`Certificate: ${item.title}`} index={i + 2} />
            </div>
            <div className="card-body">
              <h3 className="card-title">{item.title}</h3>
              {item.issuer && <p className="card-text">{item.issuer}</p>}
              {item.date && <p className="date-tag">{item.date}</p>}
              <div className="card-actions">
                <button className="btn btn-sm btn-outline" onClick={() => setOpenIndex(i)} aria-haspopup="dialog">
                  View certificate
                </button>
              </div>
            </div>
          </article>
        ))}
      </CardList>

      {/* Pop-up window with the full certificate */}
      {cert && (
        <Modal onClose={close} label={cert.title}>
          <div className="cert-view">
            <div className="viewer cert-viewer">
              <SafeImage
                className="viewer-img"
                src={cert.image}
                alt={`Certificate: ${cert.title}`}
                index={openIndex + 2}
              />
            </div>
            <h2>{cert.title}</h2>
            {cert.issuer && <p className="muted">{cert.issuer}</p>}
            {cert.date && <p className="date-tag">{cert.date}</p>}
          </div>
        </Modal>
      )}
    </section>
  );
}
