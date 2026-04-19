import { Link, useNavigate } from "react-router-dom";
import { Brain, Play, Home, Star } from "lucide-react";
import { useState, useEffect } from "react";
import "./BrainGames.css";

export default function BrainGames() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  /* 🎮 GAME LIST (FINAL 🔥) */
  const games = [
    {
      id: "ticTacToe",
      title: "Tic Tac Toe",
      desc: "Challenge your strategy and logic skills.",
      img: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=800",
      path: "/tic-tac-toe"
    },
    {
      id: "quiz",
      title: "Tech Quiz",
      desc: "Test your knowledge of HTML, CSS, JS & React.",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800",
      path: "/quiz"
    },
    {
      id: "memory",
      title: "Memory Game",
      desc: "Test and improve your memory skills.",
      img: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=800",
      path: "/memory"
    },
    {
      id: "slidingPuzzle", // ✅ FIXED ID
      title: "Sliding Puzzle",
      desc: "Arrange tiles in correct order.",
      img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
      path: "/sliding-puzzle"
    },
    {
      id: "sudoku", // ✅ NEW
      title: "Sudoku",
      desc: "Test your logic with number puzzle.",
     img: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800",
      path: "/sudoku"
    },
    
  ];

  /* 🔥 LOAD FAVORITES */
  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(fav);
  }, []);

  /* ⭐ TOGGLE FAVORITE */
  const toggleFavorite = (gameId) => {
    let updated;

    if (favorites.includes(gameId)) {
      updated = favorites.filter((g) => g !== gameId);
    } else {
      updated = [...favorites, gameId];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="brain-page">

      {/* 🏠 HOME */}
      <div className="brain-home-btn" onClick={() => navigate("/home")}>
        <Home size={18} /> Home
      </div>

      <div className="brain-container">

        {/* 🔥 TITLE */}
        <h1 className="brain-title">
          <Brain size={28} /> Brain Games
        </h1>

        {/* 🎮 GRID */}
        <div className="brain-grid">

          {games.map((game) => {
            const isFav = favorites.includes(game.id);

            return (
              <div className="brain-card" key={game.id}>

                {/* 🖼 IMAGE */}
                <div className="card-image">
                  <img src={game.img} alt={game.title} />

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

                  <Link to={game.path} className="play-btn">
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