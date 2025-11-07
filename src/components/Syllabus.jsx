// Syllabus.jsx — Mirror + Tracker + Section tick + CompletedOn + Progress bars
import { useEffect, useMemo, useState } from "react";

/* =========== storage helpers =========== */
const load = (k, f) => {
  try {
    const x = localStorage.getItem(k);
    return x ? JSON.parse(x) : f;
  } catch {
    return f;
  }
};
const save = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

/* =========== defaults (kept) + my extra section =========== */
const defaults = {
  "🌐 Episode 1 — Code": [
    {
      title: "How the Internet Works",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title: "DNS / IP / Client-Server",
      done: false,
      deadline: "",
      completedOn: "",
    },
  ],
  "🎭 Episode 2 — Stage (HTML/CSS/JS Core)": [
    {
      title: "HTML structure + semantics",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title: "CSS layout: Flex + Grid",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title: "JS fundamentals + DOM + Fetch",
      done: false,
      deadline: "",
      completedOn: "",
    },
  ],
  "⚛️ Episode 3 — Commit (React)": [
    {
      title: "Components, props, state, hooks",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title: "Routing + forms + data fetching",
      done: false,
      deadline: "",
      completedOn: "",
    },
  ],
  "🧩 Episode 4 — Push (Node · Express · DB)": [
    {
      title: "Express routes + middleware",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title: "MongoDB + Mongoose basics",
      done: false,
      deadline: "",
      completedOn: "",
    },
  ],
  "🚀 Episode 5 — Merge (GenAI · PWA · Microservices · Next.js · Deploy)": [
    {
      title: "PWA + Service Worker",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title: "Next.js routing + deploy",
      done: false,
      deadline: "",
      completedOn: "",
    },
  ],
  "🧠 DSA with JavaScript": [
    {
      title: "Arrays + Strings patterns",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title: "Sorting + Two pointers + Hashing",
      done: false,
      deadline: "",
      completedOn: "",
    },
  ],
  "📊 Aptitude & Reasoning (AR)": [
    {
      title: "Percentages, Profit & Loss",
      done: false,
      deadline: "",
      completedOn: "",
    },
  ],
  "🧭 Logical Reasoning (LR)": [
    {
      title: "Direction sense + Syllogism",
      done: false,
      deadline: "",
      completedOn: "",
    },
  ],
  "📚 Verbal Reasoning (VR)": [
    {
      title: "Sentence ordering + Errors",
      done: false,
      deadline: "",
      completedOn: "",
    },
  ],
  "✨ Coach’s Picks — High-Impact Practice": [
    {
      title: "Build a Pixel-perfect Landing Page from a Dribbble shot",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title: "React + API mini app: Search + Pagination + Debounce",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title: "Auth flow (JWT) with Node/Express + Mongo: Login/Signup/Protect",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title: "PWA-ify your dashboard (offline + installable)",
      done: false,
      deadline: "",
      completedOn: "",
    },
    {
      title:
        "Deploy full-stack demo (API + Client) and set up CI on GitHub Actions",
      done: false,
      deadline: "",
      completedOn: "",
    },
  ],
};

/* =========== constants =========== */
const HTML_PATH = "/syllabus.html"; // Notion export here
const TODAY = () => new Date().toISOString().slice(0, 10);
const VERSION = 2;

