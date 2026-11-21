import { useEffect, useState } from "react";
import { useContent } from "../content/ContentContext.jsx";

export default function BrandLogo({ className }) {
  const { theme } = useContent();
  const image = theme.logoImage?.trim();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [image]);

  return (
    <span className={className} aria-hidden="true">
      {image && !imageFailed ? (
        <img src={image} alt="" onError={() => setImageFailed(true)} />
      ) : (
        (theme.logoText || "E")
      )}
    </span>
  );
}