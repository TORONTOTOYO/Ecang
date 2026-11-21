import { useState } from "react";
import { login } from "./firebaseAdmin.js";

export default function Login({ notice = "" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email.trim(), password);
    } catch (err) {
      const wrong = ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-email"];
      setError(wrong.includes(err.code) ? "Wrong email or password." : "Could not log in. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="adm adm-center">
      <form className="adm-panel adm-login" onSubmit={submit}>
        <div className="logo">E</div>
        <h1>Admin login</h1>
        <p className="adm-hint">Sign in to edit what shows on your website.</p>
        <div className="adm-stack">
          <label className="adm-field">
            <span className="adm-label">Email</span>
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="adm-field">
            <span className="adm-label">Password</span>
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {(error || notice) && <p className="adm-error" role="alert">{error || notice}</p>}
          <button className="btn" disabled={busy}>{busy ? "Logging in..." : "Log in"}</button>
          <a className="adm-link" href="#home">← Back to the website</a>
        </div>
      </form>
    </div>
  );
}
