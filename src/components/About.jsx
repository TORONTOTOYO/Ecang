import { useContent } from "../content/ContentContext.jsx";
import ReadMoreModal from "./ReadMoreModal.jsx";

const TEXT_PREVIEW_LENGTH = 400; // Characters before "Read More" appears

export default function About() {
  const { about, background } = useContent();

  const isTooLong = about.text && about.text.length > TEXT_PREVIEW_LENGTH;
  const displayText = isTooLong ? about.text.substring(0, TEXT_PREVIEW_LENGTH) : about.text;

  return (
    <section id="about" className="about">
      <div>
        <h2 className="section-title">{about.title}</h2>
        {about.text && (
          <ReadMoreModal title={about.title} text={about.text}>
            {(isOpen, setIsOpen) => (
              <div>
                <p>
                  {displayText}
                  {isTooLong && (
                    <>
                      {" "}...{" "}
                      <button
                        className="read-more-btn"
                        onClick={() => setIsOpen(true)}
                      >
                        Read More
                      </button>
                    </>
                  )}
                </p>
              </div>
            )}
          </ReadMoreModal>
        )}
      </div>

      <div>
        <h2 className="section-title">My background</h2>
        <ol className="timeline">
          {background.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.place}</span>
              <em>{item.year}</em>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
