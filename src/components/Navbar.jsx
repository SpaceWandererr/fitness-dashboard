import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar({ links, dark, setDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleLinks, setVisibleLinks] = useState(links);
  const [hiddenLinks, setHiddenLinks] = useState([]);
  const containerRef = useRef(null);
  const linksRef = useRef([]);

  // Detect overflow and hide extra links
  useEffect(() => {
    const updateLinks = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth - 200; // reserve space for buttons
      let totalWidth = 0;
      const newVisible = [];
      const newHidden = [];

      linksRef.current.forEach((el, i) => {
        if (!el) return;
        totalWidth += el.offsetWidth + 24; // +gap
        if (totalWidth < containerWidth) newVisible.push(links[i]);
        else newHidden.push(links[i]);
      });

      setVisibleLinks(newVisible);
      setHiddenLinks(newHidden);
    };

    updateLinks();
    window.addEventListener("resize", updateLinks);
    return () => window.removeEventListener("resize", updateLinks);
  }, [links]);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#121212]/70 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl flex items-center justify-between p-3 gap-2">
        {/* Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)} className="select-none">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-400 tracking-tight whitespace-nowrap hover:tracking-wider transition-all duration-300">
            JAY&nbsp;SINH&nbsp;THAKUR
          </h1>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto" ref={containerRef}>
          {/* Dynamic Nav Links */}
          <div className="hidden md:flex items-center gap-3 overflow-hidden">
            {visibleLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                ref={(el) => (linksRef.current[i] = el)}
                className={`text-sm ${
                  location.pathname === link.to
                    ? "text-emerald-400"
                    : "text-gray-300 hover:text-emerald-300"
                } transition-colors`}
              >
                {link.label}
              </Link>
            ))}

            {/* Extra hidden ones collapsed into dropdown */}
            {hiddenLinks.length > 0 && (
              <div className="relative group">
                <button className="text-gray-300 hover:text-emerald-300">
                  ⋯
                </button>
                <div className="absolute right-0 mt-2 hidden group-hover:block bg-[#1a1a1a]/90 backdrop-blur-md rounded-lg border border-emerald-800/40 p-2 shadow-lg">
                  {hiddenLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-3 py-1 text-sm text-gray-300 hover:text-emerald-300"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
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
                    : "hover:bg-gray-700/60 text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
