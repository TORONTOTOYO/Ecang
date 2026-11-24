import { useEffect, useRef, useState } from "react";

const WARNING_IDLE_TIME = 3 * 60 * 1000; // 3 minutes - show warning after this idle time
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes - logout after this idle time
const WARNING_DURATION = SESSION_TIMEOUT - WARNING_IDLE_TIME; // 2 minutes countdown (from warning to logout)

// Hook to track session idle time and show warning
export function useSessionTimeout(onSessionExpired) {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownRef = useRef(null);

  // Reset the idle timer
  const resetTimer = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningTimeoutRef.current);
    clearInterval(countdownRef.current);
    setShowWarning(false);
    setTimeRemaining(0);

    // Set timeout to show warning after 3 minutes of inactivity
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(WARNING_DURATION); // Start countdown from 120 seconds (2 minutes)

      // Start countdown interval - update every 100ms for smooth display
      countdownRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = Math.max(0, prev - 100);
          return newTime;
        });
      }, 100);
    }, WARNING_IDLE_TIME);

    // Set timeout to expire session after 5 minutes of inactivity
    timeoutRef.current = setTimeout(() => {
      clearInterval(countdownRef.current);
      setShowWarning(false);
      onSessionExpired();
    }, SESSION_TIMEOUT);
  };

  // Track user activity
  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    const handleActivity = () => {
      resetTimer();
    };

    // Initialize the timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(warningTimeoutRef.current);
      clearInterval(countdownRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [onSessionExpired]);

  const resumeSession = () => {
    setShowWarning(false);
    setTimeRemaining(0);
    resetTimer();
  };

  return { showWarning, timeRemaining, resumeSession };
}
