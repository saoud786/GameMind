import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Gamepad2,
  BarChart3,
  BrainCircuit,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from "lucide-react";

// 🔥 FIREBASE
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import "./Welcome.css";

export default function Welcome() {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ================= SIGNUP ================= */
const handleSignup = async () => {
  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  try {
    setError("");

    await createUserWithEmailAndPassword(auth, email, password);

    navigate("/home");

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      setError("Account already exists. Please login.");
    } else if (error.code === "auth/invalid-email") {
      setError("Invalid email address");
    } else {
      setError("Something went wrong");
    }
  }
};

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/home");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    
    <div className="auth-page welcome-theme">
      <div className="auth-container">

        {/* LEFT */}
        <div className="left">
          <div className="overlay">

            <div className="left-logo">
              <BrainCircuit size={26} />
              GameMind
            </div>

            <p className="left-desc">
              Train your brain with fun games, track your progress,
              and challenge yourself daily.
            </p>

            <ul className="features">
              <li><Brain size={18} /> Brain Games</li>
              <li><Gamepad2 size={18} /> Fun Games</li>
              <li><BarChart3 size={18} /> Track Progress</li>
            </ul>

          </div>
        </div>

        {/* RIGHT */}
        <div className="right">

          {/* TOGGLE */}
          <div className="auth-switch">
            <button
              className={mode === "signup" ? "active" : ""}
              onClick={() => {
                setMode("signup");
                setError("");
              }}
            >
              <UserPlus size={16} />
              Create Account
            </button>

            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              <LogIn size={16} />
              Login
            </button>
          </div>

          <h2>
            {mode === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
          </h2>

          {/* FORM */}
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              mode === "signup" ? handleSignup() : handleLogin();
            }}
          >

            {/* NAME */}
            {mode === "signup" && (
              <div className="row">
                <input type="text" placeholder="First Name" required />
                <input type="text" placeholder="Last Name" required />
              </div>
            )}

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />

            {/* PASSWORD */}
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* 🔥 INLINE ERROR */}
            {error && <p className="input-error">{error}</p>}

            {/* BUTTON */}
            <button type="submit" className="main-btn">
              {mode === "login" ? (
                <>
                  <LogIn size={18} />
                  Login
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}