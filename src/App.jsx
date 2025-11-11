import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Dashboard from "./components/Dashboard.jsx";
import Calendar from "./components/Calendar.jsx";
import Syllabus from "./components/Syllabus.jsx";
import BMI from "./components/BMI.jsx";
import Planner from "./components/Planner.jsx";
import Gallery from "./components/Gallery.jsx";
import Quiz from "./components/Quiz.jsx";
import Stats from "./components/Stats.jsx";
import Focus from "./components/Focus.jsx";
import Calories from "./components/Calories.jsx";
import Goals from "./components/Goals.jsx";
import Gym from "./components/Gym.jsx";
import { load, save } from "./utils/localStorage.js";

export default function App() {
  const [dark, setDark] = useState(() => load("wd_dark", true));
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const accent = "190 80% 55%"; // cyan-aqua tone

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    save("wd_dark", dark);
  }, [dark]);

  return (
    <div
      className={`min-h-screen text-gray-200 transition-colors duration-300 ${
        dark
          ? "bg-gradient-to-br from-[#0d0d0f] via-[#121212] to-[#1a1a1a]"
          : "bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]"
      }`}
      style={{ "--accent": accent }}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#121212]/70 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl flex items-center justify-between p-3">
          {/* Name / Logo */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent select-none"
          >
            JAY&nbsp;SINH&nbsp;THAKUR
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} current={location.pathname}>
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={() => setDark((v) => !v)}
              className="px-3 py-1 rounded border border-gray-700 text-sm hover:bg-gray-800/60 transition-colors"
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-800/50"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full z-40 mt-1 px-4 py-4 bg-[#181818]/95 backdrop-blur-md border-t border-gray-700 shadow-xl rounded-b-2xl">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded px-3 py-2 text-sm ${
                    location.pathname === link.to
                      ? "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]"
                      : "hover:bg-gray-700/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-3">
              <button
                onClick={() => {
                  setDark((v) => !v);
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-2 rounded border border-gray-600 text-sm bg-gray-800/60 hover:bg-gray-700 transition-colors"
              >
                {dark ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Routes */}
      <main className="mx-auto max-w-7xl p-6">
        <Routes>
          <Route path="/" element={<ModernDashboard accent={accent} />} />
          <Route path="/home" element={<Navigate to="/" />} />
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
          <Route path="/goals" element={<Goals />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="text-center p-6 opacity-80 text-xs text-gray-500">
        <p>⚡ Built by Jay Sinh Thakur — Focus. Code. Grow.</p>
      </footer>
    </div>
  );
}

/* ---------- helpers ---------- */

const links = [
  { to: "/home", label: "Home" },
  { to: "/planner", label: "Planner" },
  { to: "/gym", label: "Gym" },
  { to: "/calendar", label: "Calendar" },
  { to: "/syllabus", label: "Syllabus" },
  { to: "/bmi", label: "BMI" },
  { to: "/calories", label: "Calories" },
  { to: "/stats", label: "Stats" },
  { to: "/focus", label: "Focus" },
  { to: "/gallery", label: "Photos" },
  { to: "/quiz", label: "Quiz" },
  { to: "/goals", label: "Goals" },
];

function NavLink({ to, children, current }) {
  const isActive = current === to;
  return (
    <Link
      to={to}
      className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${
        isActive
          ? "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))] font-semibold"
          : "hover:bg-gray-800/50"
      }`}
    >
      {children}
    </Link>
  );
}

/* ---------- Dashboard ---------- */
function ModernDashboard({ accent }) {
  const cards = [
    { title: "Planner", desc: "Organize your daily tasks efficiently." },
    { title: "Gym", desc: "Track workouts and progress." },
    { title: "Syllabus", desc: "Learn MERN + DSA with milestones." },
    { title: "Calories", desc: "Log macros & daily nutrition." },
    { title: "Focus", desc: "Pomodoro timer for deep work." },
    { title: "Quiz", desc: "Sharpen your JS + DSA skills." },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl bg-[#00224D]/80 backdrop-blur-md p-6 border border-gray-800 shadow-md hover:shadow-[0_0_20px_hsl(var(--accent)/0.25)] hover:-translate-y-[2px] transition-all duration-300"
        >
          <h3
            className="font-semibold text-lg mb-2"
            style={{ color: `hsl(${accent})` }}
          >
            {card.title}
          </h3>
          <p className="text-sm text-gray-400">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
