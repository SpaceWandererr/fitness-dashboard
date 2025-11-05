import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import Calendar from "./components/Calendar.jsx";
import Syllabus from "./components/Syllabus.jsx";
import BMI from "./components/BMI.jsx";
import Planner from "./components/Planner.jsx";
import Gallery from "./components/Gallery.jsx";
import Quotes from "./components/Quotes.jsx";
import Quiz from "./components/Quiz.jsx";
import Stats from "./components/Stats.jsx";
import Focus from "./components/Focus.jsx";
import Calories from "./components/Calories.jsx";
import Goals from "./components/Goals.jsx";
import Gym from "./components/Gym.jsx";
import { load, save } from "./utils/localStorage.js";

export default function App() {
  const [dark, setDark] = useState(() => load("wd_dark", false));
  const [accent, setAccent] = useState(() => load("wd_accent", "222 81% 55%"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    save("wd_dark", dark);
  }, [dark]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    save("wd_accent", accent);
  }, [accent]);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between p-3 gap-2">
          <Link to="/" className="font-semibold">
            WebDev Fitness v2
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <NavLink to="/planner">Planner</NavLink>
            <NavLink to="/gym">Gym</NavLink>
            <NavLink to="/calendar">Calendar</NavLink>
            <NavLink to="/syllabus">Syllabus</NavLink>
            <NavLink to="/bmi">BMI</NavLink>
            <NavLink to="/calories">Calories</NavLink>
            <NavLink to="/stats">Stats</NavLink>
            <NavLink to="/focus">Focus</NavLink>
            <NavLink to="/gallery">Photos</NavLink>
            <NavLink to="/quiz">Quiz</NavLink>
            <NavLink to="/goals">Goals</NavLink>
            <button
              onClick={() => setDark((v) => !v)}
              className="px-2 py-1 rounded border"
            >
              {dark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gym" element={<Gym />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/bmi" element={<BMI />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/calories" element={<Calories />} />
          <Route path="/goals" element={<Goals onAccent={setAccent} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="text-center p-6 opacity-70">
        <p>Keep shipping. Keep lifting.</p>
      </footer>
    </div>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {children}
    </Link>
  );
}
