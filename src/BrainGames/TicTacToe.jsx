import { useState, useEffect } from "react";
import { Users, Bot, Trophy, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateScore } from "../utils/helpers";
import "./TicTacToe.css";

export default function TicTacToe() {
  const navigate = useNavigate();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [mode, setMode] = useState(null);
  const [saved, setSaved] = useState(false); // 🔥 duplicate fix

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);

  /* 🤖 AI MOVE */
  useEffect(() => {
    if (mode === "ai" && !isXTurn && !winner) {
      const empty = board
        .map((v, i) => (v === null ? i : null))
        .filter(v => v !== null);

      if (empty.length > 0) {
        const randomIndex = empty[Math.floor(Math.random() * empty.length)];

        setTimeout(() => {
          handleClick(randomIndex);
        }, 400);
      }
    }
  }, [board, isXTurn, mode, winner]);

  /* 🔥 SAVE SCORE (MAIN LOGIC) */
  useEffect(() => {
    if (saved) return;

    if (winner || isDraw) {
      if (winner === "X") updateScore("ticTacToe", "win");
      else if (winner === "O") updateScore("ticTacToe", "loss");
      else updateScore("ticTacToe", "draw");

      setSaved(true);
    }
  }, [winner, isDraw, saved]);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";

    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setSaved(false); // 🔥 important
  };

  const changeMode = () => {
    setMode(null);
    resetGame();
  };

  /* ================= MODE ================= */
  if (!mode) {
    return (
      <div className="ttt-container">

        <div className="back-btn" onClick={() => navigate("/brain")}>
          <ArrowLeft size={18} /> Back
        </div>

        <div className="mode-card">
          <h1 className="ttt-title">🧠 Tic Tac Toe</h1>
          <p className="ttt-subtitle">Choose your game mode</p>

          <div className="mode-select">
            <button onClick={() => setMode("friend")} className="mode-btn">
              <Users size={20} />
              Play with Friend
            </button>

            <button onClick={() => setMode("ai")} className="mode-btn">
              <Bot size={20} />
              Play with Computer
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= GAME ================= */
  return (
    <div className="ttt-container">

      <div className="back-btn" onClick={() => navigate("/brain")}>
        <ArrowLeft size={18} /> Back
      </div>

      <div className="game-wrapper">

        <h1 className="ttt-title">🧠 Tic Tac Toe</h1>

        <div className="status">
          {winner ? (
            <span className="winner">
              <Trophy size={18} /> {winner} Wins!
            </span>
          ) : isDraw ? (
            "It's a Draw 🤝"
          ) : (
            `Turn: ${isXTurn ? "X" : "O"}`
          )}
        </div>

       <div className="ttt-board">
          {board.map((cell, index) => (
            <div
              key={index}
             className="ttt-cell"
              onClick={() => handleClick(index)}
            >
              {cell}
            </div>
          ))}
        </div>

        <div className="actions">
          <button onClick={resetGame}>Restart</button>
          <button onClick={changeMode}>Change Mode</button>
        </div>

      </div>
    </div>
  );
}

/* 🔥 WINNER LOGIC */
function calculateWinner(board) {
  const patterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  for (let [a, b, c] of patterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}