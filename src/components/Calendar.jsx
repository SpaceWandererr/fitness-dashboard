import { useState, useMemo, useEffect } from 'react'
import dayjs from 'dayjs'
import { load, save } from '../utils/localStorage.js'

export default function Calendar() {
  const [month, setMonth] = useState(dayjs())
  const key = 'wd_calendar_' + month.format('YYYY_MM')
  const [marks, setMarks] = useState(() => load(key, {}))

  useEffect(() => {
    // update global streak store when month marks change
    const all = load('wd_done', {})
    const next = { ...all, ...marks }
    save('wd_done', next)
  }, [marks])

  const days = useMemo(() => {
    const start = month.startOf('month').startOf('week')
    return Array.from({ length: 42 }, (_, i) => start.add(i, 'day'))
  }, [month])

  const toggle = (d) => {
    const f = d.format('YYYY-MM-DD')
    const next = { ...marks, [f]: !marks[f] }
    setMarks(next)
    save(key, next)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button className="border rounded px-2 py-1" onClick={() => setMonth(m => m.subtract(1, 'month'))}>Prev</button>
        <h2 className="text-xl font-semibold">{month.format('MMMM YYYY')}</h2>
        <button className="border rounded px-2 py-1" onClick={() => setMonth(m => m.add(1, 'month'))}>Next</button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center text-sm opacity-70">{d}</div>)}
        {days.map(d => {
          const isCur = d.month() === month.month()
          const f = d.format('YYYY-MM-DD')
          const done = !!marks[f]
          return (
            <button key={f} onClick={() => toggle(d)}
              className={"aspect-square rounded-xl border flex items-center justify-center " + 
                (isCur ? "" : "opacity-40 ") + (done ? "bg-green-200 dark:bg-green-800" : "hover:bg-gray-100 dark:hover:bg-gray-800")}>
              {d.date()}
            </button>
          )
        })}
      </div>
      <p className="mt-4 text-sm opacity-70">Tap a date to mark Gym or Coding done. Streaks and stats auto-update.</p>
    </div>
  )
}
