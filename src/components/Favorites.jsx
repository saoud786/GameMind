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
    img: "/images/tictactoe.png",
    path: "/tic-tac-toe",
  },
  {
    id: "quiz",
    title: "Tech Quiz",
    img: "/images/quiz.png",
    path: "/quiz",
  },
  {
    id: "memory",
    title: "Memory Game",
    img: "/images/memory.png",
    path: "/memory",
  },
  {
    id: "slidingPuzzle",
    title: "Sliding Puzzle",
    img: "/images1/puzzle.png",
    path: "/sliding-puzzle",
  },
  {
    id: "sudoku",
    title: "Sudoku",
    img: "/images/sudoku.png",
    path: "/sudoku",
  },
  {
    id: "snake",
    title: "Snake Game",
    img: "/images1/snake.png",
    path: "/snake",
  },
  {
    id: "flyingBird",
    title: "Flying Bird",
    img: "/images1/bird.png", // ✅ FIXED (pehle snake.png tha)
    path: "/flying-bird",
  },
  {
    id: "racing",
    title: "Car Racing",
    img: "/images1/racing.png",
    path: "/racing",
  },
  {
    id: "typing",
    title: "Typing Speed",
    img: "/images1/typing.png",
    path: "/typing",
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