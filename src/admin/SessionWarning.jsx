import { useState } from "react";

export default function SessionWarning({ show, timeRemaining, onResume, onExpired }) {
  const [isClosing, setIsClosing] = useState(false);

  // Convert milliseconds to seconds for display
  const totalSeconds = Math.ceil(timeRemaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeDisplay = `${minutes}:${String(seconds).padStart(2, "0")}`;

  const handleResume = () => {
    setIsClosing(true);
    setTimeout(() => {
      onResume();
      setIsClosing(false);
    }, 250);
  };

  if (!show) return null;

  return (
    <div className={`session-warning-backdrop ${isClosing ? "closing" : ""}`}>
      <div className={`session-warning-modal ${isClosing ? "closing" : ""}`}>
        <div className="session-warning-icon">⏱️</div>
        <h2>Session Timeout</h2>
        <p>Your session will expire soon.</p>
        <div className="session-warning-countdown">
          <div className="countdown-time">{timeDisplay}</div>
          <div className="countdown-label">remaining</div>
        </div>
        <div className="session-warning-actions">
          <button className="session-warning-btn session-warning-resume" onClick={handleResume}>
            Resume
          </button>
          <button className="session-warning-btn session-warning-logout" onClick={onExpired}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
