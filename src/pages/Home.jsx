import { Link } from "react-router-dom";
import {
  Brain,
  Gamepad2,
  LayoutDashboard,
  Star,
  User
} from "lucide-react";
import "./Home.css";

export default function Home() {
  return (
    <div className="hm-page">

      {/* 🔥 NAVBAR */}
      <div className="hm-navbar">

        {/* 🧠 LOGO */}
        <h1 className="hm-logo">
          <Brain size={24} strokeWidth={1.8} />
          GameMind
        </h1>

        {/* 🔥 ACTION BUTTONS */}
        <div className="hm-actions">

          <Link to="/dashboard" className="hm-btn">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/favorites" className="hm-btn">
            <Star size={18} />
            Favorites
          </Link>

          <Link to="/profile" className="hm-btn">
            <User size={18} />
            Profile
          </Link>

        </div>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="hm-content">

        <p className="hm-tagline">
          Play smart. Train your brain. Track your progress.
        </p>

        <div className="hm-grid">

          {/* 🧠 BRAIN GAMES */}
          <Link to="/brain" className="hm-card">
            <div className="hm-icon">
              <Brain size={42} />
            </div>

            <h2>Brain Games</h2>
            <p>Improve memory & thinking skills</p>
          </Link>

          {/* 🎮 FUN GAMES */}
          <Link to="/fun" className="hm-card">
            <div className="hm-icon">
              <Gamepad2 size={42} />
            </div>

            <h2>Fun Games</h2>
            <p>Relax & enjoy simple games</p>
          </Link>

        </div>

      </div>

    </div>
  );
}