import { useState } from "react";

const TINTS = ["tint-a", "tint-b", "tint-c", "tint-d"];

// Shows the image if it exists. If it is missing, shows a colored placeholder.
// "index" only picks which placeholder color to use.
export default function SafeImage({ src, alt, className = "", index = 0 }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className={`ph ${TINTS[index % TINTS.length]} ${className}`} role="img" aria-label={alt}>
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
