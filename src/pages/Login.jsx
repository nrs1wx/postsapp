import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loading, error, login, loginWithGoogle, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  }

  async function handleGoogle() {
    setSubmitting(true);
    await loginWithGoogle();
    setSubmitting(false);
  }

  return (
    <div className="auth-box">
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : "Login"}
        </button>
      </form>
      <button className="secondary" onClick={handleGoogle} disabled={submitting}>
        Continue with Google
      </button>
      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
