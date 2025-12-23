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
          }),
      ),
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
      it.id === id ? { ...it, caption: cap } : it,
    );
    persist(next);
  };

  const deleteItem = (id) => {
    const next = items.filter((it) => it.id !== id);
    persist(next);
  };

  const clearAll = () => {
    persist([]);
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
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900 px-3 py-2 text-sm text-slate-100 cursor-pointer hover:border-indigo-500 hover:bg-slate-900/80 transition">
            <span>Upload Gym Photos</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => onSelect(e, "Gym")}
            />
          </label>

          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900 px-3 py-2 text-sm text-slate-100 cursor-pointer hover:border-indigo-500 hover:bg-slate-900/80 transition">
            <span>Upload Coding Shots</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => onSelect(e, "Coding")}
            />
          </label>
        </div>

        <button
          onClick={clearAll}
          className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 transition"
        >
          Clear all
        </button>
      </div>

      {/* Gallery */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Photo gallery
          </h2>
          <span className="text-xs text-slate-500">{items.length} items</span>
        </div>

        {items.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-slate-500">
            No photos yet. Upload your first **shot** to track progress.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((it) => (
              <article
                key={it.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 shadow-sm"
              >
                <div className="relative">
                  <img
                    src={it.src}
                    alt={it.caption || `${it.category} photo`}
                    className="h-40 w-full object-cover transition group-hover:scale-[1.02]"
                  />
                  <button
                    onClick={() => deleteItem(it.id)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-red-300 opacity-0 shadow-sm backdrop-blur group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-2.5 text-xs">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                      {it.category}
                    </span>
                    <span>{it.date}</span>
                  </div>

                  <input
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Before / After
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Compare **progress** with an interactive slider.
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900 px-3 py-2 text-xs text-slate-100 hover:border-indigo-500 transition">
            <span>Upload Before</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileToState(e, setBefore)}
            />
          </label>

          <span className="text-xs text-slate-500">vs</span>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900 px-3 py-2 text-xs text-slate-100 hover:border-indigo-500 transition">
            <span>Upload After</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileToState(e, setAfter)}
            />
          </label>
        </div>

        {before && after ? (
          <div className="mx-auto mt-2 flex max-w-2xl flex-col gap-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <img
                src={before}
                alt="Before"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: slider + "%" }}
              >
                <img
                  src={after}
                  alt="After"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Slider handle line */}
              <div
                className="pointer-events-none absolute inset-y-0"
                style={{ left: `calc(${slider}% - 1px)` }}
              >
                <div className="flex h-full items-center">
                  <div className="h-full w-[2px] bg-white/70 shadow" />
                  <div className="ml-[-10px] flex h-6 w-6 items-center justify-center rounded-full border border-slate-900 bg-white text-[10px] font-semibold text-slate-900 shadow">
                    ||
                  </div>
                </div>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-500">
            Add before and after images to see your visual **transformation**.
          </p>
        )}
      </section>
    </div>
  );
}
