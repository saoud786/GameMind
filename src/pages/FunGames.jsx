import { Link, useNavigate } from "react-router-dom";
import { Gamepad2, Play, Home, Star } from "lucide-react";
import { useState, useEffect } from "react";
import "./FunGames.css";

export default function FunGames() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  /* 🎮 GAME LIST (FINAL 🔥) */
  const games = [
    {
      id: "snake",
      title: "Snake Game",
      desc: "Classic snake game with smooth controls.",
      img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
      path: "/snake",
    },
    {
      id: "flyingBird",
      title: "Flying Bird",
      desc: "Tap to fly and avoid pipes. Super addictive game!",
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      path: "/flying-bird",
    },
    {
      id: "racing", // ✅ NEW GAME ADDED
      title: "Car Racing",
      desc: "Avoid traffic & collect coins for high score!",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
      path: "/racing",
    },
  ];

  /* 🔥 LOAD FAVORITES */
  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(fav);
  }, []);

  /* ⭐ TOGGLE */
  const toggleFavorite = (gameId) => {
    setFavorites((prev) => {
      const updated = prev.includes(gameId)
        ? prev.filter((g) => g !== gameId)
        : [...prev, gameId];

      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="fun-page">

      {/* 🏠 HOME */}
      <button
        className="fun-home-btn"
        onClick={() => navigate("/home")}
      >
        <Home size={18} /> Home
      </button>

      <div className="fun-container">

        {/* 🔥 TITLE */}
        <h1 className="fun-title">
          <Gamepad2 size={28} /> Fun Games
        </h1>

        {/* 🎮 GRID */}
        <div className="fun-grid">

          {games.map((game) => {
            const isFav = favorites.includes(game.id);

            return (
              <div
                className="fun-card"
                key={game.id}
                onClick={() => navigate(game.path)}
                style={{ cursor: "pointer" }}
              >

                {/* 🖼 IMAGE */}
                <div className="card-image">
                  <img
                    src={game.img}
                    alt={game.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x400?text=Game";
                    }}
                  />

                  {/* ⭐ FAVORITE */}
                  <button
                    className={`fav-btn ${isFav ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(game.id);
                    }}
                  >
                    <Star size={18} />
                    <span className="fav-tooltip">
                      {isFav ? "Saved" : "Add to Favorites"}
                    </span>
                  </button>
                </div>

                {/* 📦 CONTENT */}
                <div className="card-content">
                  <h3>{game.title}</h3>
                  <p>{game.desc}</p>

                  <Link
                    to={game.path}
                    className="play-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Play size={16} />
                    Play Game
                  </Link>
                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}