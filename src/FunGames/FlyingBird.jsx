import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FlyingBird.css";

export default function FlyingBird() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("birdHighScore")) || 0
  );

  const birdY = useRef(200);
  const velocity = useRef(0);

  const gravity = 0.28;
  const jump = -5;
  const maxFall = 5;

  const pipes = useRef([]);
  const clouds = useRef([]);

  /* 🎮 START */
  const startGame = () => {
    birdY.current = 200;
    velocity.current = 0;
    pipes.current = [];
    clouds.current = [];
    setScore(0);
    setStarted(true);
  };

  /* 🕹 CONTROL */
  const flap = () => {
    if (!started) return;
    velocity.current = jump;
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") flap();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started]);

  /* 🎮 GAME LOOP */
  useEffect(() => {
    if (!started) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let frame;
    const MAX_CLOUDS = 3;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* ☁️ CLOUDS */
      if (
        clouds.current.length < MAX_CLOUDS &&
        (clouds.current.length === 0 ||
          canvas.width - clouds.current[clouds.current.length - 1].x > 180)
      ) {
        clouds.current.push({
          x: canvas.width + 50,
          y: Math.random() * 160 + 20,
          size: Math.random() * 20 + 25,
          speed: Math.random() * 0.3 + 0.2,
          opacity: Math.random() * 0.25 + 0.35,
        });
      }

      clouds.current.forEach((cloud) => {
        cloud.x -= cloud.speed;

        ctx.globalAlpha = cloud.opacity;

        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size, cloud.y, cloud.size * 0.7, 0, Math.PI * 2);
        ctx.arc(cloud.x - cloud.size, cloud.y, cloud.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff7b";
        ctx.fill();

        ctx.globalAlpha = 1;
      });

      clouds.current = clouds.current.filter((c) => c.x > -120);

      /* 🐦 PHYSICS */
      velocity.current += gravity;
      if (velocity.current > maxFall) velocity.current = maxFall;

      birdY.current += velocity.current;

      const birdX = 65;
      const r = 15;

      /* 🐦 BIRD */
      ctx.beginPath();
      ctx.arc(birdX, birdY.current + r, r, 0, Math.PI * 2);
      ctx.fillStyle = "#facc15";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(birdX + 5, birdY.current + 12, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(birdX - 5, birdY.current + 18, 8, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#f59e0b";
      ctx.fill();

      /* 🧱 PIPES */
      if (
        pipes.current.length === 0 ||
        pipes.current[pipes.current.length - 1].x < 230
      ) {
        const gap = 150;
        const top = Math.random() * 170 + 40;

        pipes.current.push({
          x: 400,
          top,
          bottom: top + gap,
          passed: false,
        });
      }

      pipes.current.forEach((pipe) => {
        pipe.x -= 1.6;

        const grad = ctx.createLinearGradient(pipe.x, 0, pipe.x + 50, 0);
        grad.addColorStop(0, "#22c55e");
        grad.addColorStop(1, "#14532d");

        ctx.fillStyle = grad;
        ctx.fillRect(pipe.x, 0, 50, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 50, canvas.height);

        /* 💥 COLLISION */
        if (
          birdX - r < pipe.x + 50 &&
          birdX + r > pipe.x &&
          (birdY.current < pipe.top || birdY.current + 30 > pipe.bottom)
        ) {
          setStarted(false);
        }

        /* 🏆 SCORE */
        if (!pipe.passed && pipe.x < birdX) {
          pipe.passed = true;
          setScore((s) => s + 1);
        }
      });

      /* 💀 FALL */
      if (birdY.current > canvas.height || birdY.current < 0) {
        setStarted(false);
      }

      frame = requestAnimationFrame(gameLoop);
    };

    frame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frame);
  }, [started]);

  /* 🏆 SAVE HIGH SCORE + DASHBOARD */
  useEffect(() => {
    if (!started && score > 0) {
      /* HIGH SCORE */
      if (score > highScore) {
        localStorage.setItem("birdHighScore", score);
        setHighScore(score);
      }

      /* DASHBOARD SAVE */
      const allScores =
        JSON.parse(localStorage.getItem("scores")) || {};

      const prev = allScores.flyingBird || {
        best: 0,
        played: 0,
      };

      allScores.flyingBird = {
        best: Math.max(prev.best, score),
        played: prev.played + 1,
        lastPlayed: Date.now(),
      };

      localStorage.setItem("scores", JSON.stringify(allScores));
    }
  }, [started]);

  return (
    <div className="bird-container" onClick={flap} onTouchStart={flap}>
      <button className="bird-back" onClick={() => navigate("/fun")}>
        ← Back
      </button>

      {!started && (
        <div className="start-screen">
          <h1>🐦 Flying Bird</h1>

          <p className="subtitle">
            Tap or press <b>SPACE</b> to keep flying
          </p>

          <div className="high-score">
            🏆 High Score: <span>{highScore}</span>
          </div>

          <button onClick={startGame}>▶ Start Game</button>
        </div>
      )}

      {started && (
        <div className="bird-game">
          <div className="score">Score: {score}</div>
          <canvas ref={canvasRef} width={400} height={500}></canvas>
        </div>
      )}
    </div>
  );
}