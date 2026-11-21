// Full-screen loading screen shown when switching between the portfolio and the CV.
import { useContent } from "../content/ContentContext.jsx";
import BrandLogo from "./BrandLogo.jsx";

export default function Loader({ label }) {
  const { theme } = useContent();
  const spinner = ["ring", "dots", "pulse"].includes(theme.loaderStyle) ? theme.loaderStyle : "ring";

  return (
    <div className={`loader loader-style-${spinner}`} role="status" aria-live="polite">
      <div className="loader-mark">
        {spinner === "ring" && <span className="loader-ring" />}
        <BrandLogo className="loader-e" />
      </div>
      <p className="loader-text">
        {label}
        {spinner === "dots" && <span className="loader-dots" aria-hidden="true"><i /><i /><i /></span>}
      </p>
    </div>
  );
}
