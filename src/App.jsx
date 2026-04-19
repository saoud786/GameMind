import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import WelcomeFooter from "./components/WelcomeFooter";
import Profile from "./pages/Profile";
import BrainGames from "./pages/BrainGames";
import Favorites from "./components/Favorites";
import GameRoutes from "./GameRoutes";
import ProtectedRoute from "./components/ProtectedRoute"; 
import FunGames from "./pages/FunGames"; // 🔥 ADD THIS
function App() {
  return (
    <BrowserRouter>
      <div className="app">

        {/* 🔔 TOAST */}
        <Toaster position="top-right" />

        <Routes>

          {/* 🔓 AUTH PAGE */}
          <Route
            path="/"
            element={
              <>
                <Welcome />
                <WelcomeFooter />
              </>
            }
          />

          {/* 🔒 HOME */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <>
                  <Home />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* 👤 PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Profile />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* 📊 DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Dashboard />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

<Route
  path="/favorites"
  element={
    <ProtectedRoute>
      <>
        <Favorites />
        <Footer />
      </>
    </ProtectedRoute>
  }
/>


          {/* 🧠 BRAIN GAMES */}
          <Route
            path="/brain"
            element={
              <ProtectedRoute>
                <>
                  <BrainGames />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
<Route
  path="/fun"
  element={
    <ProtectedRoute>
      <>
        <FunGames />
        <Footer />
      </>
    </ProtectedRoute>
  }
/>
          {/* ⭐ FAVORITES */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <>
                  <div style={{
                    padding: "50px",
                    color: "white",
                    textAlign: "center"
                  }}>
                    ⭐ Favorites Coming Soon
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* 🎮 FUN GAMES */}
          {/* <Route
            path="/fun"
            element={
              <ProtectedRoute>
                <>
                  <div style={{
                    padding: "50px",
                    color: "white",
                    textAlign: "center"
                  }}>
                    🎮 Fun Games Coming Soon
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          /> */}

          {/* 🎮 ALL GAME ROUTES */}
          {GameRoutes}

          {/* ❌ INVALID ROUTE */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;