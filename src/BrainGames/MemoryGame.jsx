import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { updateScore } from "../utils/helpers";
import "./MemoryGame.css";

const emojis = ["🍎","🍌","🍇","🍉","🍒","🍍"];

export default function MemoryGame() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [showHelp, setShowHelp] = useState(false); // 🔥 modal state

  /* 🔁 INIT */
  useEffect(() => {
    resetGame();
  }, []);

  /* 🔀 SHUFFLE */
  const shuffleCards = () => {
    const arr = [...emojis, ...emojis];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.map((emoji, index) => ({
      id: index,
      emoji
    }));
  };

  /* 🎯 CLICK */
  const handleClick = (index) => {
    if (lock) return;
    if (flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLock(true);
      setMoves((prev) => prev + 1);

      const [a, b] = newFlipped;

      if (cards[a].emoji === cards[b].emoji) {
        setMatched((prev) => [...prev, a, b]);
        setFlipped([]);
        setLock(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 700);
      }
    }
  };

  /* 🏆 WIN */
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      updateScore("memoryGame", "win");
    }
  }, [matched, cards]);

  /* 🔄 RESET */
  const resetGame = () => {
    setCards(shuffleCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLock(false);
  };

  return (
    <div className="mg-container">

      {/* 🔙 BACK */}
      <div className="mg-back" onClick={() => navigate("/brain")}>
        <ArrowLeft size={18} /> Back
      </div>

      {/* 🔥 HEADER */}
      <div className="mg-header">
        <h1 className="mg-title">🧠 Memory Game</h1>
        <p className="mg-moves">Moves: {moves}</p>

        {/* 🔥 HOW TO PLAY BUTTON */}
        <button className="mg-help-btn" onClick={() => setShowHelp(true)}>
          How to Play?
        </button>
      </div>

      {/* 🔥 GRID */}
      <div className="mg-grid">
        {cards.map((card, index) => {
          const isFlipped =
            flipped.includes(index) || matched.includes(index);

          return (
            <div
              key={card.id}
              className={`mg-card ${isFlipped ? "mg-flipped" : ""}`}
              onClick={() => handleClick(index)}
            >
              <div className="mg-inner">
                <div className="mg-front">{card.emoji}</div>
                <div className="mg-backface">?</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔄 RESET */}
      <button className="mg-reset" onClick={resetGame}>
        Restart
      </button>

      {/* 🔥 MODAL */}
      {showHelp && (
        <div className="mg-modal-overlay" onClick={() => setShowHelp(false)}>
          <div
            className="mg-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mg-modal-header">
              <h2>How to Play</h2>
              <X size={18} onClick={() => setShowHelp(false)} />
            </div>

            <ul className="mg-rules">
              <li>Flip two cards at a time</li>
              <li>Match the same emojis</li>
              <li>If not match, they flip back</li>
              <li>Complete in minimum moves</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}