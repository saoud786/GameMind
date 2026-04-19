import { Route } from "react-router-dom";

/* 🧠 BRAIN GAMES */
import TicTacToe from "./BrainGames/TicTacToe";
import Quiz from "./BrainGames/Quiz";
import MemoryGame from "./BrainGames/MemoryGame";
import SlidingPuzzle from "./BrainGames/SlidingPuzzle";
import Sudoku from "./BrainGames/Sudoku";

/* 🎮 FUN GAMES */
import SnakeGame from "./FunGames/SnakeGame";
import FlyingBird from "./FunGames/FlyingBird";
import RacingGame from "./FunGames/RacingGame"; // ✅ NEW ADDED

/* 🧩 COMMON */
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

/* 🔥 WRAPPER (REUSABLE CLEAN CODE) */
const withLayout = (Component) => (
  <ProtectedRoute>
    <>
      <Component />
      <Footer />
    </>
  </ProtectedRoute>
);

const GameRoutes = (
  <>
    {/* ========================= */}
    {/* 🧠 BRAIN GAMES */}
    {/* ========================= */}

    <Route path="/tic-tac-toe" element={withLayout(TicTacToe)} />
    <Route path="/quiz" element={withLayout(Quiz)} />
    <Route path="/memory" element={withLayout(MemoryGame)} />
    <Route path="/sliding-puzzle" element={withLayout(SlidingPuzzle)} />
    <Route path="/sudoku" element={withLayout(Sudoku)} />

    {/* ========================= */}
    {/* 🎮 FUN GAMES */}
    {/* ========================= */}

    <Route path="/snake" element={withLayout(SnakeGame)} />
    <Route path="/flying-bird" element={withLayout(FlyingBird)} />

    {/* 🏎️ NEW RACING GAME */}
    <Route path="/racing" element={withLayout(RacingGame)} />
  </>
);

export default GameRoutes;