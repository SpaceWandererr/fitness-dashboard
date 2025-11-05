import { useMemo } from 'react'
import { load } from '../utils/localStorage.js'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'

export default function Stats(){
  const done = load('wd_done', {})
  const calories = load('wd_calories', [])
  const coding = load('wd_coding_hours', [])
  const days = Object.keys(done).sort()
  const last30 = days.slice(-30).map(d => ({ date: d, done: done[d] ? 1 : 0 }))
  const streak = useMemo(()=>{
    let s=0; const today = new Date(); for(let i=0;i<365;i++){ const dt=new Date(today); dt.setDate(today.getDate()-i); const k=dt.toISOString().slice(0,10); if(done[k]) s++; else break } return s
  }, [done])

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card title={`Streak: ${streak} days`}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={last30}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="done" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Weight trend (last entries)">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={calories.slice(-30)}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="weight" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Calories (last 30)">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={calories.slice(-30)}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calories" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Coding hours (manual logs)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={coding.slice(-30)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

function Card({ title, children }){
  return (
    <div className="border rounded-2xl p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  )
}
