import { useEffect, useState } from 'react'
import { load, save } from '../utils/localStorage.js'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export default function Calories(){
  const [rows, setRows] = useState(() => load('wd_calories', []))
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [cal, setCal] = useState(2000)
  const [wt, setWt] = useState(78)
  const [codingHrs, setCodingHrs] = useState(2)

  useEffect(()=>save('wd_calories', rows), [rows])
  useEffect(()=>save('wd_coding_hours', rows.map(r=>({ date:r.date, hours:r.hours||0 }))), [rows])

  const add = () => {
    const next = [...rows.filter(r=>r.date!==date), { date, calories: +cal, weight: +wt, hours: +codingHrs }].sort((a,b)=>a.date.localeCompare(b.date))
    setRows(next)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="border rounded-2xl p-4">
        <h3 className="font-semibold mb-3">Log Today</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">Date <input type="date" className="w-full border rounded p-2" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label className="text-sm">Calories <input type="number" className="w-full border rounded p-2" value={cal} onChange={e=>setCal(e.target.value)} /></label>
          <label className="text-sm">Weight (kg) <input type="number" className="w-full border rounded p-2" value={wt} onChange={e=>setWt(e.target.value)} /></label>
          <label className="text-sm">Coding Hours <input type="number" className="w-full border rounded p-2" value={codingHrs} onChange={e=>setCodingHrs(e.target.value)} /></label>
        </div>
        <button onClick={add} className="mt-3 px-3 py-2 rounded bg-[hsl(var(--accent))] text-white">Save</button>
        <ul className="mt-4 max-h-64 overflow-auto scrollbar-thin text-sm">
          {rows.slice().reverse().map((r, i)=> (
            <li key={i} className="flex items-center justify-between border-b py-2">
              <span>{r.date}</span>
              <span>{r.calories} kcal</span>
              <span>{r.weight} kg</span>
              <span>{r.hours||0} h</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border rounded-2xl p-4">
        <h3 className="font-semibold mb-3">Weight Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={rows}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="weight" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-2xl p-4 lg:col-span-2">
        <h3 className="font-semibold mb-3">Calories Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={rows}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calories" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
