import { useState } from "react";

export default function ReadMoreModal({ title, text, children }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!children) return null;

  // Format text with better spacing between sentences for professional appearance
  const formatProfessionalText = (text) => {
    return text
      .split(/(?<=[.!?])\s+(?=[A-Z])/g) // Split on sentence boundaries
      .map((sentence, idx) => (
        <p key={idx}>{sentence.trim()}</p>
      ));
  };

  return (
    <>
      {children(isOpen, setIsOpen)}

      {isOpen && (
        <div className="read-more-backdrop" onClick={() => setIsOpen(false)}>
          <div className="read-more-modal" onClick={(e) => e.stopPropagation()}>
            <div className="read-more-header">
              <h2>{title}</h2>
              <button
                className="read-more-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close modal"
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="read-more-content">
              {formatProfessionalText(text)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
