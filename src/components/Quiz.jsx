import { Link } from "react-router-dom";
import Quotes from "./Quotes.jsx";

export default function Dashboard() {
  const cards = [
    { to: "/planner", title: "Planner", desc: "Drag tasks into your day" },
    {
      to: "/calendar",
      title: "Calendar",
      desc: "Mark Gym/Coding and track streaks",
    },
    { to: "/syllabus", title: "Syllabus", desc: "MERN + DSA with deadlines" },
    { to: "/bmi", title: "BMI", desc: "Track weight quickly" },
    { to: "/calories", title: "Calories", desc: "Log calories & weight" },
    { to: "/stats", title: "Stats", desc: "Graphs for streaks & progress" },
    { to: "/focus", title: "Focus", desc: "Pomodoro timer" },
    { to: "/gallery", title: "Photos", desc: "Captions and before/after" },
    { to: "/quiz", title: "Quiz", desc: "Practice quick JS/DSA" },
  ];
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome 👋</h1>
        <p className="opacity-80">Discipline today, results tomorrow.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="border rounded-2xl p-4 hover:shadow"
          >
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm opacity-70">{c.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10">
        <Quotes compact />
      </div>
    </div>
  );
}
