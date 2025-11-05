import { useEffect, useMemo, useState } from 'react'
import { load, save } from '../utils/localStorage.js'
import defaults from '../data/syllabus.json'

export default function Syllabus() {
  const [syllabus, setSyllabus] = useState(() => load('wd_syllabus', defaults))

  useEffect(() => { save('wd_syllabus', syllabus) }, [syllabus])

  const addItem = (section, title, deadline='') => {
    const next = structuredClone(syllabus)
    next[section].push({ title, done:false, deadline })
    setSyllabus(next)
  }

  const toggle = (section, idx) => {
    const next = structuredClone(syllabus)
    next[section][idx].done = !next[section][idx].done
    setSyllabus(next)
  }

  const setDeadline = (section, idx, dl) => {
    const next = structuredClone(syllabus)
    next[section][idx].deadline = dl
    setSyllabus(next)
  }

  const percent = (list) => Math.round(100 * list.filter(x=>x.done).length / list.length || 0)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Object.keys(syllabus).map(section => (
        <div key={section} className="border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{section}</h2>
            <span className="text-sm opacity-70">{percent(syllabus[section])}%</span>
          </div>
          <Progress value={percent(syllabus[section])} />
          <ul className="space-y-2 mt-3">
            {syllabus[section].map((it, idx) => (
              <li key={idx} className="p-2 border rounded-xl">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={it.done} onChange={() => toggle(section, idx)} />
                  <span className={"flex-1 " + (it.done ? "line-through opacity-70" : "")}>{it.title}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <label className="opacity-70">Deadline:</label>
                  <input type="date" value={it.deadline} onChange={(e)=>setDeadline(section, idx, e.target.value)}
                    className="border rounded px-2 py-1 text-white" />
                  {it.deadline && <span className="opacity-70">({daysLeft(it.deadline)} days left)</span>}
                </div>
              </li>
            ))}
          </ul>
          <NewItem onAdd={(t,dl)=>addItem(section,t,dl)} />
        </div>
      ))}
    </div>
  )
}

function Progress({ value=0 }){
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded">
      <div className="h-2 rounded bg-[hsl(var(--accent))]" style={{ width: value + '%' }} />
    </div>
  )
}

function NewItem({ onAdd }){
  const [t, setT] = useState('')
  const [dl, setDl] = useState('')
  return (
    <form onSubmit={(e)=>{e.preventDefault(); if(t.trim()){ onAdd(t.trim(), dl); setT(''); setDl('') }}} className="flex gap-2 mt-3 text-white">
      <input className="flex-1 border rounded p-2" value={t} onChange={e=>setT(e.target.value)} placeholder="Add topic..." />
      <input type="date" className="border rounded px-2" value={dl} onChange={e=>setDl(e.target.value)} />
      <button className="px-3 rounded bg-[hsl(var(--accent))] text-white">Add</button>
    </form>
  )
}

function daysLeft(dateStr){
  const d = new Date(dateStr)
  const now = new Date()
  return Math.ceil((d - now) / (1000*60*60*24))
}
