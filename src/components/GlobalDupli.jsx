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
      projectQuality: {}, // NEW: Store quality checkboxes here
      dds: {},
    })
  );

  const today = new Date().toISOString().slice(0, 10);

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

  // Get completed topics from syllabus
  const completedTopics = useMemo(() => {
    if (!dashboardState?.syllabus_tree_v2) return new Set();

    const topics = new Set();

    const traverse = (node) => {
      if (!node || typeof node !== "object") return;

      if (node.title && node.done) {
        const normalized = node.title.toLowerCase();
        // Extract key technologies
        if (normalized.includes("html")) topics.add("HTML");
        if (normalized.includes("css")) topics.add("CSS");
        if (normalized.includes("tailwind")) topics.add("TAILWIND");
        if (normalized.includes("javascript") || normalized.includes("js"))
          topics.add("JAVASCRIPT");
        if (normalized.includes("react")) topics.add("REACT");
        if (normalized.includes("node") || normalized.includes("express"))
          topics.add("NODE+MONGO");
        if (normalized.includes("mongo") || normalized.includes("database"))
          topics.add("NODE+MONGO");
        if (
          normalized.includes("mern") ||
          normalized.includes("full stack") ||
          normalized.includes("fullstack")
        )
          topics.add("MERN");
      }

      // Recursively check children
      Object.values(node).forEach((child) => {
        if (typeof child === "object" && child !== null) {
          traverse(child);
        }
      });
    };

    traverse(dashboardState.syllabus_tree_v2);
    return topics;
  }, [dashboardState?.syllabus_tree_v2]);

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
          const projectId = `${section}-${idx}`;

          if (completed === true) {
            // Get saved quality data
            const quality = data.projectQuality?.[projectId] || {
              github: false,
              live: false,
              caseStudy: false,
              readme: false,
              mobile: false,
              accessibility: false,
            };

            projects.push({
              id: projectId,
              name: projectName,
              section: section,
              skills: [section],
              completionDate: completionDate || null,
              ...quality, // Spread the quality checkboxes
              isRecommended: completedTopics.has(section), // NEW: Flag if study is complete
            });
          }
        });
      }
    );

    return projects;
  }, [dashboardState, data.projectQuality, completedTopics]);

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
        p.accessibility
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

  const getStatusText = () => {
    if (readiness < 50) return "❌ Not Ready";
    if (readiness < 80) return "⚠️ Interview Ready";
    return "✅ Relocation Ready";
  };

  const toggleChecklistItem = (category, index) => {
    const nextChecklists = { ...data.checklists };
    nextChecklists[category] = [...nextChecklists[category]];
    nextChecklists[category][index] = {
      ...nextChecklists[category][index],
      done: !nextChecklists[category][index].done,
    };
    updateData({ checklists: nextChecklists });
  };

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

  // FIXED: Proper state management for project quality checkboxes
  const toggleProjectField = (projectId, field) => {
    setData((prev) => {
      const currentQuality = prev.projectQuality?.[projectId] || {
        github: false,
        live: false,
        caseStudy: false,
        readme: false,
        mobile: false,
        accessibility: false,
      };

      const next = {
        ...prev,
        projectQuality: {
          ...prev.projectQuality,
          [projectId]: {
            ...currentQuality,
            [field]: !currentQuality[field],
          },
        },
      };

      save(STORAGE_KEY, next);
      return next;
    });
  };

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
    return `🚨 ${lowDays} low days delay relocation by ~${Math.ceil(
      lowDays * 0.5
    )} weeks`;
  };

  // Get suggested projects based on completed study topics
  const suggestedProjects = useMemo(() => {
    return Array.from(completedTopics).map((tech) => ({
      tech,
      message: `You've mastered ${tech}! Build a project to showcase your skills.`,
    }));
  }, [completedTopics]);

  return (
    <div className="space-y-6 md:mt-10 lg:mt-0">
      {/* SECTION 1: Global Career Roadmap */}
      <section className="rounded-2xl border border-[#2F6B60]/40 bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] p-6 shadow-xl backdrop-blur-md">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold tracking-wide bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
          🌍 Global Career Roadmap
        </h2>

        {/* Target Selector */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-emerald-200/70">
              Target Country
            </label>
            <select
              value={data.country}
              onChange={(e) => updateData({ country: e.target.value })}
              className=" w-full rounded-xl border border-emerald-400/30 bg-[#0F766E] px-4 py-2.5 text-sm text-emerald-100 shadow-md transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
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
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-teal-200/70">
              Target Role
            </label>
            <select
              value={data.role}
              onChange={(e) => updateData({ role: e.target.value })}
              className="w-full rounded-xl border border-teal-400/30 bg-[#0F766E] px-4 py-2.5 text-sm text-teal-100 shadow-md transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
            >
              <option>Frontend</option>
              <option>Full Stack</option>
              <option>Backend</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-cyan-200/70">
              Migration Path
            </label>
            <select
              value={data.path}
              onChange={(e) => updateData({ path: e.target.value })}
              className="w-full rounded-xl border border-cyan-400/30 bg-[#0F766E] px-4 py-2.5 text-sm text-cyan-100 shadow-md transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              <option>Job</option>
              <option>Study</option>
              <option>Remote</option>
            </select>
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="mb-6 flex flex-col items-center gap-6 rounded-2xl border border-emerald-500/30 bg-black/30 p-6 backdrop-blur-sm sm:flex-row">
          <div className="relative h-40 w-40 flex-shrink-0">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-xl animate-pulse" />

            <svg viewBox="0 0 36 36" className="relative h-full w-full">
              {/* Background circle */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(15, 118, 110, 0.2)"
                strokeWidth="3"
              />
              {/* Progress circle */}
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
                strokeWidth="3.5"
                strokeDasharray={`${readiness}, 100`}
                strokeLinecap="round"
                className="transition-all duration-700 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
              />
              <text
                x="18"
                y="20.5"
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#E8FFFA"
                className="drop-shadow-md"
              >
                {readiness}%
              </text>
            </svg>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-2 text-2xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              {getStatusText()}
            </div>
            <div className="mb-4 text-xs text-emerald-200/70">
              Based on{" "}
              <span className="font-semibold text-emerald-300">
                {portfolioProjects.length}
              </span>{" "}
              completed projects,{" "}
              <span className="font-semibold text-emerald-300">
                {Object.keys(data.checklists).reduce(
                  (acc, key) => acc + data.checklists[key].length,
                  0
                )}
              </span>{" "}
              checklist items
            </div>
            <div className="rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 px-4 py-3 text-sm text-emerald-100 shadow-lg">
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
              className="group rounded-xl border border-emerald-500/30 bg-black/20 backdrop-blur-sm transition-all hover:border-emerald-400/50"
            >
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold capitalize text-emerald-200 transition hover:text-emerald-300 flex items-center justify-between">
                <span>{category}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                  {data.checklists[category].filter((i) => i.done).length}/
                  {data.checklists[category].length}
                </span>
              </summary>
              <ul className="space-y-2 px-4 pb-4">
                {data.checklists[category].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 group/item">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleChecklistItem(category, idx)}
                      className="h-4 w-4 rounded accent-emerald-500 transition cursor-pointer"
                    />
                    <span
                      className={`text-xs transition ${
                        item.done
                          ? "text-emerald-400/50 line-through"
                          : "text-emerald-100 group-hover/item:text-emerald-200"
                      }`}
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
      <section className="rounded-2xl border border-[#2F6B60]/40 bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] p-6 shadow-xl backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
            🎯 Portfolio & Proof Builder
          </h2>
        </div>

        {/* Study-based recommendations */}
        {suggestedProjects.length > 0 && (
          <div className="mb-5 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 px-4 py-3">
            <div className="text-sm font-bold text-yellow-200 mb-2">
              💡 Based on your completed studies:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedProjects.map((item) => (
                <span
                  key={item.tech}
                  className="rounded-full bg-yellow-500/20 border border-yellow-400/30 px-3 py-1 text-xs font-medium text-yellow-300"
                >
                  Build a {item.tech} project!
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-5 rounded-xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-400/30 px-4 py-3 text-sm text-teal-100">
          <span className="font-bold text-teal-200">
            {portfolioProjects.length}
          </span>{" "}
          projects completed • Synced from your Projects page
        </div>

        {portfolioProjects.length === 0 ? (
          <div className="rounded-xl border border-emerald-500/20 bg-black/20 p-12 text-center backdrop-blur-sm">
            <div className="text-4xl mb-4">📦</div>
            <div className="text-sm text-emerald-200/70">
              No completed projects yet. Mark projects as complete on your
              Projects page to see them here.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolioProjects.map((project) => (
              <article
                key={project.id}
                className={`group relative overflow-hidden rounded-xl border p-4 backdrop-blur-sm shadow-lg transition ${
                  project.isRecommended
                    ? "border-yellow-400/50 bg-gradient-to-br from-yellow-600/10 to-orange-600/10 ring-2 ring-yellow-400/20"
                    : "border-teal-500/30 bg-gradient-to-br from-[#0F766E]/20 to-black/40 hover:border-teal-400/60"
                } hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]`}
              >
                {project.isRecommended && (
                  <div className="absolute top-2 right-2 rounded-lg bg-yellow-500/90 px-2 py-1 text-xs font-bold text-black">
                    ⭐ Study Complete!
                  </div>
                )}

                <h3 className="mb-3 font-bold text-emerald-100 line-clamp-2 pr-20">
                  {project.name}
                </h3>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {project.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-xs font-medium text-emerald-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {project.completionDate && (
                  <div className="mb-3 text-xs text-teal-200/60">
                    ✓ Completed:{" "}
                    {project.completionDate.split("-").reverse().join("-")}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    "github",
                    "live",
                    "caseStudy",
                    "readme",
                    "mobile",
                    "accessibility",
                  ].map((field) => {
                    const labels = {
                      github: "GitHub",
                      live: "Live",
                      caseStudy: "Case Study",
                      readme: "README",
                      mobile: "Mobile",
                      accessibility: "A11y",
                    };
                    return (
                      <label
                        key={field}
                        className="flex items-center gap-2 cursor-pointer group/checkbox"
                      >
                        <input
                          type="checkbox"
                          checked={project[field] || false}
                          onChange={() => toggleProjectField(project.id, field)}
                          className="h-3.5 w-3.5 rounded accent-emerald-500 cursor-pointer"
                        />
                        <span
                          className={`transition ${
                            project[field]
                              ? "text-emerald-300 font-medium"
                              : "text-teal-200/50 group-hover/checkbox:text-teal-200/70"
                          }`}
                        >
                          {labels[field]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: Daily Discipline Score - Keep existing code */}
      <section className="rounded-2xl border border-[#2F6B60]/40 bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] p-6 shadow-xl backdrop-blur-md">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold tracking-wide bg-gradient-to-r from-orange-300 via-red-200 to-pink-300 bg-clip-text text-transparent">
          🔥 Daily Discipline Score
        </h2>

        <div className="mb-6 flex items-center justify-between rounded-2xl border border-orange-500/30 bg-black/30 p-6 backdrop-blur-sm">
          <div>
            <div className="text-5xl font-black bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
              {todayScore}
              <span className="text-2xl text-orange-200/50">/100</span>
            </div>
            <div className="mt-2 text-xs text-orange-200/60 font-medium">
              Today's Score •{" "}
              {new Date(today).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-orange-200">
              {weeklyAverage}
            </div>
            <div className="mt-2 text-xs text-orange-200/60">7-Day Avg</div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {["gym", "coding", "english", "portfolio", "sleep"].map((habit) => {
            const isChecked = data.dds[today]?.[habit] || false;
            const points = {
              gym: 20,
              coding: 30,
              english: 20,
              portfolio: 20,
              sleep: 10,
            };
            const icons = {
              gym: "💪",
              coding: "💻",
              english: "🗣️",
              portfolio: "🎨",
              sleep: "😴",
            };

            return (
              <label
                key={habit}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                  isChecked
                    ? "border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105"
                    : "border-emerald-500/20 bg-black/20 hover:border-emerald-400/50 hover:bg-emerald-500/10"
                }`}
              >
                <div className="text-2xl">{icons[habit]}</div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleHabit(habit)}
                  className="h-5 w-5 rounded accent-emerald-500"
                />
                <span className="text-xs font-bold capitalize text-emerald-100">
                  {habit}
                </span>
                <span
                  className={`text-xs font-medium ${
                    isChecked ? "text-emerald-300" : "text-emerald-200/50"
                  }`}
                >
                  {points[habit]} pts
                </span>
              </label>
            );
          })}
        </div>

        {/* Weekly Trend */}
        <div className="mb-5 rounded-xl border border-emerald-500/30 bg-black/20 p-5 backdrop-blur-sm">
          <div className="mb-4 text-xs font-bold uppercase tracking-wider text-emerald-200/70">
            Last 7 Days
          </div>
          <div className="flex items-end justify-between gap-2">
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
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      score >= 80
                        ? "bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                        : score >= 65
                        ? "bg-gradient-to-t from-yellow-500 to-yellow-400"
                        : score > 0
                        ? "bg-gradient-to-t from-red-500 to-red-400"
                        : "bg-gray-700/50"
                    }`}
                    style={{ height: `${Math.max(score * 1.2, 12)}px` }}
                  ></div>
                  <div
                    className={`text-xs font-medium transition ${
                      isToday
                        ? "text-emerald-300 font-bold scale-110"
                        : "text-emerald-200/60"
                    }`}
                  >
                    {d.toLocaleDateString("en-US", { weekday: "short" })[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 px-4 py-3 text-sm text-orange-100">
          💡 <span className="font-semibold">{getInsightMessage()}</span>
        </div>
      </section>
    </div>
  );
}
