import { useEffect, useRef, useState } from 'react'
import { save, load } from '../utils/localStorage.js'

export default function Focus(){
  const [work, setWork] = useState(() => load('wd_pomo_work', 25))
  const [rest, setRest] = useState(() => load('wd_pomo_rest', 5))
  const [sec, setSec] = useState(work*60)
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState('work')
  const timer = useRef(null)

  useEffect(()=>{ save('wd_pomo_work', work) }, [work])
  useEffect(()=>{ save('wd_pomo_rest', rest) }, [rest])

  useEffect(()=>{
    if(!running) return
    timer.current = setInterval(()=>setSec(s=>s-1), 1000)
    return ()=>clearInterval(timer.current)
  }, [running])

  useEffect(()=>{
    if(sec >= 0) return
    // switch phase
    const nextPhase = phase === 'work' ? 'rest' : 'work'
    setPhase(nextPhase)
    const dur = nextPhase === 'work' ? work*60 : rest*60
    setSec(dur)
    beep()
  }, [sec])

  const start = () => { setPhase('work'); setSec(work*60); setRunning(true) }
  const stop = () => setRunning(false)
  const reset = () => { setRunning(false); setPhase('work'); setSec(work*60) }

  const m = Math.floor(sec/60).toString().padStart(2,'0')
  const s = Math.floor(sec%60).toString().padStart(2,'0')

  return (
    <div className="max-w-lg mx-auto border rounded-2xl p-6 text-center">
      <h2 className="font-semibold mb-2">Pomodoro Focus</h2>
      <div className="text-sm opacity-70 mb-4">Work then rest. Repeat.</div>
      <div className="text-6xl font-bold mb-4">{m}:{s}</div>
      <div className="mb-4">
        <span className="px-3 py-1 rounded border">{phase.toUpperCase()}</span>
      </div>
      <div className="flex justify-center gap-2 mb-4">
        <button onClick={start} className="px-3 py-2 rounded bg-[hsl(var(--accent))] text-white">Start</button>
        <button onClick={stop} className="px-3 py-2 rounded border">Pause</button>
        <button onClick={reset} className="px-3 py-2 rounded border">Reset</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center justify-between border rounded p-2">Work (min)
          <input type="number" min="1" className="w-20 border rounded p-1" value={work} onChange={e=>setWork(+e.target.value)} />
        </label>
        <label className="flex items-center justify-between border rounded p-2">Rest (min)
          <input type="number" min="1" className="w-20 border rounded p-1" value={rest} onChange={e=>setRest(+e.target.value)} />
        </label>
      </div>
    </div>
  )
}

function beep(){
  const a = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQgAAAAA')
  a.play().catch(()=>{})
}
