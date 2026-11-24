import { useState } from "react";
import { useContent } from "../content/ContentContext.jsx";
import SafeImage from "./SafeImage.jsx";

export default function OffCamera() {
  const { offCamera } = useContent();
  const [selected, setSelected] = useState(null);
  const items = offCamera.items || [];
  const midpoint = Math.ceil(items.length / 2);

  if (!items.length && !offCamera.bagImage) return null;

  const renderItems = (group, offset) => (
    <div className="off-camera-items">
      {group.map((item, index) => {
        const key = item.id || offset + index;
        const active = selected === key;
        return (
          <div className="off-camera-item" key={key}>
            <button type="button" className="off-camera-item-button" onClick={() => setSelected(active ? null : key)} aria-label={item.label || "Skill"} aria-pressed={active}>
              {item.image ? <SafeImage key={item.image} src={item.image} alt="" className="off-camera-item-image" index={offset + index} /> : <span aria-hidden="true">{item.symbol || "✦"}</span>}
            </button>
            {item.label && <span className={active ? "off-camera-item-label visible" : "off-camera-item-label"}>{item.label}</span>}
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="off-camera" className="off-camera" aria-label="Erica's skill">
      <div className={offCamera.bagImage ? "off-camera-layout" : "off-camera-layout no-center-image"}>
        <div className="off-camera-left">{renderItems(items.slice(0, midpoint), 0)}</div>
        {offCamera.bagImage && (
          <div className="off-camera-center">
            <SafeImage key={offCamera.bagImage} src={offCamera.bagImage} alt={offCamera.bagTitle || "Erica's skills"} className="off-camera-center-image" />
          </div>
        )}
        <div className="off-camera-right">{renderItems(items.slice(midpoint), midpoint)}</div>
      </div>
    </section>
  );
}
