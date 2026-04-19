import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SnakeGame.css";

const GRID_SIZE = 20;

export default function SnakeGame() {
  const navigate = useNavigate();

  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("snakeHighScore")) || 0
  );

  const direction = useRef("RIGHT");
  const canChangeDirection = useRef(true); // 🔥 FIX
  const speed = 120;

  /* 🎮 KEYBOARD CONTROL */
  useEffect(() => {
    const handleKey = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      changeDirection(e.key);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* 🔥 SAFE DIRECTION CONTROL */
  const changeDirection = (key) => {
    if (!canChangeDirection.current) return;

    if ((key === "ArrowUp" || key === "UP") && direction.current !== "DOWN") {
      direction.current = "UP";
      canChangeDirection.current = false;
    }

    if ((key === "ArrowDown" || key === "DOWN") && direction.current !== "UP") {
      direction.current = "DOWN";
      canChangeDirection.current = false;
    }

    if ((key === "ArrowLeft" || key === "LEFT") && direction.current !== "RIGHT") {
      direction.current = "LEFT";
      canChangeDirection.current = false;
    }

    if ((key === "ArrowRight" || key === "RIGHT") && direction.current !== "LEFT") {
      direction.current = "RIGHT";
      canChangeDirection.current = false;
    }
  };

  /* 🍎 FOOD */
  const generateFood = (snakeBody) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };

      const overlap = snakeBody.some(
        (s) => s.x === newFood.x && s.y === newFood.y
      );

      if (!overlap) break;
    }
    return newFood;
  };

  /* 🔁 GAME LOOP */
  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      canChangeDirection.current = true; // 🔥 unlock every frame

      setSnake((prevSnake) => {
        const newHead = { ...prevSnake[0] };

        if (direction.current === "UP") newHead.y -= 1;
        if (direction.current === "DOWN") newHead.y += 1;
        if (direction.current === "LEFT") newHead.x -= 1;
        if (direction.current === "RIGHT") newHead.x += 1;

        /* WALL */
        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        /* SELF */
        for (let i = 1; i < prevSnake.length; i++) {
          if (
            prevSnake[i].x === newHead.x &&
            prevSnake[i].y === newHead.y
          ) {
            setGameOver(true);
            return prevSnake;
          }
        }

        let newSnake = [newHead, ...prevSnake];

        /* FOOD */
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [food, gameOver, started]);

  /* 🏆 SAVE SCORE */
  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        localStorage.setItem("snakeHighScore", score);
        setHighScore(score);
      }

      const scores = JSON.parse(localStorage.getItem("scores")) || {};

      if (!scores.snake) {
        scores.snake = { best: 0, played: 0, lastPlayed: Date.now() };
      }

      scores.snake.best = Math.max(scores.snake.best, score);
      scores.snake.played += 1;
      scores.snake.lastPlayed = Date.now();

      localStorage.setItem("scores", JSON.stringify(scores));
    }
  }, [gameOver]);

  /* RESET */
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    direction.current = "RIGHT";
    setGameOver(false);
    setScore(0);
    setStarted(false);
  };

  const startGame = () => {
    resetGame();
    setStarted(true);
  };

  return (
    <div className="snake-container">

      <button className="back-btn" onClick={() => navigate("/fun")}>
        ← Back
      </button>

      {!started && (
        <div className="start-screen">
          <h1>🐍 Snake Game</h1>
          <p className="high-score">🏆 High Score: {highScore}</p>
          <button className="start-btn" onClick={startGame}>
            ▶ Start Game
          </button>
        </div>
      )}

      {started && (
        <>
          <h1>🐍 Snake Game</h1>
          <h2>Score: {score}</h2>

          <div className="grid">
            {[...Array(GRID_SIZE)].map((_, y) =>
              [...Array(GRID_SIZE)].map((_, x) => {
                const isHead = snake[0].x === x && snake[0].y === y;
                const isSnake = snake.some((s) => s.x === x && s.y === y);
                const isFood = food.x === x && food.y === y;

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`cell 
                      ${isHead ? "snake-head" : ""} 
                      ${!isHead && isSnake ? "snake" : ""} 
                      ${isFood ? "food" : ""}`}
                  />
                );
              })
            )}
          </div>

          {/* 📱 MOBILE CONTROLLER (FIXED) */}
          <div className="mobile-controls">
            <button onTouchStart={() => changeDirection("UP")}>⬆</button>

            <div>
              <button onTouchStart={() => changeDirection("LEFT")}>⬅</button>
              <button onTouchStart={() => changeDirection("DOWN")}>⬇</button>
              <button onTouchStart={() => changeDirection("RIGHT")}>➡</button>
            </div>
          </div>

          {gameOver && (
            <div className="game-over">
              <p>💀 Game Over</p>
              <button onClick={startGame}>Play Again</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}