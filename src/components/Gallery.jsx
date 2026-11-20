import { useState } from "react";
import SafeImage from "./SafeImage.jsx";

// Photo gallery: one large photo with arrows, and small thumbnails below.
export default function Gallery({ images, title }) {
  const [index, setIndex] = useState(0); // which photo is showing
  const count = images.length;
  if (!count) return null;

  const current = images[index];
  const go = (step) => setIndex((index + step + count) % count);

  return (
    <div className="gallery">
      <div className="viewer">
        <SafeImage
          key={current.src}
          className="viewer-img"
          src={current.src}
          alt={current.caption || `${title} photo ${index + 1}`}
          index={index}
          hint
        />
        {count > 1 && (
          <>
            <button className="arrow prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>
            <button className="arrow next" onClick={() => go(1)} aria-label="Next photo">›</button>
          </>
        )}
      </div>

      <p className="caption">
        <span>{current.caption}</span>
        <span>{index + 1} / {count}</span>
      </p>

      {count > 1 && (
        <ul className="thumbs">
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                className={i === index ? "thumb active" : "thumb"}
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
              >
                <SafeImage className="thumb-img" src={image.src} alt="" index={i} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
