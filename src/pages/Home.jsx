// 📁 src/pages/Home.jsx

import { Link } from "react-router-dom";
import {
  Brain,
  Gamepad2,
  LayoutDashboard,
  Star,
  User,
  Puzzle,
  Keyboard,
  Car
} from "lucide-react";
import "./Home.css";

export default function Home() {

  const icons = [
    <Gamepad2 size={26} />,
    <Brain size={26} />,
    <Puzzle size={26} />,
    <Keyboard size={26} />,
    <Car size={26} />,
  ];

  return (
    <div className="hm-page">

      {/* 🎮 FLOATING ICONS */}
      <div className="hm-bg-icons">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="hm-floating-icon"
            style={{
              left: `${(i * 100) / 15 + Math.random() * 3}%`,
              animationDuration: `${12 + Math.random() * 8}s`,
              animationDelay: `-${Math.random() * 20}s`,
            }}
          >
            {icons[i % icons.length]}
          </span>
        ))}
      </div>

      {/* 🔝 NAVBAR */}
      <div className="hm-navbar">

        <h1 className="hm-logo">
          <Brain size={24} strokeWidth={1.8} />
          GameMind
        </h1>

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

      {/* 🔥 CONTENT */}
      <div className="hm-content">

     <div className="hm-hero">

  <h1 className="hm-title">
    Play for fun.  <span>Think smarter.</span>
  </h1>

  <p className="hm-subtitle">
    Train your brain while enjoying simple and addictive games.
  </p>

</div>

        <div className="hm-grid">

          <Link to="/brain" className="hm-card">
            <div className="hm-icon">
              <Brain size={48} />
            </div>
            <h2>Brain Games</h2>
            <p>Improve memory & thinking skills</p>
          </Link>

          <Link to="/fun" className="hm-card">
            <div className="hm-icon">
              <Gamepad2 size={48} />
            </div>
            <h2>Fun Games</h2>
            <p>Relax & enjoy simple games</p>
          </Link>

        </div>

      </div>

    </div>
  );
}