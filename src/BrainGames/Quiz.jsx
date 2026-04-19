import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { quizData } from "./quizData";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { updateScore } from "../utils/helpers"; // 🔥 IMPORTANT
import "./Quiz.css";

export default function Quiz() {
  const navigate = useNavigate();

  const categories = ["html", "css", "js", "react"];

  const [categoryIndex, setCategoryIndex] = useState(0);
  const category = categories[categoryIndex];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [saved, setSaved] = useState(false); // 🔥 FIX

  const currentQuestions = quizData[category];
  const currentQuestion = currentQuestions[current];

  /* ========================= */
  /* 🎯 HANDLE ANSWER */
  /* ========================= */
  const handleAnswer = (option) => {
    if (selected) return;

    setSelected(option);

    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelected(null);

      if (current + 1 < currentQuestions.length) {
        setCurrent((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  /* ========================= */
  /* 💾 SAVE SCORE (DASHBOARD) */
  /* ========================= */
  useEffect(() => {
    if (!showResult || saved) return;

    if (score === currentQuestions.length) {
      updateScore(category, "win");
    } else if (score >= currentQuestions.length / 2) {
      updateScore(category, "draw");
    } else {
      updateScore(category, "loss");
    }

    setSaved(true);
  }, [showResult]);

  /* ========================= */
  /* 🔁 RESET */
  /* ========================= */
  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setSaved(false); // 🔥 IMPORTANT
  };

  /* ========================= */
  /* 👉 NEXT CATEGORY */
  /* ========================= */
  const nextCategory = () => {
    if (categoryIndex < categories.length - 1) {
      setCategoryIndex((prev) => prev + 1);
      resetQuiz();
    }
  };

  /* ========================= */
  /* 👉 PREV CATEGORY */
  /* ========================= */
  const prevCategory = () => {
    if (categoryIndex > 0) {
      setCategoryIndex((prev) => prev - 1);
      resetQuiz();
    }
  };

  /* 🧠 FORMAT NAME */
  const formatName = (name) => name.toUpperCase();

  return (
    <div className="quiz-page">

      {/* 🔙 BACK */}
      <div className="back-btn" onClick={() => navigate("/brain")}>
        <ArrowLeft size={18} /> Back
      </div>

      {/* 🧠 HEADER */}
      <div className="quiz-header-top">
        <h1>Tech Quiz</h1>
        <p>HTML • CSS • JavaScript • React</p>
      </div>

      {/* 🔄 CATEGORY NAV */}
      <div className="quiz-nav">

        <button onClick={prevCategory} disabled={categoryIndex === 0}>
          <ChevronLeft size={18} />
        </button>

        <span className="nav-text">
          {formatName(category)}
        </span>

        <button
          onClick={nextCategory}
          disabled={categoryIndex === categories.length - 1}
        >
          <ChevronRight size={18} />
        </button>

      </div>

      {/* 💎 QUIZ CARD */}
      <div className="quiz">

        {showResult ? (
          <div className="result-section">

            <h2 className="result-title">🎉 Quiz Completed</h2>

            <p className="score-text">
              Score: <strong>{score}</strong> / {currentQuestions.length}
            </p>

            {/* 👉 NEXT CATEGORY TEXT */}
            {categoryIndex < categories.length - 1 && (
              <p className="next-category">
                Next: {formatName(categories[categoryIndex + 1])} Quiz →
              </p>
            )}

            <button className="next-btn" onClick={resetQuiz}>
              Restart Quiz
            </button>

            {/* 👉 NEXT CATEGORY BUTTON */}
            {categoryIndex < categories.length - 1 && (
              <button className="next-btn alt" onClick={nextCategory}>
                Go to Next Quiz
              </button>
            )}

          </div>
        ) : (
          <>
            <p className="progress">
              Question {current + 1} of {currentQuestions.length}
            </p>

            <h2 className="question">
              {currentQuestion.question}
            </h2>

            <div className="options">
              {currentQuestion.options.map((opt, i) => {
                let status = "";

                if (selected) {
                  if (opt === currentQuestion.answer) status = "correct";
                  else if (opt === selected) status = "wrong";
                }

                return (
                  <button
                    key={i}
                    className={`option ${status}`}
                    onClick={() => handleAnswer(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}