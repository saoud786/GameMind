/* ========================= */
/* 🧠 GET SCORES */
/* ========================= */
export const getScores = () => {
  try {
    const data = JSON.parse(localStorage.getItem("scores"));

    // 🔒 ensure object
    if (!data || typeof data !== "object") return {};

    return data;
  } catch (err) {
    return {};
  }
};

/* ========================= */
/* 💾 SAVE SCORES */
/* ========================= */
export const saveScores = (scores) => {
  localStorage.setItem("scores", JSON.stringify(scores));
};

/* ========================= */
/* 🔄 UPDATE SCORE */
/* ========================= */
export const updateScore = (game, result) => {
  if (!game) return;

  const scores = getScores();

  // 🆕 create if not exist
  if (!scores[game]) {
    scores[game] = {
      win: 0,
      loss: 0,
      draw: 0,
      lastPlayed: 0, // 🔥 IMPORTANT
    };
  }

  // 🔒 safety check
  if (!["win", "loss", "draw"].includes(result)) return;

  // 🎯 update count
  scores[game][result] += 1;

  // 🔥 update last played time
  scores[game].lastPlayed = Date.now();

  saveScores(scores);
};

/* ========================= */
/* 🔁 RESET */
/* ========================= */
export const resetScores = () => {
  localStorage.removeItem("scores");
};