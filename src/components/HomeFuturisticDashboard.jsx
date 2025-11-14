import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomeFuturisticDashboard({ accent = "190 80% 55%" }) {
  const [greeting, setGreeting] = useState(getGreeting());
  const [quote, setQuote] = useState(
    "Focus is the new productivity — build, ship, repeat."
  );

  // Update greeting every few seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreeting());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="lg:col-span-2 rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl flex flex-col gap-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-4xl font-extrabold tracking-tight"
              style={{ color: `hsl(${accent})` }}
            >
              JAY SINH THAKUR
            </h2>

            <p className="mt-1 text-sm opacity-80">
              Web Developer • Fitness • Growth
            </p>

            <p className="mt-3 text-slate-300">
              <strong className="text-slate-100">Dream:</strong> Become a Web
              Developer in <span className="font-semibold">New Zealand</span> 🇳🇿
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs opacity-70 uppercase">{greeting}</div>
            <div className="text-sm font-medium">{formatDate(new Date())}</div>
            <Link
              to="/goals"
              className="text-sm underline mt-2 inline-block opacity-80"
            >
              View All Goals →
            </Link>
          </div>
        </div>

        {/* DREAM CARD */}
        <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-between mt-3">
          <div>
            <h3 className="font-semibold text-lg">Dream Goal — New Zealand</h3>
            <p className="text-sm opacity-80 mt-1">
              Improve portfolio • Apply to remote roles • Prepare for visa
            </p>
            <div className="mt-3 flex gap-3">
              <button className="px-3 py-2 rounded-md bg-white/10 border border-white/20 text-sm">
                Plan Roadmap
              </button>
              <button className="px-3 py-2 rounded-md border border-white/20 text-sm">
                Add Milestone
              </button>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold">Target: 2026</div>
            <div className="text-xs opacity-80">Days left</div>
            <div className="text-2xl font-bold text-sky-300">
              {daysLeftToYear(2026)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT-SIDE WIDGETS */}
      <div className="flex flex-col gap-6">
        <Widget title="Quote of the Day">
          <div className="text-sm italic">“{quote}”</div>
        </Widget>

        <Widget title="Calendar Summary">
          <p className="text-sm">3 tasks scheduled today</p>
          <Link to="/calendar" className="text-sm underline mt-2 inline-block">
            Open Calendar →
          </Link>
        </Widget>

        <Widget title="Streak Counter">
          <p className="text-sm">
            Coding Streak: <strong>6 days</strong>
          </p>
          <p className="text-sm">
            Gym Streak: <strong>4 days</strong>
          </p>
        </Widget>
      </div>
    </div>
  );
}

/* -------------------- WIDGET COMPONENT -------------------- */
function Widget({ title, children }) {
  return (
    <div className="rounded-xl p-4 backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
      <h4 className="font-semibold mb-2">{title}</h4>
      {children}
    </div>
  );
}

/* -------------------- UTIL FUNCTIONS -------------------- */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Night Owl";
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function daysLeftToYear(year) {
  const now = new Date();
  const target = new Date(`${year}-01-01T00:00:00`);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}
