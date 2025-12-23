import { useState, useEffect, useMemo } from "react";
import { load, save } from "../utils/localStorage.js";

const STORAGE_KEY = "wd_global_upgrade_v2";

export default function GlobalUpgradeDashboard({
  dashboardState,
  updateDashboard,
}) {
  const [data, setData] = useState(() =>
    load(STORAGE_KEY, {
      country: "Germany",
      role: "Frontend",
      path: "Job",
      weeklyFocus: "Finish Portfolio Project #2",
      checklists: {
        skills: [
          { name: "React Advanced Patterns", done: false },
          { name: "REST APIs & GraphQL", done: false },
          { name: "Testing (Jest/Vitest)", done: false },
          { name: "Performance Optimization", done: false },
          { name: "TypeScript", done: false },
        ],
        language: [
          { name: "IELTS Speaking (Band 7)", done: false },
          { name: "IELTS Writing (Band 7)", done: false },
          { name: "Professional Email Writing", done: false },
        ],
        visa: [
          { name: "Passport Ready", done: false },
          { name: "Bank Statements", done: false },
          { name: "Job Offer Letter", done: false },
        ],
        savings: [
          { name: "₹2L Emergency Fund", done: false },
          { name: "₹5L Relocation Fund", done: false },
        ],
      },
      dds: {},
    }),
  );

  const today = new Date().toISOString().slice(0, 10);

  // Initialize today's DDS if not exists
  useEffect(() => {
    if (!data.dds[today]) {
      const newData = {
        ...data,
        dds: {
          ...data.dds,
          [today]: {
            gym: false,
            coding: false,
            english: false,
            portfolio: false,
            sleep: false,
          },
        },
      };
      setData(newData);
      save(STORAGE_KEY, newData);
    }
  }, [today]);

  const updateData = (updates) => {
    const next = { ...data, ...updates };
    setData(next);
    save(STORAGE_KEY, next);
  };

  // Load projects from dashboardState
  const portfolioProjects = useMemo(() => {
    if (!dashboardState?.wd_projects) return [];

    const projects = [];
    const PROJECT_SECTIONS = {
      HTML: [
        "Responsive Magazine Layout",
        "Interactive Resume + Download",
        "Multi-section Landing (Marketing)",
        "Accessible Form Builder",
        "Static Blog Template",
        "Portfolio w/ Filter + Lightbox",
        "Micro-Interactions Kit (CSS only)",
        "HTML Canvas Illustration Page",
        "Email Template Inliner",
        "Static CMS Clone (Read-only)",
      ],
      CSS: [
        "Glassmorphism Dashboard Card Set",
        "Advanced Responsive Grid System",
        "CSS Component Library (Buttons/Inputs)",
        "Animated Pricing Grid with Toggle",
        "Pure-CSS Image Gallery Effects",
        "Fluid Typography Demo",
        "CSS-only Modal + Tabs",
        "Complex Form Layout + Validation UI",
        "Design System Tokens Page",
        "Interactive SVG + Keyframe Animations",
      ],
      TAILWIND: [
        "Admin Dashboard UI (Tailwind)",
        "E-Commerce Product Grid",
        "Tailwind Component Library",
        "Landing with Hero + Builder",
        "Tailwind + HeadlessUI Modal Flow",
        "Responsive Sidebar Layout",
        "Tailwind Blog + CMS Frontend",
        "Settings Page with Theme Switch",
        "Notifications + Toasters UI",
        "Search + Filters UI (Tailwind)",
      ],
      JAVASCRIPT: [
        "SPA Weather App + Caching",
        "Realtime Search (Debounce) UI",
        "Pomodoro + Session Tracker",
        "Expense Tracker with Charts",
        "Drag + Drop Kanban (vanilla)",
        "Image Editor (crop/resize)",
        "Audio Player with Visualizer",
        "API Rate-Limited Fetch Demo",
        "Infinite Scroll Virtualization",
        "Web Worker Heavy Computation Demo",
      ],
      REACT: [
        "Component Library + Storybook",
        "Complex Form with Validation Hooks",
        "State Management Demo (Context/Reducer)",
        "React Router Multi-page App",
        "Realtime Search with Suspense",
        "Custom Hooks Pack + Tests",
        "Optimized List Virtualization",
        "React Canvas Interactive",
        "SSR-ready React App (Next-like)",
        "MFE (microfrontend) demo (basic)",
      ],
      "NODE+MONGO": [
        "Auth Service (JWT + Refresh)",
        "Notes API with File Upload",
        "Payments Sandbox (test)",
        "Image Resize CDN Middleware",
        "Role-Based Access API",
        "Searchable Posts API (text-index)",
        "Realtime via WebSockets (simple chat)",
        "Rate limiting + Security Middleware",
        "Email Verification Flow",
        "Analytics Event Collector API",
      ],
      MERN: [
        "Full Auth + Profile (Roles)",
        "MERN Blog with Editor + Uploads",
        "MERN Chat App (socket + db)",
        "MERN E-Commerce (cart + orders)",
        "MERN Fitness Tracker (graphing)",
        "MERN Study Tracker (your app)",
        "MERN Social Feed (like/comment)",
        "MERN SaaS Dashboard (billing stub)",
        "MERN AI Prompt Hub (frontend+api)",
        "MERN Deployment Pipeline Demo",
      ],
    };

    Object.entries(dashboardState.wd_projects).forEach(
      ([section, sectionData]) => {
        if (section === "_meta" || !sectionData) return;

        const sectionList = PROJECT_SECTIONS[section] || [];

        Object.entries(sectionData).forEach(([idx, completed]) => {
          if (idx === "completionDates" || idx === "deadlineDates") return;
          const projectIdx = parseInt(idx);
          if (isNaN(projectIdx) || !sectionList[projectIdx]) return;

          const projectName = sectionList[projectIdx];
          const completionDate = sectionData.completionDates?.[idx];

          if (completed === true) {
            projects.push({
              id: `${section}-${idx}`,
              name: projectName,
              section: section,
              skills: [section],
              github: false,
              live: false,
              caseStudy: false,
              readme: false,
              mobile: false,
              accessibility: false,
              completionDate: completionDate || null,
            });
          }
        });
      },
    );

    return projects;
  }, [dashboardState]);

  // Calculate readiness dynamically
  const readiness = useMemo(() => {
    const skillsDone = data.checklists.skills.filter((s) => s.done).length;
    const langDone = data.checklists.language.filter((l) => l.done).length;
    const visaDone = data.checklists.visa.filter((v) => v.done).length;
    const savingsDone = data.checklists.savings.filter((s) => s.done).length;

    const projectsCompleted = portfolioProjects.length;
    const projectsWithQuality = portfolioProjects.filter(
      (p) =>
        p.github &&
        p.live &&
        p.caseStudy &&
        p.readme &&
        p.mobile &&
        p.accessibility,
    ).length;

    const totalItems =
      data.checklists.skills.length +
      data.checklists.language.length +
      data.checklists.visa.length +
      data.checklists.savings.length +
      Math.max(projectsCompleted, 3);

    const doneItems =
      skillsDone + langDone + visaDone + savingsDone + projectsWithQuality;

    return Math.round((doneItems / totalItems) * 100);
  }, [data.checklists, portfolioProjects]);

  // Calculate today's DDS score
  const todayScore = useMemo(() => {
    const todayData = data.dds[today] || {
      gym: false,
      coding: false,
      english: false,
      portfolio: false,
      sleep: false,
    };
    return (
      (todayData.gym ? 20 : 0) +
      (todayData.coding ? 30 : 0) +
      (todayData.english ? 20 : 0) +
      (todayData.portfolio ? 20 : 0) +
      (todayData.sleep ? 10 : 0)
    );
  }, [data.dds, today]);

  // Calculate weekly average
  const weeklyAverage = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().slice(0, 10);
    });

    const scores = last7Days.map((date) => {
      const dayData = data.dds[date];
      if (!dayData) return 0;
      return (
        (dayData.gym ? 20 : 0) +
        (dayData.coding ? 30 : 0) +
        (dayData.english ? 20 : 0) +
        (dayData.portfolio ? 20 : 0) +
        (dayData.sleep ? 10 : 0)
      );
    });

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [data.dds]);

  // Get status text
  const getStatusText = () => {
    if (readiness < 50) return "❌ Not Ready";
    if (readiness < 80) return "⚠️ Interview Ready";
    return "✅ Relocation Ready";
  };

  // Toggle checklist item
  const toggleChecklistItem = (category, index) => {
    const nextChecklists = { ...data.checklists };
    nextChecklists[category] = [...nextChecklists[category]];
    nextChecklists[category][index] = {
      ...nextChecklists[category][index],
      done: !nextChecklists[category][index].done,
    };
    updateData({ checklists: nextChecklists });
  };

  // Toggle DDS habit with proper state immutability
  const toggleHabit = (habit) => {
    setData((prev) => {
      const todayData = prev.dds[today] || {
        gym: false,
        coding: false,
        english: false,
        portfolio: false,
        sleep: false,
      };
      const next = {
        ...prev,
        dds: {
          ...prev.dds,
          [today]: {
            ...todayData,
            [habit]: !todayData[habit],
          },
        },
      };
      save(STORAGE_KEY, next);
      return next;
    });
  };

  // Toggle project field
  const toggleProjectField = (id, field) => {
    const updatedProjects = portfolioProjects.map((p) =>
      p.id === id ? { ...p, [field]: !p[field] } : p,
    );
    setData({ ...data });
  };

  // Generate insight message
  const getInsightMessage = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().slice(0, 10);
    });

    const lowDays = last7Days.filter((date) => {
      const dayData = data.dds[date];
      if (!dayData) return false;
      const score =
        (dayData.gym ? 20 : 0) +
        (dayData.coding ? 30 : 0) +
        (dayData.english ? 20 : 0) +
        (dayData.portfolio ? 20 : 0) +
        (dayData.sleep ? 10 : 0);
      return score < 65;
    }).length;

    if (lowDays === 0) return "🔥 Perfect consistency! Keep this up.";
    if (lowDays < 3) return `⚠️ ${lowDays} low days this week. Stay focused.`;
    return `🚨 ${lowDays} low days delay relocation by ~${Math.ceil(lowDays * 0.5)} weeks`;
  };

  return (
    <div className="space-y-8 md:mt-10 lg:mt-0">
      {/* SECTION 1: Global Career Roadmap */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 shadow-xl backdrop-blur">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold uppercase tracking-wide text-slate-100">
          🌍 Global Career Roadmap
        </h2>

        {/* Target Selector */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Target Country
            </label>
            <select
              value={data.country}
              onChange={(e) => updateData({ country: e.target.value })}
              className="w-full rounded-lg border border-slate-700/60 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option>Germany</option>
              <option>Finland</option>
              <option>Canada</option>
              <option>Netherlands</option>
              <option>Norway</option>
              <option>Sweden</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Target Role
            </label>
            <select
              value={data.role}
              onChange={(e) => updateData({ role: e.target.value })}
              className="w-full rounded-lg border border-slate-700/60 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option>Frontend</option>
              <option>Full Stack</option>
              <option>Backend</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Migration Path
            </label>
            <select
              value={data.path}
              onChange={(e) => updateData({ path: e.target.value })}
              className="w-full rounded-lg border border-slate-700/60 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option>Job</option>
              <option>Study</option>
              <option>Remote</option>
            </select>
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="mb-6 flex flex-col items-center gap-4 rounded-xl border border-slate-700/40 bg-slate-900/60 p-5 sm:flex-row">
          <div className="relative h-32 w-32 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="h-full w-full">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1e293b"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  readiness < 50
                    ? "#ef4444"
                    : readiness < 80
                      ? "#f59e0b"
                      : "#10b981"
                }
                strokeWidth="3"
                strokeDasharray={`${readiness}, 100`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
              <text
                x="18"
                y="20.5"
                textAnchor="middle"
                fontSize="8"
                fontWeight="bold"
                fill="#fff"
              >
                {readiness}%
              </text>
            </svg>
          </div>
          <div className="flex-1">
            <div className="mb-1 text-xl font-bold text-slate-100">
              {getStatusText()}
            </div>
            <div className="mb-3 text-xs text-slate-400">
              Based on {portfolioProjects.length} completed projects,{" "}
              {Object.keys(data.checklists).reduce(
                (acc, key) => acc + data.checklists[key].length,
                0,
              )}{" "}
              checklist items
            </div>
            <div className="rounded-lg bg-indigo-500/10 px-3 py-2 text-sm text-indigo-300">
              <span className="font-semibold">This week:</span>{" "}
              {data.weeklyFocus}
            </div>
          </div>
        </div>

        {/* Checklists */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.keys(data.checklists).map((category) => (
            <details
              key={category}
              className="group rounded-lg border border-slate-700/40 bg-slate-900/60"
            >
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold capitalize text-slate-200 transition hover:text-indigo-400">
                {category} (
                {data.checklists[category].filter((i) => i.done).length}/
                {data.checklists[category].length})
              </summary>
              <ul className="space-y-2 px-4 pb-3">
                {data.checklists[category].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleChecklistItem(category, idx)}
                      className="h-4 w-4 accent-indigo-500"
                    />
                    <span
                      className={`text-xs ${item.done ? "text-slate-500 line-through" : "text-slate-300"}`}
                    >
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      {/* SECTION 2: Portfolio & Proof Builder */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 shadow-xl backdrop-blur">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide text-slate-100">
            🎯 Portfolio & Proof Builder
          </h2>
        </div>

        <div className="mb-4 text-sm text-slate-400">
          <span className="font-semibold text-slate-200">
            {portfolioProjects.length}
          </span>{" "}
          projects completed • Synced from your Projects page
        </div>

        {portfolioProjects.length === 0 ? (
          <div className="rounded-lg border border-slate-700/40 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
            No completed projects yet. Mark projects as complete on your
            Projects page to see them here.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolioProjects.map((project) => (
              <article
                key={project.id}
                className="group relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/80 p-4 shadow-lg transition hover:border-indigo-500/50"
              >
                <h3 className="mb-2 font-semibold text-slate-100">
                  {project.name}
                </h3>
                <div className="mb-3 flex flex-wrap gap-1">
                  {project.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {project.completionDate && (
                  <div className="mb-2 text-xs text-slate-400">
                    Completed:{" "}
                    {project.completionDate.split("-").reverse().join("-")}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={project.github}
                      onChange={() => toggleProjectField(project.id, "github")}
                      className="accent-indigo-500"
                    />
                    <span
                      className={
                        project.github ? "text-green-400" : "text-slate-500"
                      }
                    >
                      GitHub
                    </span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={project.live}
                      onChange={() => toggleProjectField(project.id, "live")}
                      className="accent-indigo-500"
                    />
                    <span
                      className={
                        project.live ? "text-green-400" : "text-slate-500"
                      }
                    >
                      Live
                    </span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={project.caseStudy}
                      onChange={() =>
                        toggleProjectField(project.id, "caseStudy")
                      }
                      className="accent-indigo-500"
                    />
                    <span
                      className={
                        project.caseStudy ? "text-green-400" : "text-slate-500"
                      }
                    >
                      Case Study
                    </span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={project.readme}
                      onChange={() => toggleProjectField(project.id, "readme")}
                      className="accent-indigo-500"
                    />
                    <span
                      className={
                        project.readme ? "text-green-400" : "text-slate-500"
                      }
                    >
                      README
                    </span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={project.mobile}
                      onChange={() => toggleProjectField(project.id, "mobile")}
                      className="accent-indigo-500"
                    />
                    <span
                      className={
                        project.mobile ? "text-green-400" : "text-slate-500"
                      }
                    >
                      Mobile
                    </span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={project.accessibility}
                      onChange={() =>
                        toggleProjectField(project.id, "accessibility")
                      }
                      className="accent-indigo-500"
                    />
                    <span
                      className={
                        project.accessibility
                          ? "text-green-400"
                          : "text-slate-500"
                      }
                    >
                      A11y
                    </span>
                  </label>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: Daily Discipline Score */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 shadow-xl backdrop-blur">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold uppercase tracking-wide text-slate-100">
          🔥 Daily Discipline Score
        </h2>

        <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-900/60 p-5">
          <div>
            <div className="text-4xl font-bold text-slate-100">
              {todayScore} / 100
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Today's Score • {today}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-300">
              {weeklyAverage}
            </div>
            <div className="mt-1 text-xs text-slate-400">7-Day Avg</div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {["gym", "coding", "english", "portfolio", "sleep"].map((habit) => {
            const isChecked = data.dds[today]?.[habit] || false;
            return (
              <label
                key={habit}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 transition ${
                  isChecked
                    ? "border-indigo-500 bg-indigo-500/20"
                    : "border-slate-700/60 bg-slate-900/60 hover:border-slate-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleHabit(habit)}
                  className="h-5 w-5 accent-indigo-500"
                />
                <span className="text-xs font-semibold capitalize text-slate-200">
                  {habit}
                </span>
                <span className="text-xs text-slate-500">
                  {habit === "gym" && "20 pts"}
                  {habit === "coding" && "30 pts"}
                  {habit === "english" && "20 pts"}
                  {habit === "portfolio" && "20 pts"}
                  {habit === "sleep" && "10 pts"}
                </span>
              </label>
            );
          })}
        </div>

        {/* Weekly Trend */}
        <div className="mb-4 rounded-lg border border-slate-700/40 bg-slate-900/60 p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Last 7 Days
          </div>
          <div className="flex items-end justify-between gap-1">
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const dateStr = d.toISOString().slice(0, 10);
              const dayData = data.dds[dateStr];
              const score = dayData
                ? (dayData.gym ? 20 : 0) +
                  (dayData.coding ? 30 : 0) +
                  (dayData.english ? 20 : 0) +
                  (dayData.portfolio ? 20 : 0) +
                  (dayData.sleep ? 10 : 0)
                : 0;
              const isToday = dateStr === today;

              return (
                <div
                  key={dateStr}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className={`w-full rounded-t transition ${
                      score >= 80
                        ? "bg-green-500"
                        : score >= 65
                          ? "bg-yellow-500"
                          : score > 0
                            ? "bg-red-500"
                            : "bg-slate-700"
                    }`}
                    style={{ height: `${Math.max(score, 10)}px` }}
                  ></div>
                  <div
                    className={`text-xs ${isToday ? "font-bold text-indigo-400" : "text-slate-500"}`}
                  >
                    {d.toLocaleDateString("en-US", { weekday: "short" })[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg bg-slate-900/60 px-4 py-3 text-xs text-slate-400">
          💡 <span className="font-semibold">{getInsightMessage()}</span>
        </div>
      </section>
    </div>
  );
}
