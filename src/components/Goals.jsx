import { useEffect, useState } from 'react'
import { load, save } from '../utils/localStorage.js'

export default function Goals({ onAccent }){
  const [goals, setGoals] = useState(()=>load('wd_goals', { targetWeight: 70, dailyCoding: 2, theme: '222 81% 55%' }))

  useEffect(()=>{ save('wd_goals', goals) }, [goals])
  useEffect(()=>{ onAccent(goals.theme) }, [goals.theme])

  return (
    <div className="max-w-lg mx-auto border rounded-2xl p-4">
      <h2 className="font-semibold mb-4">Profile & Goals</h2>
      <div className="space-y-3">
        <label className="block">Target Weight (kg)
          <input type="number" className="w-full border rounded p-2" value={goals.targetWeight} onChange={e=>setGoals(g=>({ ...g, targetWeight:+e.target.value }))} />
        </label>
        <label className="block">Daily Coding Hours
          <input type="number" className="w-full border rounded p-2" value={goals.dailyCoding} onChange={e=>setGoals(g=>({ ...g, dailyCoding:+e.target.value }))} />
        </label>
        <label className="block">Theme Accent (H S L)
          <input className="w-full border rounded p-2" value={goals.theme} onChange={e=>setGoals(g=>({ ...g, theme: e.target.value }))} />
          <p className="text-sm opacity-70">Example: 160 84% 39% for green. This updates instantly.</p>
        </label>
      </div>
      <div className="mt-4 p-3 rounded bg-gray-100 dark:bg-gray-800">
        <div>Preview button:</div>
        <button className="mt-2 px-3 py-2 rounded text-white bg-[hsl(var(--accent))]">Accent Button</button>
      </div>
    </div>
  )
}
