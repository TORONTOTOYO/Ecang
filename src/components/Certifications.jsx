import { useState, useCallback } from "react";
import { useContent } from "../content/ContentContext.jsx";
import SafeImage from "./SafeImage.jsx";
import Modal from "./Modal.jsx";

export default function Certifications() {
  const { certifications } = useContent();
  const { title, blurb, items } = certifications;
  const [openIndex, setOpenIndex] = useState(null); // certificate shown in the pop-up window
  const [showAllOpen, setShowAllOpen] = useState(false);
  const close = useCallback(() => setOpenIndex(null), []);
  const visibleItems = items.slice(0, 3);

  if (items.length === 0) return null;

  const cert = openIndex === null ? null : items[openIndex];

  return (
    <section id="certifications" className="certs">
      <div className="section-head">
        <h2 className="section-title">{title}</h2>
        <p>{blurb}</p>
      </div>

      <div className="cert-list-wrap">
        <ul className="cert-list">
          {visibleItems.map((item, i) => (
            <li className="cert-row" key={`${item.title}-${i}`}>
              <time className="cert-row-date">{item.date}</time>
              <div className="cert-row-copy">
                <h3>{item.title}</h3>
                {item.issuer && <p>{item.issuer}</p>}
              </div>
              <SafeImage className="cert-row-image" src={item.image} alt={`Certificate: ${item.title}`} index={i + 2} />
              <button className="cert-row-action" onClick={() => setOpenIndex(i)} aria-haspopup="dialog">
                View <span aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ul>
        {items.length > 3 && (
          <button
            className="cert-show-all"
            onClick={() => setShowAllOpen(true)}
            aria-haspopup="dialog"
          >
            Show all {items.length} certifications
          </button>
        )}
      </div>

      {showAllOpen && (
        <Modal onClose={() => setShowAllOpen(false)} label="All certifications">
          <div className="cert-all">
            <h2>All certifications</h2>
            <ul className="cert-grid">
              {items.map((item, index) => (
                <li className="cert-grid-card" key={`${item.title}-${index}`}>
                  <SafeImage className="cert-grid-image" src={item.image} alt={`Certificate: ${item.title}`} index={index + 2} />
                  <div className="cert-grid-copy">
                    {item.date && <time className="cert-row-date">{item.date}</time>}
                    <h3>{item.title}</h3>
                    {item.issuer && <p>{item.issuer}</p>}
                    <button
                      className="cert-row-action"
                      onClick={() => {
                        setShowAllOpen(false);
                        setOpenIndex(index);
                      }}
                      aria-haspopup="dialog"
                    >
                      View certificate <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}

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
