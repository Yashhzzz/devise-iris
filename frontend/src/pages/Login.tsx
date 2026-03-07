import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      const { error: err } = await signUp(email, password, fullName);
      if (err) {
        setError(err.message);
      } else {
        setSignUpSuccess(true);
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  if (signUpSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logoWrap}>
            <div style={styles.logo}>D</div>
          </div>
          <h1 style={styles.title}>Check your email</h1>
          <p style={styles.subtitle}>
            We sent a confirmation link to <strong>{email}</strong>.
            <br />
            Click it to activate your account.
          </p>
          <button
            onClick={() => { setSignUpSuccess(false); setIsSignUp(false); }}
            style={styles.switchBtn}
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logo}>D</div>
        </div>

        <h1 style={styles.title}>
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p style={styles.subtitle}>
          {isSignUp
            ? "Start monitoring your AI governance"
            : "Sign in to Devise Dashboard"}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && (
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Yash"
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Please wait…"
              : isSignUp
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine} />
        </div>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          style={styles.switchBtn}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>

      {/* Footer */}
      <p style={styles.footer}>
        Devise — AI Governance Platform
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline styles (matches Devise design system)
// ---------------------------------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F2F5",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: "40px 36px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 28,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    backgroundColor: "#FF5C1A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 22,
  },
  title: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: "#1A1A2E",
    textAlign: "center" as const,
    margin: "0 0 8px",
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center" as const,
    margin: "0 0 28px",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 18,
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
  },
  label: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 500,
    color: "#64748B",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  input: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #E2E8F0",
    outline: "none",
    color: "#1A1A2E",
    transition: "border-color 200ms",
  },
  error: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    color: "#DC2626",
    margin: 0,
    padding: "8px 12px",
    backgroundColor: "rgba(220,38,38,0.06)",
    borderRadius: 8,
  },
  submitBtn: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    backgroundColor: "#FF5C1A",
    border: "none",
    borderRadius: 12,
    padding: "14px 0",
    cursor: "pointer",
    transition: "all 200ms",
    marginTop: 4,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    color: "#94A3B8",
  },
  switchBtn: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    color: "#FF5C1A",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "center" as const,
    width: "100%",
    padding: 0,
  },
  footer: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 24,
  },
};