export default function Syllabus() {
  const [mode, setMode] = useState(() => load("wd_mode", "mirror")); // mirror | tracker
  const [query, setQuery] = useState("");

  /* =========== Mirror Mode state =========== */
  const [html, setHtml] = useState("");
  const [htmlLoaded, setHtmlLoaded] = useState(false);
  const [mirrorProgress, setMirrorProgress] = useState({
    done: 0,
    total: 0,
    percent: 0,
  });

  /* =========== Tracker Mode state =========== */
  const [syllabus, setSyllabus] = useState(() => load("wd_syllabus", defaults));
  const [builtFromHTML, setBuiltFromHTML] = useState(() =>
    load("wd_tracker_built", false)
  );
  // default collapsed: if nothing saved, we start with ALL collapsed
  const [collapsed, setCollapsed] = useState(() => {
    const saved = load("wd_collapsed", null);
    if (saved) return saved;
    const init = {};
    for (const k of Object.keys(syllabus)) init[k] = true;
    return init;
  });
  const [editing, setEditing] = useState(null);

  /* =========== persistence =========== */
  useEffect(() => save("wd_mode", mode), [mode]);
  useEffect(() => save("wd_syllabus", syllabus), [syllabus]);
  useEffect(() => save("wd_collapsed", collapsed), [collapsed]);
  useEffect(() => save("wd_tracker_built", builtFromHTML), [builtFromHTML]);

  /* =========== Mirror: fetch HTML =========== */
  useEffect(() => {
    if (mode !== "mirror") return;
    fetch(HTML_PATH)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => {
        setHtml(t);
        setHtmlLoaded(true);
      })
      .catch(() => {
        setHtml(
          `<div class="p-4 text-sm">⚠️ Put your Notion export at <code>public/syllabus.html</code>.</div>`
        );
        setHtmlLoaded(true);
      });
  }, [mode]);

  /* =========== Mirror: enhance with checkboxes + dark mode styles =========== */
  useEffect(() => {
    if (mode !== "mirror" || !htmlLoaded) return;
    const root = document.getElementById("mirror-root");
    if (!root) return;

    // inject dark-mode aware styles (mirror stays full width)
    const styleId = "mirror-dark-style";
    if (!document.getElementById(styleId)) {
      const st = document.createElement("style");
      st.id = styleId;
      st.textContent = `
        .mirror article { line-height:1.6; width:100%; padding:1rem; }
        .dark .mirror article { color: rgba(229,231,235,0.95); }
        .mirror article { color: rgb(55,53,47); }
        .mirror a { text-decoration: underline; }
        .dark .mirror a { color: #9ecbff; }
        .mirror code { background:#f6f6f6; padding:.1rem .3rem; border-radius:4px }
        .dark .mirror code { background:#1f2937; color:#e5e7eb }
        .mirror ul{ padding-left:1.3rem; }
        .mirror li{ margin: .25rem 0; }
      `;
      document.head.appendChild(st);
    }

    // enhance list items with checkboxes, keep progress
    const t = setTimeout(() => {
      const items = Array.from(root.querySelectorAll("li"));
      items.forEach((li, idx) => {
        if (li.dataset.enhanced) return;
        li.dataset.enhanced = "1";
        const key = `wd_check_${hash(li.textContent || "")}_${idx}`;
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.style.marginRight = "8px";
        chk.checked = !!load(key, false);
        chk.addEventListener("change", () => {
          save(key, chk.checked);
          compute();
        });
        li.prepend(chk);
      });
      compute();
      function compute() {
        const all = root.querySelectorAll('li input[type="checkbox"]');
        const total = all.length;
        const done = [...all].filter((x) => x.checked).length;
        setMirrorProgress({
          done,
          total,
          percent: total ? Math.round((100 * done) / total) : 0,
        });
      }
    }, 10);
    return () => clearTimeout(t);
  }, [mode, htmlLoaded]);

  /* =========== Tracker: auto-build from Notion once =========== */
  useEffect(() => {
    if (mode !== "tracker" || builtFromHTML) return;
    fetch(HTML_PATH)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((html) => {
        const parsed = buildFromHTML(html);
        if (parsed && Object.keys(parsed).length) {
          setSyllabus(mergeKeepCompleted(defaults, parsed)); // keep defaults + add parsed
          setBuiltFromHTML(true);
        }
      })
      .catch(() => {});
  }, [mode, builtFromHTML]);

  /* =========== tracker helpers =========== */
  const sectionPercent = (list) =>
    Math.round((list.filter((x) => x.done).length / (list.length || 1)) * 100);
  const daysLeft = (ds) => {
    if (!ds) return null;
    const d = new Date(ds);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.ceil((d - now) / 86400000);
  };
  const isOverdue = (it) =>
    it.deadline && daysLeft(it.deadline) < 0 && !it.done;
  const deltaToDeadline = (it) => {
    if (!it.deadline || !it.completedOn) return null;
    const diff = Math.ceil(
      (new Date(it.deadline) - new Date(it.completedOn)) / 86400000
    );
    return diff; // positive means early, negative means late
  };
  const highlight = (text, q) => {
    if (!q) return text;
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark className="bg-yellow-200 rounded px-0.5">
          {text.slice(i, i + q.length)}
        </mark>
        {text.slice(i + q.length)}
      </>
    );
  };

  const toggleItem = (section, idx) => {
    const next = structuredClone(syllabus);
    const it = next[section][idx];
    it.done = !it.done;
    it.completedOn = it.done ? TODAY() : "";
    setSyllabus(next);
  };

  const clickRowToggle = (e, section, idx) => {
    // avoid toggling when interacting with inputs/links
    const tag = e.target.tagName.toLowerCase();
    if (["input", "button", "a", "label", "svg", "path"].includes(tag)) return;
    toggleItem(section, idx);
  };

  const toggleSection = (section) => {
    const next = structuredClone(syllabus);
    const allDone = next[section].every((i) => i.done);
    next[section] = next[section].map((i) => ({
      ...i,
      done: !allDone,
      completedOn: !allDone ? TODAY() : "",
    }));
    setSyllabus(next);
  };

  const addItem = (section, title, dl = "") => {
    const next = structuredClone(syllabus);
    if (!next[section]) next[section] = [];
    next[section].push({ title, done: false, deadline: dl, completedOn: "" });
    setSyllabus(next);
  };

  const setDeadline = (section, idx, dl) => {
    const next = structuredClone(syllabus);
    next[section][idx].deadline = dl;
    setSyllabus(next);
  };

  const removeItem = (section, idx) => {
    const next = structuredClone(syllabus);
    next[section].splice(idx, 1);
    setSyllabus(next);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(syllabus, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "syllabus-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data && typeof data === "object") setSyllabus(data);
      } catch {}
    };
    reader.readAsText(file);
  };

  const collapseAll = () => {
    const next = {};
    for (const k of Object.keys(syllabus)) next[k] = true;
    setCollapsed(next);
  };
  const expandAll = () => {
    const next = {};
    for (const k of Object.keys(syllabus)) next[k] = false;
    setCollapsed(next);
  };

  /* =========== derived for tracker =========== */
  const filtered = useMemo(() => {
    if (!query.trim()) return syllabus;
    const q = query.toLowerCase();
    const out = {};
    for (const sec of Object.keys(syllabus)) {
      out[sec] = syllabus[sec].filter((it) =>
        it.title.toLowerCase().includes(q)
      );
    }
    return out;
  }, [syllabus, query]);

  /* =========== small utils =========== */
  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }
  function mergeKeepCompleted(base, extra) {
    // merge sections; keep completed info if titles match
    const out = structuredClone(base);
    for (const sec of Object.keys(extra)) {
      if (!out[sec]) out[sec] = [];
      const map = new Map(out[sec].map((i) => [i.title, i]));
      for (const e of extra[sec]) {
        if (map.has(e.title)) continue;
        out[sec].push({ ...e, completedOn: e.completedOn || "" });
      }
    }
    return out;
  }

  /* =========== render =========== */
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold">Syllabus</h1>
          {mode === "mirror" ? (
            <span className="text-sm opacity-80">
              Mirror · {mirrorProgress.done}/{mirrorProgress.total} ·{" "}
              {mirrorProgress.percent}%
            </span>
          ) : (
            <span className="text-sm opacity-80">
              Tracker ·{" "}
              {
                Object.values(syllabus)
                  .flat()
                  .filter((x) => x.done).length
              }
              /{Object.values(syllabus).flat().length}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              setMode((m) => (m === "mirror" ? "tracker" : "mirror"))
            }
            className="px-3 py-2 rounded border"
          >
            {mode === "mirror" ? "Switch to Tracker" : "Switch to Mirror"}
          </button>

          {mode === "tracker" && (
            <>
              <button
                onClick={collapseAll}
                className="px-3 py-2 rounded border"
              >
                Collapse All
              </button>
              <button onClick={expandAll} className="px-3 py-2 rounded border">
                Expand All
              </button>
              <button
                onClick={() => {
                  fetch(HTML_PATH)
                    .then((r) => r.text())
                    .then((txt) => {
                      const parsed = buildFromHTML(txt);
                      if (parsed)
                        setSyllabus(mergeKeepCompleted(defaults, parsed));
                    });
                }}
                className="px-3 py-2 rounded border"
              >
                Rebuild from Notion
              </button>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="border rounded px-3 py-2 w-60"
              />
              <button onClick={exportJSON} className="px-3 py-2 rounded border">
                Export
              </button>
              <label className="px-3 py-2 rounded border cursor-pointer">
                Import
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && importJSON(e.target.files[0])
                  }
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* Mirror Mode */}
      {mode === "mirror" && (
        <div className="rounded-xl border overflow-hidden">
          <div className="mirror">
            <article
              id="mirror-root"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      )}

      {/* Tracker Mode */}
      {mode === "tracker" && (
        <div className="space-y-4">
          {Object.keys(filtered).map((section) => {
            const list = filtered[section] || [];
            if (!list.length) return null;
            const pct = sectionPercent(syllabus[section] || []);
            return (
              <details
                key={section}
                open={!collapsed[section]}
                className="group border rounded-xl bg-white dark:bg-gray-900"
              >
                <summary
                  className="cursor-pointer list-none px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                  onClick={(e) => {
                    // when clicking the right-side controls we don't toggle
                    if (e.target.closest(".sec-actions")) return;
                  }}
                >
                  <div
                    className="flex items-center gap-3"
                    onDoubleClick={() => toggleSection(section)}
                    title="Double-click to toggle entire section"
                  >
                    <span className="select-none text-lg">
                      {section.slice(0, 2)}
                    </span>
                    <h2 className="font-semibold">{section}</h2>
                  </div>
                  <div className="sec-actions flex items-center gap-3">
                    <span className="text-sm opacity-70">{pct}%</span>
                    <MiniBar value={pct} />
                    <button
                      className="px-2 py-1 text-xs rounded border"
                      onClick={() => toggleSection(section)}
                    >
                      {pct === 100 ? "Uncheck All" : "Check All"}
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded border"
                      onClick={() =>
                        setCollapsed((s) => ({ ...s, [section]: !s[section] }))
                      }
                    >
                      {collapsed[section] ? "Expand" : "Collapse"}
                    </button>
                  </div>
                </summary>

                <div className="px-4 pb-4 pt-2">
                  <ul className="mt-2 space-y-1">
                    {list.map((it, idx) => (
                      <li
                        key={idx}
                        className={`rounded-lg px-2 py-2 border hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                          isOverdue(it)
                            ? "border-red-400"
                            : "border-gray-200 dark:border-gray-800"
                        } ${it.done ? "opacity-70" : ""}`}
                        onClick={(e) => clickRowToggle(e, section, idx)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 scale-110"
                            checked={!!it.done}
                            onChange={() => toggleItem(section, idx)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`leading-snug ${
                                it.done ? "line-through" : ""
                              }`}
                            >
                              {highlight(it.title, query)}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs opacity-90">
                              <span className="px-2 py-0.5 rounded-full border">
                                Deadline
                              </span>
                              <input
                                type="date"
                                value={it.deadline || ""}
                                onChange={(e) =>
                                  setDeadline(section, idx, e.target.value)
                                }
                                className="border rounded px-2 py-1"
                                onClick={(e) => e.stopPropagation()}
                              />
                              {it.deadline && (
                                <span
                                  className={`px-2 py-0.5 rounded-full ${
                                    daysLeft(it.deadline) < 0
                                      ? "bg-red-100 text-red-700 border border-red-200"
                                      : "bg-gray-100 text-gray-700 border border-gray-200"
                                  }`}
                                >
                                  {daysLeft(it.deadline) < 0
                                    ? `${Math.abs(
                                        daysLeft(it.deadline)
                                      )} days overdue`
                                    : `${daysLeft(it.deadline)} days left`}
                                </span>
                              )}
                              {it.completedOn && (
                                <span className="px-2 py-0.5 rounded-full border bg-green-50 dark:bg-green-900/20">
                                  Completed on {it.completedOn}
                                </span>
                              )}
                              {it.completedOn &&
                                it.deadline != null &&
                                it.deadline !== "" && (
                                  <DeadlineDeltaPill
                                    diff={deltaToDeadline(it)}
                                  />
                                )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              className="text-xs px-2 py-1 rounded border"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeItem(section, idx);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <NewItem onAdd={(t, dl) => addItem(section, t, dl)} />
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========== tiny components =========== */
function MiniBar({ value = 0 }) {
  return (
    <div className="w-28 h-2 bg-gray-200 dark:bg-gray-800 rounded">
      <div
        className="h-2 rounded bg-[hsl(var(--accent))]"
        style={{ width: value + "%" }}
      />
    </div>
  );
}

function DeadlineDeltaPill({ diff }) {
  if (diff == null) return null;
  if (diff > 0) {
    return (
      <span className="px-2 py-0.5 rounded-full border bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
        {diff} days early
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span className="px-2 py-0.5 rounded-full border bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">
        {Math.abs(diff)} days late
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full border bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
      On time
    </span>
  );
}

function NewItem({ onAdd }) {
  const [t, setT] = useState("");
  const [dl, setDl] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (t.trim()) {
          onAdd(t.trim(), dl);
          setT("");
          setDl("");
        }
      }}
      className="flex gap-2 mt-3"
    >
      <input
        className="flex-1 border rounded p-2"
        value={t}
        onChange={(e) => setT(e.target.value)}
        placeholder="Add topic…"
      />
      <input
        type="date"
        className="border rounded px-2"
        value={dl}
        onChange={(e) => setDl(e.target.value)}
      />
      <button className="px-3 rounded bg-[hsl(var(--accent))] text-white">
        Add
      </button>
    </form>
  );
}

/* =========== parser: Notion HTML -> sections/items =========== */
function buildFromHTML(html) {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const out = {};
    let current = "General";

    const nodes = Array.from(doc.body.querySelectorAll("h1, h2, h3, ul"));
    for (const n of nodes) {
      if (n.tagName === "H1" || n.tagName === "H2") {
        const t = (n.textContent || "").trim();
        if (t) {
          current = t;
          if (!out[current]) out[current] = [];
        }
      } else if (n.tagName === "H3") {
        const sub = (n.textContent || "").trim();
        if (sub) {
          if (!out[current]) out[current] = [];
          out[current].push({
            title: `— ${sub}`,
            done: false,
            deadline: "",
            completedOn: "",
          });
        }
      } else if (n.tagName === "UL") {
        const lis = Array.from(n.querySelectorAll(":scope > li"));
        for (const li of lis) {
          const text = (li.textContent || "").replace(/\s+/g, " ").trim();
          if (text) {
            if (!out[current]) out[current] = [];
            out[current].push({
              title: text,
              done: false,
              deadline: "",
              completedOn: "",
            });
          }
        }
      }
    }
    return out;
  } catch {
    return null;
  }
}
