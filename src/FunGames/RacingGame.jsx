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

  /* 🎮 START */
  const startGame = () => {
    carX.current = 140;
    obstacles.current = [];
    coins.current = [];
    speed.current = 3;
    setScore(0);
    setStarted(true);
  };

  /* 🎮 CONTROL */
  const moveLeft = () => {
    carX.current -= 30;
    if (carX.current < 50) carX.current = 50;
  };

  const moveRight = () => {
    carX.current += 30;
    if (carX.current > 230) carX.current = 230;
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

      /* 🌌 BACKGROUND */
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, "#0f172a");
      bg.addColorStop(1, "#020617");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* 🛣 ROAD */
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(50, 0, 220, canvas.height);

      /* 🛣 SIDE SHADOW */
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(50, 0, 10, canvas.height);
      ctx.fillRect(260, 0, 10, canvas.height);

      /* 🛣 LANE DASH */
      roadOffset.current += speed.current * 2;

      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 5;
      ctx.setLineDash([20, 20]);

      ctx.beginPath();
      ctx.moveTo(160, -(roadOffset.current % 40));
      ctx.lineTo(160, canvas.height);
      ctx.stroke();

      ctx.setLineDash([]);

      /* 🚗 PLAYER CAR */
      const carY = 420;

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
      if (Math.random() < 0.025) {
        obstacles.current.push({
          x: Math.random() * 160 + 60,
          y: -80,
          type: Math.floor(Math.random() * 3),
          color: ["#ef4444", "#3b82f6", "#f97316"][
            Math.floor(Math.random() * 3)
          ],
        });
      }

      /* 🪙 SPAWN COINS */
      if (Math.random() < 0.02) {
        coins.current.push({
          x: Math.random() * 160 + 60,
          y: -20,
        });
      }

      /* 🚧 DRAW ENEMY CARS */
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

        /* variation */
        if (obs.type === 1) {
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(obs.x + 8, obs.y + 35, 24, 10);
        }

        if (obs.type === 2) {
          ctx.fillStyle = "#000";
          ctx.fillRect(obs.x + 10, obs.y + 25, 20, 8);
        }

        /* collision */
        if (
          carX.current < obs.x + 40 &&
          carX.current + 40 > obs.x &&
          carY < obs.y + 70 &&
          carY + 70 > obs.y
        ) {
          setStarted(false);
        }
      });

      /* 🪙 COINS */
      coins.current.forEach((coin, i) => {
        coin.y += speed.current;

        const cx = coin.x + 15;
        const cy = coin.y + 15;

        const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 20);
        glow.addColorStop(0, "#fde047");
        glow.addColorStop(1, "transparent");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(cx - 3, cy - 3, 3, 0, Math.PI * 2);
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

      setScore((s) => s + 0.05);

      if (score > 50) speed.current = 4;
      if (score > 120) speed.current = 5;

      frame = requestAnimationFrame(gameLoop);
    };

    frame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frame);
  }, [started, score]);

  /* 🏆 HIGH SCORE */
  useEffect(() => {
    if (!started && score > highScore) {
      localStorage.setItem("racingHighScore", Math.floor(score));
      setHighScore(Math.floor(score));
    }
  }, [started]);

  return (
    <div className="race-container">
      <button className="race-back" onClick={() => navigate("/fun")}>
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