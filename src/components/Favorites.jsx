import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Star, Play, Trash2 } from "lucide-react";
import "./Favorites.css";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  /* 🎮 ALL GAMES (UPDATED 🔥) */
  const games = [
    {
      id: "ticTacToe",
      title: "Tic Tac Toe",
      img: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=800",
      path: "/tic-tac-toe",
    },
    {
      id: "quiz",
      title: "Tech Quiz",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800",
      path: "/quiz",
    },
    {
      id: "memory",
      title: "Memory Game",
      img: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=800",
      path: "/memory",
    },
    {
      id: "slidingPuzzle",
      title: "Sliding Puzzle",
      img: "https://images.unsplash.com/photo-1606166325683-2a1c6fba5888?q=80&w=800",
      path: "/sliding-puzzle",
    },
    {
      id: "sudoku",
      title: "Sudoku",
      img: "https://images.unsplash.com/photo-1584697964403-5b2b6e7d7a5c?q=80&w=800",
      path: "/sudoku",
    },
    {
      id: "snake",
      title: "Snake Game",
      img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
      path: "/snake",
    },
    {
      id: "flyingBird", // ✅ NEW
      title: "Flying Bird",
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      path: "/flying-bird",
    },
  ];

  /* 🔥 LOAD FAVORITES */
  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(fav);
  }, []);

  /* ❌ REMOVE */
  const removeFavorite = (gameId) => {
    const updated = favorites.filter((g) => g !== gameId);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="fav-page">

      {/* 🏠 HOME */}
      <div className="fav-home-btn" onClick={() => navigate("/home")}>
        <Home size={18} /> Home
      </div>

      <h1 className="fav-title">
        <Star size={26} /> Favorite Games
      </h1>

      <div className="fav-grid">

        {favorites.length === 0 && (
          <p className="empty">No favorites yet 😢</p>
        )}

        {games
          .filter((game) => favorites.includes(game.id))
          .map((game) => (
            <div
              className="fav-card"
              key={game.id}
              onClick={() => navigate(game.path)}
              style={{ cursor: "pointer" }}
            >

              {/* ❌ REMOVE */}
              <div
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(game.id);
                }}
              >
                <Trash2 size={16} />
              </div>

              {/* 🖼 IMAGE */}
              <img
                src={game.img}
                alt={game.title}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=Game";
                }}
              />

              {/* 📦 CONTENT */}
              <div className="fav-content">
                <h3>{game.title}</h3>

                <Link
                  to={game.path}
                  className="play-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Play size={16} /> Play
                </Link>
              </div>

            </div>
          ))}

      </div>

    </div>
  );
}