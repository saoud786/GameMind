import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./TypingGame.css";

const wordsList = [
  "react","javascript","coding","developer","keyboard",
  "speed","project","frontend","backend","design",
  "function","variable","object","array","component",
  "performance","optimize","browser","network","database"
];

export default function TypingGame() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState("medium");

  const [time, setTime] = useState(60);
  const [text, setText] = useState("");
  const [input, setInput] = useState("");

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [charsTyped, setCharsTyped] = useState(0);

  const [result, setResult] = useState(null);

  /* 🔥 TEXT GENERATE */
  const generateText = (selectedMode) => {
    let count = selectedMode === "easy" ? 10 : selectedMode === "medium" ? 20 : 35;
    let words = [];
    for (let i = 0; i < count; i++) {
      words.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
    }
    return words.join(" ");
  };

  /* 🔥 SAVE SCORE */
  const saveScore = (finalWpm) => {
    const scores = JSON.parse(localStorage.getItem("scores")) || {};

    if (!scores.typing) {
      scores.typing = { best: 0, played: 0, lastPlayed: Date.now() };
    }

    if (finalWpm > scores.typing.best) {
      scores.typing.best = finalWpm;
    }

    scores.typing.played += 1;
    scores.typing.lastPlayed = Date.now();

    localStorage.setItem("scores", JSON.stringify(scores));
  };

  /* 🎮 START */
  const startGame = (selectedMode, e) => {
    if (e) e.preventDefault();

    setMode(selectedMode);
    setStarted(true);
    setTime(60);

    const newText = generateText(selectedMode);
    setText(newText);

    setInput("");
    setWpm(0);
    setAccuracy(100);
    setWordsTyped(0);
    setCharsTyped(0);
    setResult(null);

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  /* ⏱ TIMER */
  useEffect(() => {
    if (!started) return;

    if (time === 0) {
      const finalWpm = Math.round((charsTyped / 5) / 1);
      const acc = charsTyped === 0 ? 100 : Math.round((input.length / charsTyped) * 100);

      setResult({
        wpm: finalWpm,
        accuracy: accuracy,
        words: wordsTyped,
        chars: charsTyped,
        mode: mode
      });

      saveScore(finalWpm);
      setStarted(false);
      return;
    }

    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, started]);

  /* ✍️ INPUT HANDLER */
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    let correct = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) correct++;
    }

    setCharsTyped(value.length);
    setWordsTyped(value.trim().split(" ").length);

    const acc = value.length === 0 ? 100 : Math.round((correct / value.length) * 100);
    setAccuracy(acc);

    const elapsed = (60 - time) / 60 || 1;
    const currentWpm = Math.round((correct / 5) / elapsed);
    setWpm(currentWpm);
  };

  /* 🔥 TEXT HIGHLIGHT */
  const renderText = () => {
    return text.split("").map((char, index) => {
      let color = "#9ca3af"; // default

      if (index < input.length) {
        color = input[index] === char ? "#22c55e" : "#ef4444";
      }

      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="typing-container">

      {/* 🔙 BACK */}
      <button
        className="back-btn"
        onClick={() => {
          if (started) {
            saveScore(wpm);
            setStarted(false);
          } else {
            navigate("/fun");
          }
        }}
      >
        ← Back
      </button>

      {/* 🏠 START */}
      {!started && (
        <div className="start-box">
          <h1>⌨️ Typing Test</h1>

          <div className="mode-buttons">
            <button onClick={(e) => startGame("easy", e)}>Easy</button>
            <button onClick={(e) => startGame("medium", e)}>Medium</button>
            <button onClick={(e) => startGame("hard", e)}>Hard</button>
          </div>

          {result && (
            <div className="result-box">
              <p>⚡ WPM: {result.wpm}</p>
              <p>🎯 Accuracy: {result.accuracy}%</p>
              <p>📝 Words: {result.words}</p>
              <p>🔤 Characters: {result.chars}</p>
              <p>🎮 Mode: {result.mode}</p>
            </div>
          )}
        </div>
      )}

      {/* 🎮 GAME */}
      {started && (
        <div className="game-box">

          <div className="top-stats">
            <span>⏱ {time}s</span>
            <span>⚡ {wpm} WPM</span>
            <span>🎯 {accuracy}%</span>
          </div>

          <div className="text-box">{renderText()}</div>

          <textarea
            ref={inputRef}
            value={input}
            onChange={handleChange}
            placeholder="Start typing..."
          />

        </div>
      )}
    </div>
  );
}