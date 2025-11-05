import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { load, save } from '../utils/localStorage.js'

const defaultTasks = ['Gym: Push', 'Gym: Pull', 'Gym: Legs', 'Code: JS 2h', 'DSA Practice', 'React Project', 'Meal Prep', 'Walk 8k steps']

export default function Planner() {
  const [tasks, setTasks] = useState(() => load('wd_tasks', defaultTasks))
  const [day, setDay] = useState(() => load('wd_plan_day', { Morning: [], Afternoon: [], Evening: [] }))
  const [doneToday, setDoneToday] = useState(() => !!load('wd_done', {})[dayjs().format('YYYY-MM-DD')])

  useEffect(()=>{
    // persist streak if any slot has at least one "Gym" or "Code"
    const anyPlanned = [...day.Morning, ...day.Afternoon, ...day.Evening].some(t => /gym|code/i.test(t))
    if (anyPlanned && doneToday){
      const all = load('wd_done', {})
      all[dayjs().format('YYYY-MM-DD')] = true
      save('wd_done', all)
    }
  }, [day, doneToday])

  const onDragStart = (e, task) => e.dataTransfer.setData('text/plain', task)
  const onDrop = (slot) => (e) => {
    const task = e.dataTransfer.getData('text/plain')
    const next = { ...day, [slot]: [...day[slot], task] }
    save('wd_plan_day', next)
    setDay(next)
  }
  const onDragOver = (e) => e.preventDefault()

  const removeFrom = (slot, idx) => {
    const next = { ...day }
    next[slot].splice(idx,1)
    setDay({ ...next })
    save('wd_plan_day', { ...next })
  }

  const addTask = (t) => {
    const next = [...tasks, t]
    setTasks(next)
    save('wd_tasks', next)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="border rounded-2xl p-4">
        <h2 className="font-semibold mb-3">Tasks</h2>
        <TaskInput onAdd={addTask} />
        <ul className="space-y-2 mt-3 max-h-80 overflow-auto scrollbar-thin">
          {tasks.map((t, i) => (
            <li key={i}
              draggable
              onDragStart={(e) => onDragStart(e, t)}
              className="p-2 border rounded-lg cursor-grab hover:bg-gray-50 dark:hover:bg-gray-800">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['Morning', 'Afternoon', 'Evening'].map(slot => (
          <div key={slot}
            onDrop={onDrop(slot)}
            onDragOver={onDragOver}
            className="border rounded-2xl p-3 min-h-[220px]">
            <h3 className="font-semibold mb-2">{slot}</h3>
            <ul className="space-y-2">
              {day[slot].map((t, idx) => (
                <li key={idx} className="p-2 border rounded-lg flex justify-between items-center">
                  <span>{t}</span>
                  <button onClick={() => removeFrom(slot, idx)} className="text-sm px-2 py-1 border rounded">x</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sm:col-span-2 flex items-center justify-between border rounded-2xl p-3">
        <div>
          <div className="font-semibold">Mark today done</div>
          <p className="text-sm opacity-70">Use when you completed gym or coding today.</p>
        </div>
        <button onClick={()=>setDoneToday(v=>!v)} className={"px-3 py-2 rounded text-white " + (doneToday ? "bg-green-600" : "bg-gray-600")}>
          {doneToday ? "Done ✔" : "Mark Done"}
        </button>
      </div>
    </div>
  )
}

function TaskInput({ onAdd }){
  const [v, setV] = useState('')
  return (
    <form onSubmit={e=>{e.preventDefault(); if(v.trim()){ onAdd(v.trim()); setV('') }}} className="flex gap-2">
      <input className="flex-1 border rounded p-2" value={v} onChange={e=>setV(e.target.value)} placeholder="Add a task..." />
      <button className="px-3 rounded bg-[hsl(var(--accent))] text-white">Add</button>
    </form>
  )
}
