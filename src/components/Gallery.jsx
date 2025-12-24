import { useState } from "react";
import { load, save } from "../utils/localStorage.js";

const STORAGE_KEY = "wd_imgs_v2";

export default function Gallery() {
  const [items, setItems] = useState(() => load(STORAGE_KEY, []));
  const [before, setBefore] = useState(null);
  const [after, setAfter] = useState(null);
  const [slider, setSlider] = useState(50);

  const persist = (next) => {
    setItems(next);
    save(STORAGE_KEY, next);
  };

  const onSelect = async (e, category) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const reads = await Promise.all(
      files.map(
        (f) =>
          new Promise((res) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.readAsDataURL(f);
          })
      )
    );

    const today = new Date().toISOString().slice(0, 10);

    const newItems = reads.map((src) => ({
      id: crypto.randomUUID(),
      src,
      caption: "",
      category,
      date: today,
    }));

    persist([...items, ...newItems]);
  };

  const updateCaption = (id, cap) => {
    const next = items.map((it) =>
      it.id === id ? { ...it, caption: cap } : it
    );
    persist(next);
  };

  const deleteItem = (id) => {
    const next = items.filter((it) => it.id !== id);
    persist(next);
  };

  const clearAll = () => {
    if (window.confirm("Delete all photos? This cannot be undone.")) {
      persist([]);
    }
  };

  const handleFileToState = (e, setter) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setter(r.result);
    r.readAsDataURL(f);
  };

  return (
    <div className="space-y-8 md:mt-10 lg:mt-0">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex flex-wrap gap-3">
          <label
            className="group relative inline-flex items-center gap-2 rounded-xl border-2 border-emerald-500/30 
                          bg-gradient-to-br from-emerald-600/20 to-teal-600/20
                          dark:from-emerald-600/10 dark:to-teal-600/10
                          px-4 py-2.5 text-sm font-semibold text-emerald-100 
                          cursor-pointer hover:border-emerald-400/50 
                          hover:bg-gradient-to-br hover:from-emerald-600/30 hover:to-teal-600/30
                          hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]
                          transition-all duration-300
                          backdrop-blur-sm
                          hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
              💪
            </span>
            <span>Upload Gym Photos</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => onSelect(e, "Gym")}
            />
            {/* Glow effect */}
            <div
              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-emerald-400/0 to-teal-400/0 
                          group-hover:from-emerald-400/20 group-hover:to-teal-400/20 blur-xl transition-all duration-300"
            />
          </label>

          <label
            className="group relative inline-flex items-center gap-2 rounded-xl border-2 border-cyan-500/30 
                          bg-gradient-to-br from-cyan-600/20 to-blue-600/20
                          dark:from-cyan-600/10 dark:to-blue-600/10
                          px-4 py-2.5 text-sm font-semibold text-cyan-100 
                          cursor-pointer hover:border-cyan-400/50 
                          hover:bg-gradient-to-br hover:from-cyan-600/30 hover:to-blue-600/30
                          hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]
                          transition-all duration-300
                          backdrop-blur-sm
                          hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
              💻
            </span>
            <span>Upload Coding Shots</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => onSelect(e, "Coding")}
            />
            {/* Glow effect */}
            <div
              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-cyan-400/0 to-blue-400/0 
                          group-hover:from-cyan-400/20 group-hover:to-blue-400/20 blur-xl transition-all duration-300"
            />
          </label>
        </div>

        <button
          onClick={clearAll}
          className="group relative rounded-xl border-2 border-red-500/30 
                   bg-gradient-to-br from-red-600/20 to-orange-600/20
                   dark:from-red-600/10 dark:to-orange-600/10
                   px-4 py-2.5 text-sm font-semibold text-red-300 
                   hover:border-red-400/50 hover:text-red-200
                   hover:bg-gradient-to-br hover:from-red-600/30 hover:to-orange-600/30
                   hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]
                   transition-all duration-300
                   backdrop-blur-sm
                   hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <span className="group-hover:rotate-12 transition-transform">
              🗑️
            </span>
            <span>Clear All</span>
          </span>
          {/* Glow effect */}
          <div
            className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-red-400/0 to-orange-400/0 
                        group-hover:from-red-400/20 group-hover:to-orange-400/20 blur-xl transition-all duration-300"
          />
        </button>
      </div>

      {/* Gallery */}
      <section
        className="rounded-2xl border border-emerald-500/30 
                        bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0F0F0F]
                        dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
                        p-6 shadow-xl backdrop-blur-md"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-wide bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              📸 Photo Gallery
            </h2>
            <p className="mt-1 text-xs text-emerald-200/60">
              Visual progress tracker
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 text-sm font-bold text-emerald-300">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-emerald-500/30 bg-black/20 backdrop-blur-sm">
            <div className="text-5xl mb-3 opacity-50">📷</div>
            <p className="text-sm text-emerald-200/70 font-medium">
              No photos yet
            </p>
            <p className="text-xs text-emerald-200/50 mt-1">
              Upload your first shot to track progress
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((it) => (
              <article
                key={it.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-emerald-500/30 
                         bg-gradient-to-br from-[#0F766E]/20 to-black/40 
                         backdrop-blur-sm shadow-lg 
                         hover:border-emerald-400/50 
                         hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]
                         transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={it.src}
                    alt={it.caption || `${it.category} photo`}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <button
                    onClick={() => deleteItem(it.id)}
                    className="absolute right-2 top-2 rounded-lg bg-red-500/90 backdrop-blur-sm 
                             px-3 py-1.5 text-xs font-bold text-white
                             opacity-0 shadow-lg
                             hover:bg-red-600 hover:scale-110
                             group-hover:opacity-100 transition-all duration-200"
                  >
                    Delete
                  </button>

                  {/* Category badge */}
                  <div
                    className="absolute left-2 top-2 rounded-lg 
                                bg-gradient-to-r from-emerald-500/90 to-teal-500/90
                                backdrop-blur-sm border border-emerald-400/30
                                px-2.5 py-1 text-xs font-bold text-white shadow-lg"
                  >
                    {it.category === "Gym" ? "💪" : "💻"} {it.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-3 text-xs">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-emerald-200/60">
                    <span className="font-medium">
                      📅{" "}
                      {new Date(it.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <input
                    className="w-full rounded-lg border border-emerald-500/30 
                             bg-black/30 backdrop-blur-sm
                             px-3 py-2 text-sm text-emerald-100 
                             placeholder-emerald-300/40
                             focus:border-emerald-400 focus:outline-none 
                             focus:ring-2 focus:ring-emerald-400/50
                             transition-all"
                    placeholder="Add a caption..."
                    value={it.caption}
                    onChange={(e) => updateCaption(it.id, e.target.value)}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Before / After */}
      <section
        className="rounded-2xl border border-orange-500/30 
                        bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
                        dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
                        p-6 shadow-xl backdrop-blur-md"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold tracking-wide bg-gradient-to-r from-orange-300 via-red-200 to-pink-300 bg-clip-text text-transparent">
            ⚡ Before / After Comparison
          </h3>
          <p className="mt-2 text-sm text-orange-200/70">
            Compare your transformation with an interactive slider
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label
            className="group relative inline-flex cursor-pointer items-center gap-2 
                          rounded-xl border-2 border-blue-500/30 
                          bg-gradient-to-br from-blue-600/20 to-cyan-600/20
                          dark:from-blue-600/10 dark:to-cyan-600/10
                          px-4 py-2.5 text-sm font-semibold text-blue-100 
                          hover:border-blue-400/50 
                          hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]
                          transition-all duration-300
                          backdrop-blur-sm
                          hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-base group-hover:scale-110 transition-transform">
              📷
            </span>
            <span>Upload Before</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileToState(e, setBefore)}
            />
            <div
              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-blue-400/0 to-cyan-400/0 
                          group-hover:from-blue-400/20 group-hover:to-cyan-400/20 blur-xl transition-all duration-300"
            />
          </label>

          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-orange-500/50 to-red-500/50" />
            <span className="text-sm font-bold text-orange-300">VS</span>
            <div className="h-px w-8 bg-gradient-to-r from-red-500/50 to-orange-500/50" />
          </div>

          <label
            className="group relative inline-flex cursor-pointer items-center gap-2 
                          rounded-xl border-2 border-green-500/30 
                          bg-gradient-to-br from-green-600/20 to-emerald-600/20
                          dark:from-green-600/10 dark:to-emerald-600/10
                          px-4 py-2.5 text-sm font-semibold text-green-100 
                          hover:border-green-400/50 
                          hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]
                          transition-all duration-300
                          backdrop-blur-sm
                          hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-base group-hover:scale-110 transition-transform">
              ✨
            </span>
            <span>Upload After</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileToState(e, setAfter)}
            />
            <div
              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-green-400/0 to-emerald-400/0 
                          group-hover:from-green-400/20 group-hover:to-emerald-400/20 blur-xl transition-all duration-300"
            />
          </label>
        </div>

        {before && after ? (
          <div className="mx-auto mt-4 flex max-w-3xl flex-col gap-5">
            <div
              className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-emerald-500/30 
                          bg-black shadow-2xl shadow-emerald-500/10"
            >
              {/* Before image */}
              <img
                src={before}
                alt="Before"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* After image with clip */}
              <div
                className="absolute inset-0 overflow-hidden transition-all duration-75"
                style={{ width: slider + "%" }}
              >
                <img
                  src={after}
                  alt="After"
                  className="h-full w-full object-cover"
                  style={{ width: "calc(100vw)" }}
                />
              </div>

              {/* Slider handle */}
              <div
                className="pointer-events-none absolute inset-y-0 z-10"
                style={{ left: `${slider}%` }}
              >
                <div className="relative flex h-full items-center -ml-1">
                  {/* Line */}
                  <div className="h-full w-1 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]" />

                  {/* Handle circle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -ml-5 
                                flex h-10 w-10 items-center justify-center 
                                rounded-full border-3 border-white 
                                bg-gradient-to-br from-emerald-500 to-teal-500
                                shadow-[0_0_25px_rgba(16,185,129,0.8)] 
                                text-sm font-bold text-white"
                  >
                    ⚡
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 rounded-lg bg-blue-500/90 backdrop-blur-sm border border-blue-400/50 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                📷 BEFORE
              </div>
              <div className="absolute top-4 right-4 rounded-lg bg-green-500/90 backdrop-blur-sm border border-green-400/50 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                ✨ AFTER
              </div>
            </div>

            {/* Custom slider */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer
                         bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-5
                         [&::-webkit-slider-thumb]:h-5
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-gradient-to-br
                         [&::-webkit-slider-thumb]:from-emerald-400
                         [&::-webkit-slider-thumb]:to-teal-500
                         [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(16,185,129,0.6)]
                         [&::-webkit-slider-thumb]:border-2
                         [&::-webkit-slider-thumb]:border-white
                         [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:transition-transform
                         [&::-webkit-slider-thumb]:hover:scale-125"
              />
              <div className="mt-2 flex justify-between text-xs text-emerald-200/60">
                <span>← Drag to compare</span>
                <span className="font-bold text-emerald-300">{slider}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-orange-500/30 bg-black/20 backdrop-blur-sm">
            <div className="text-6xl mb-4 opacity-50">⚡</div>
            <p className="text-base font-semibold text-orange-200">
              Ready for transformation?
            </p>
            <p className="text-sm text-orange-200/60 mt-2">
              Upload before and after images to visualize your progress
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
