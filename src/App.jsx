import { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

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
  const navRef = useRef(null);

  const accent = "190 80% 55%"; // cyan-aqua tone

  useEffect(() => {
    function adjustPadding() {
      if (navRef.current) {
        const h = navRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty("--nav-height", `${h}px`);
      }
    }
    adjustPadding();
    window.addEventListener("resize", adjustPadding);
    return () => window.removeEventListener("resize", adjustPadding);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    save("wd_dark", dark);
  }, [dark]);

  return (
    <div
      className={`min-h-[100dvh] overflow-x-hidden text-gray-200 transition-colors duration-300 ${
        dark
          ? "bg-gradient-to-br from-[#0d0d0f] via-[#121212] to-[#1a1a1a]"
          : "bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]"
      }`}
      style={{ "--accent": accent }}
    >
      {/* Navbar MUST be outside the flex parent */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-[#121212]/70 backdrop-blur-lg"
      >
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between p-3 gap-2">
          {/* Name / Logo */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="select-none"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-400 tracking-tight whitespace-nowrap hover:tracking-wider transition-all duration-300">
              JAY&nbsp;SINH&nbsp;THAKUR
            </h1>
          </Link>

          {/* Right-side controls */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-3">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} current={location.pathname}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-full transition-all duration-200 ${
                dark
                  ? "text-emerald-400 hover:text-emerald-300 bg-emerald-900/40"
                  : "text-yellow-400 hover:text-yellow-300 bg-white/10"
              } shadow-md hover:scale-105`}
              title="Toggle Dark Mode"
            >
              {dark ? "🌙" : "☀️"}
            </button>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-800/50"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
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

      {/* Main Content */}
      <main
        key={location.pathname}
        className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 ease-in-out"
        style={{ paddingTop: "calc(var(--nav-height) + 16px)" }}
      >
        <Routes>
          <Route path="/" element={<ModernDashboard accent={accent} />} />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/gym" element={<Gym />} />
          <Route path="/calendar" element={<Calendar />} />
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

      <footer className="text-center p-1 opacity-80 text-xs text-gray-500">
        <p>⚡ Built by Jay Sinh Thakur — Focus. Code. Grow.</p>
      </footer>
    </div>
  );
}

/* ---------- helpers ---------- */

const links = [
  { to: "/home", label: "HOME" },
  { to: "/syllabus", label: "STUDY" },
  { to: "/gym", label: "GYM" },
  { to: "/calendar", label: "CALENDAR" },
  { to: "/planner", label: "Planner" },
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
