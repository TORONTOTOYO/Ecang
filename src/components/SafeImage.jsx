import { useState } from "react";

const TINTS = ["tint-a", "tint-b", "tint-c", "tint-d"];

// Shows the image if the file exists. If it is missing, shows a colored
// placeholder instead (set hint to also show where to save the file).
// "index" only picks which placeholder color to use.
export default function SafeImage({ src, alt, className = "", index = 0, hint = false }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className={`ph ${TINTS[index % TINTS.length]} ${className}`} role="img" aria-label={alt}>
        {hint && src && <span>Add your photo at<br />public{src}</span>}
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
