// Full-screen loading screen shown when switching between the portfolio and the CV.
export default function Loader({ label }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-mark">
        <span className="loader-ring" />
        <span className="loader-e">E</span>
      </div>
      <p className="loader-text">
        {label}
        <span className="loader-dots" aria-hidden="true"><i /><i /><i /></span>
      </p>
    </div>
  );
}
