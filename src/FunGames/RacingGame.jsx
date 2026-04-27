import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RacingGame.css";

export default function RacingGame() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("racingHighScore")) || 0
  );

  const carX = useRef(140);
  const roadOffset = useRef(0);

  const obstacles = useRef([]);
  const coins = useRef([]);

  const speed = useRef(3);
  const startTime = useRef(Date.now());

  const lanes = [70, 120, 170, 220];

  /* 🔥 SAVE SCORE FOR DASHBOARD */
  const saveScore = (finalScore) => {
    const scores = JSON.parse(localStorage.getItem("scores")) || {};

    if (!scores.racing) {
      scores.racing = {
        best: 0,
        played: 0,
        lastPlayed: Date.now(),
      };
    }

    if (finalScore > scores.racing.best) {
      scores.racing.best = finalScore;
    }

    scores.racing.played += 1;
    scores.racing.lastPlayed = Date.now();

    localStorage.setItem("scores", JSON.stringify(scores));
  };

  /* 🎮 START */
  const startGame = () => {
    carX.current = 140;
    obstacles.current = [];
    coins.current = [];
    speed.current = 3;
    startTime.current = Date.now();

    setScore(0);
    setStarted(true);
  };

  /* 🎮 CONTROL */
  const moveLeft = () => {
    carX.current -= 50;
    if (carX.current < 60) carX.current = 60;
  };

  const moveRight = () => {
    carX.current += 50;
    if (carX.current > 220) carX.current = 220;
  };

  /* ⌨️ KEYBOARD */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* 🎮 GAME LOOP */
  useEffect(() => {
    if (!started) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let frame;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, "#0f172a");
      bg.addColorStop(1, "#020617");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#1e293b";
      ctx.fillRect(50, 0, 220, canvas.height);

      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(50, 0, 10, canvas.height);
      ctx.fillRect(260, 0, 10, canvas.height);

      roadOffset.current += speed.current * 2;

      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 5;
      ctx.setLineDash([20, 20]);

      ctx.beginPath();
      ctx.moveTo(160, -(roadOffset.current % 40));
      ctx.lineTo(160, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      const carY = 420;

      /* 🚗 PLAYER */
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(carX.current + 5, carY + 70, 30, 10);

      ctx.fillStyle = "#22c55e";
      ctx.fillRect(carX.current, carY, 40, 70);

      ctx.fillStyle = "#1e293b";
      ctx.fillRect(carX.current + 5, carY + 10, 30, 20);

      ctx.fillStyle = "#fef08a";
      ctx.fillRect(carX.current + 5, carY - 5, 8, 5);
      ctx.fillRect(carX.current + 27, carY - 5, 8, 5);

      ctx.fillStyle = "#000";
      ctx.fillRect(carX.current - 3, carY + 10, 5, 15);
      ctx.fillRect(carX.current + 38, carY + 10, 5, 15);
      ctx.fillRect(carX.current - 3, carY + 45, 5, 15);
      ctx.fillRect(carX.current + 38, carY + 45, 5, 15);

      /* 🚧 SPAWN ENEMY */
      if (Math.random() < 0.02) {
        const lane = lanes[Math.floor(Math.random() * lanes.length)];

        const isBlocked = obstacles.current.some(
          (o) => o.x === lane && o.y < 150
        );

        if (!isBlocked) {
          obstacles.current.push({
            x: lane,
            y: -80,
            type: Math.floor(Math.random() * 3),
            color: ["#ef4444", "#3b82f6", "#f97316"][
              Math.floor(Math.random() * 3)
            ],
          });
        }
      }

      /* 🪙 COINS */
      if (Math.random() < 0.015) {
        const lane = lanes[Math.floor(Math.random() * lanes.length)];

        const isBlocked = coins.current.some(
          (c) => c.x === lane && c.y < 80
        );

        if (!isBlocked) {
          coins.current.push({
            x: lane,
            y: -20,
          });
        }
      }

      /* 🚧 DRAW ENEMY */
      obstacles.current.forEach((obs) => {
        obs.y += speed.current;

        ctx.shadowColor = obs.color;
        ctx.shadowBlur = 10;

        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, 40, 70);

        ctx.shadowBlur = 0;

        ctx.fillStyle = "#111";
        ctx.fillRect(obs.x + 6, obs.y + 10, 28, 18);

        ctx.fillStyle = "#000";
        ctx.fillRect(obs.x - 3, obs.y + 10, 5, 15);
        ctx.fillRect(obs.x + 38, obs.y + 10, 5, 15);
        ctx.fillRect(obs.x - 3, obs.y + 45, 5, 15);
        ctx.fillRect(obs.x + 38, obs.y + 45, 5, 15);

        ctx.fillStyle = "#fef08a";
        ctx.fillRect(obs.x + 5, obs.y - 4, 8, 4);
        ctx.fillRect(obs.x + 27, obs.y - 4, 8, 4);

        if (
          carX.current < obs.x + 40 &&
          carX.current + 40 > obs.x &&
          carY < obs.y + 70 &&
          carY + 70 > obs.y
        ) {
          saveScore(Math.floor(score)); // ✅ FIX
          setStarted(false);
        }
      });

      /* 🪙 COINS */
      coins.current.forEach((coin, i) => {
        coin.y += speed.current;

        const cx = coin.x + 15;
        const cy = coin.y + 15;

        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();

        if (
          carX.current < coin.x + 30 &&
          carX.current + 40 > coin.x &&
          carY < coin.y + 30 &&
          carY + 70 > coin.y
        ) {
          coins.current.splice(i, 1);
          setScore((s) => s + 10);
        }
      });

      obstacles.current = obstacles.current.filter((o) => o.y < 500);
      coins.current = coins.current.filter((c) => c.y < 500);

      const elapsed = (Date.now() - startTime.current) / 1000;
      speed.current = 3 + Math.min(elapsed / 60, 3);

      setScore((s) => s + 0.05);

      frame = requestAnimationFrame(gameLoop);
    };

    frame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frame);
  }, [started]);

  /* 🏆 HIGH SCORE */
  useEffect(() => {
    if (!started && score > highScore) {
      localStorage.setItem("racingHighScore", Math.floor(score));
      setHighScore(Math.floor(score));
    }
  }, [started]);

  return (
    <div className="race-container">
   <button
  className="race-back"
  onClick={() => {
    if (started) {
      saveScore(Math.floor(score)); // ✅ save before exit
    }
    navigate("/fun");
  }}
>
        ← Back
      </button>

      {!started && (
        <div className="race-start">
          <h1>🏎️ Car Racing</h1>
          <p>Dodge traffic & collect coins</p>
          <p>🏆 High Score: {highScore}</p>
          <button onClick={startGame}>Start Game</button>
        </div>
      )}

      {started && (
        <>
          <h2 className="score">Score: {Math.floor(score)}</h2>

          <canvas ref={canvasRef} width={320} height={500}></canvas>

          <div className="controls">
            <button onClick={moveLeft}>⬅️</button>
            <button onClick={moveRight}>➡️</button>
          </div>
        </>
      )}
    </div>
  );
}