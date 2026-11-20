// "CV" button: opens the CV page, where the PDF can be downloaded.
export default function CvLink({ className = "", onClick }) {
  return (
    <a href="#/cv" className={`btn ${className}`} onClick={onClick}>
      CV
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" />
      </svg>
    </a>
  );
}
