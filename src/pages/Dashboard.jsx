import "./Dashboard.css";
import {
  BarChart3,
  Trophy,
  XCircle,
  Handshake,
  TrendingUp,
  RotateCcw,
  Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* 🧠 GET SCORES */
const getScores = () => {
  return JSON.parse(localStorage.getItem("scores")) || {};
};

/* 🔁 RESET */
const resetScores = () => {
  localStorage.removeItem("scores");
  window.location.reload();
};

/* 🎮 GAME IMAGES */
const gameImages = {
  ticTacToe:
    "https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=800",
  html:
    "https://images.unsplash.com/photo-1581276879432-15e50529f34b?q=80&w=800",
  css:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800",
  js:
    "https://images.unsplash.com/photo-1555066931-bf19f8fd1085?q=80&w=800",
  react:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
  snake:
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
  flyingBird:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
};

/* 🧠 FORMAT NAME */
const formatName = (name) => {
  const map = {
    ticTacToe: "Tic Tac Toe",
    html: "HTML Quiz",
    css: "CSS Quiz",
    js: "JavaScript Quiz",
    react: "React Quiz",
    snake: "Snake Game",
    flyingBird: "Flying Bird",
  };

  return map[name] || name;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const scores = getScores();

  let totalGames = 0;
  let totalWins = 0;
  let totalLoss = 0;
  let totalDraw = 0;

  /* 🔥 TOTAL CALCULATION */
  Object.entries(scores).forEach(([game, data]) => {
    if (game === "snake" || game === "flyingBird") {
      totalGames += data.played || 0;
    } else {
      const wins = data.win || 0;
      const loss = data.loss || 0;
      const draw = data.draw || 0;

      totalWins += wins;
      totalLoss += loss;
      totalDraw += draw;
      totalGames += wins + loss + draw;
    }
  });

  const winRate = totalGames
    ? Math.round((totalWins / totalGames) * 100)
    : 0;

  return (
    <div className="dashboard">

      {/* 🏠 HOME */}
      <div className="home-btn" onClick={() => navigate("/home")}>
        <Home size={18} /> Home
      </div>

      {/* 🔥 TITLE */}
      <h1>
        <BarChart3 size={26} /> Dashboard
      </h1>

      {/* 📊 STATS */}
      <div className="stats">
        <div className="box">
          <BarChart3 size={16} /> {totalGames} Games
        </div>

        <div className="box">
          <Trophy size={16} /> {totalWins} Wins
        </div>

        <div className="box">
          <XCircle size={16} /> {totalLoss} Loss
        </div>

        <div className="box">
          <Handshake size={16} /> {totalDraw} Draw
        </div>

        <div className="box">
          <TrendingUp size={16} /> {winRate}% Win Rate
        </div>
      </div>

      {/* 🎮 GAME STATS */}
      <div className="scores">
        <h2>Game Stats</h2>

        {Object.keys(scores).length === 0 && (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            No games played yet
          </p>
        )}

        {Object.entries(scores)
          .sort((a, b) => (b[1].lastPlayed || 0) - (a[1].lastPlayed || 0))
          .map(([game, data]) => {
            const isCustomGame =
              game === "snake" || game === "flyingBird";

            return (
              <div key={game} className="game-card">

                {/* 🖼 IMAGE */}
                <img
                  src={gameImages[game] || gameImages.ticTacToe}
                  alt={game}
                  className="game-img"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=Game";
                  }}
                />

                {/* 📦 CONTENT */}
                <div className="game-content">
                  <h3 className="game-title">
                    {formatName(game)}
                  </h3>

                  <div className="game-stats">

                    {isCustomGame ? (
                      <>
                        <div className="mini-box">
                          🏆 Best: {data.best || 0}
                        </div>

                        <div className="mini-box">
                          🎮 Played: {data.played || 0}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mini-box">
                          <Trophy size={14} /> {data.win || 0}
                        </div>

                        <div className="mini-box">
                          <XCircle size={14} /> {data.loss || 0}
                        </div>

                        <div className="mini-box">
                          <Handshake size={14} /> {data.draw || 0}
                        </div>
                      </>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
      </div>

      {/* 🔁 RESET */}
      <button className="reset-btn" onClick={resetScores}>
        <RotateCcw size={14} /> Reset All Scores
      </button>

    </div>
  );
}