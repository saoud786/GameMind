import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SlidingPuzzle.css";

const initial = [1,2,3,4,5,6,7,8,null];

export default function SlidingPuzzle() {
  const navigate = useNavigate();

  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    shuffle();
  }, []);

  /* 🔀 SHUFFLE */
  const shuffle = () => {
    let arr = [...initial];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    setTiles(arr);
    setMoves(0);
  };

  /* 🎯 MOVE LOGIC (FIXED) */
  const moveTile = (index) => {
  const emptyIndex = tiles.indexOf(null);

  // 🔥 ONLY VALID NEIGHBOURS
  const validMoves = [
    emptyIndex - 1, // left
    emptyIndex + 1, // right
    emptyIndex - 3, // up
    emptyIndex + 3  // down
  ];

  // ❌ prevent row break bug
  if (
    (emptyIndex % 3 === 0 && index === emptyIndex - 1) || // left edge
    (emptyIndex % 3 === 2 && index === emptyIndex + 1)    // right edge
  ) {
    return;
  }

  if (!validMoves.includes(index)) return;

  const newTiles = [...tiles];
  [newTiles[index], newTiles[emptyIndex]] =
    [newTiles[emptyIndex], newTiles[index]];

  setTiles(newTiles);
  setMoves((prev) => prev + 1);
};

  /* 🏆 WIN CHECK */
  const isWin = () => {
    return JSON.stringify(tiles) === JSON.stringify(initial);
  };

  return (
    <div className="sp-container">

      {/* 🔙 BACK */}
      <div className="sp-back" onClick={() => navigate("/brain")}>
        <ArrowLeft size={18}/> Back
      </div>

      {/* 🔥 HEADER */}
      <div className="sp-header">
        <h1 className="sp-title">🧩 Sliding Puzzle</h1>
        <p className="sp-moves">Moves: {moves}</p>
      </div>

      {/* 🎮 GRID */}
      <div className="sp-grid">
        {tiles.map((tile, i) => (
          <div
            key={i}
            className={`sp-tile ${tile === null ? "empty" : ""}`}
            onClick={() => moveTile(i)}
          >
            {tile}
          </div>
        ))}
      </div>

      {/* 🏆 WIN */}
      {isWin() && (
        <div className="sp-win">
          🎉 You Win!
        </div>
      )}

      {/* 🔄 RESET */}
      <button className="sp-reset" onClick={shuffle}>
        Shuffle
      </button>

    </div>
  );
}