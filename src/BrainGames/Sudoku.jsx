import { useState, useEffect } from "react";
import { ArrowLeft, Info, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateScore } from "../utils/helpers";
import "./Sudoku.css";

const puzzle = [
  [5,3,"","",7,"","","",""],
  [6,"","",1,9,5,"","",""],
  ["",9,8,"","","","",6,""],
  [8,"","","",6,"","","",3],
  [4,"","",8,"",3,"","",1],
  [7,"","","",2,"","","",6],
  ["",6,"","","","","",8,""],
  ["","","",4,1,9,"","",5],
  ["","","","","8","","",7,9],
];

export default function Sudoku() {
  const navigate = useNavigate();

  const [board, setBoard] = useState(puzzle);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isWon, setIsWon] = useState(false);

  /* 🔢 INPUT */
  const handleChange = (row, col, value) => {
    if (value === "" || /^[1-9]$/.test(value)) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = value === "" ? "" : Number(value);
      setBoard(newBoard);
    }
  };

  /* 🔥 CHECK VALID */
  const isValidSudoku = (board) => {
    const check = (arr) => {
      const nums = arr.filter((n) => n !== "");
      return new Set(nums).size === nums.length;
    };

    // rows
    for (let i = 0; i < 9; i++) {
      if (!check(board[i])) return false;
    }

    // columns
    for (let col = 0; col < 9; col++) {
      const column = board.map((row) => row[col]);
      if (!check(column)) return false;
    }

    // 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const box = [];

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            box.push(board[boxRow * 3 + i][boxCol * 3 + j]);
          }
        }

        if (!check(box)) return false;
      }
    }

    return true;
  };

  /* 🔥 FULL CHECK */
  const isBoardFull = (board) => {
    return board.every((row) =>
      row.every((cell) => cell !== "")
    );
  };

  /* 🎉 WIN LOGIC */
  useEffect(() => {
    if (isBoardFull(board) && isValidSudoku(board)) {
      setIsWon(true);
      updateScore("sudoku", "win");
    }
  }, [board]);

  return (
    <div className="sudoku-container">

      {/* 🔙 BACK */}
      <div className="sudoku-back" onClick={() => navigate("/brain")}>
        <ArrowLeft size={18}/> Back
      </div>

      {/* ℹ️ INFO */}
      <div
        className="sudoku-info-btn"
        onClick={() => setShowInstructions(true)}
      >
        <Info size={18}/> How to Play
      </div>

      <h1 className="sudoku-title">🔢 Sudoku</h1>

      {/* 🔢 GRID */}
      <div className="sudoku-grid">
        {board.map((row, rIndex) =>
          row.map((cell, cIndex) => (
            <input
              key={`${rIndex}-${cIndex}`}
              className="sudoku-cell"
              value={cell}
              onChange={(e) =>
                handleChange(rIndex, cIndex, e.target.value)
              }
              maxLength={1}
            />
          ))
        )}
      </div>

      {/* 🎉 WIN MESSAGE */}
      {isWon && (
        <div className="sudoku-win">
          🎉 You solved the puzzle!
        </div>
      )}

      {/* 📘 INSTRUCTIONS */}
      {showInstructions && (
        <div className="sudoku-modal">
          <div className="sudoku-modal-content">

            <div className="modal-header">
              <h2>🧠 How to Play</h2>
              <X size={20} onClick={() => setShowInstructions(false)} />
            </div>

            <ul>
              <li>Fill numbers 1–9</li>
              <li>No repeat in row</li>
              <li>No repeat in column</li>
              <li>No repeat in 3×3 box</li>
            </ul>

          </div>
        </div>
      )}

    </div>
  );
}