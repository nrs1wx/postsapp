import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { user, loading, error, signup, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      navigate("/profile", { replace: true });
    }
  }, [user, loading]);

  async function handleSubmit(event) {
    event.preventDefault();
    clearError();

    if (!emailPattern.test(email)) {
      setValidationError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setValidationError("");
    setSubmitting(true);
    await signup(email, password);
    setSubmitting(false);
  }

  return (
    <div className="auth-box">
      <h1>Signup</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
        />
        {(validationError || error) && <p className="error">{validationError || error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : "Create account"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
