import { useState } from "react";
import { useContent } from "../content/ContentContext.jsx";
import SafeImage from "./SafeImage.jsx";

export default function Skills() {
  const { offCamera } = useContent();
  const [selected, setSelected] = useState(null);
  const items = offCamera.items || [];
  const midpoint = Math.ceil(items.length / 2);

  if (!items.length && !offCamera.bagImage) return null;

  const renderItems = (group, offset) => (
    <div className="skills-items">
      {group.map((item, index) => {
        const key = item.id || offset + index;
        const active = selected === key;
        return (
          <div className="skills-item" key={key}>
            <button type="button" className="skills-item-button" onClick={() => setSelected(active ? null : key)} aria-label={item.label || "Skill"} aria-pressed={active}>
              {item.image ? <SafeImage key={item.image} src={item.image} alt="" className="skills-item-image" index={offset + index} /> : <span aria-hidden="true">{item.symbol || "✦"}</span>}
            </button>
            {item.label && <span className={active ? "skills-item-label visible" : "skills-item-label"}>{item.label}</span>}
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="skills" className="skills" aria-label="Erica's skills">
      <div className={offCamera.bagImage ? "skills-layout" : "skills-layout no-center-image"}>
        <div className="skills-left">{renderItems(items.slice(0, midpoint), 0)}</div>
        {offCamera.bagImage && (
          <div className="skills-center">
            <SafeImage key={offCamera.bagImage} src={offCamera.bagImage} alt={offCamera.bagTitle || "Erica's skills"} className="skills-center-image" />
          </div>
        )}
        <div className="skills-right">{renderItems(items.slice(midpoint), midpoint)}</div>
      </div>
    </section>
  );
}
