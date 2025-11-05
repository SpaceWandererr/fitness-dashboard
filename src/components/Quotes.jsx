import { useMemo } from 'react'
const QUOTES = [
  'Discipline beats motivation.',
  'You don\'t need more time, you need more focus.',
  'Small steps, big results.',
  'Consistency compounds.'
]
export default function Quotes({ compact=false }) {
  const q = useMemo(() => QUOTES[Math.floor(Math.random()*QUOTES.length)], [])
  if (compact) return <div className="border rounded-2xl p-4 text-center italic">“{q}”</div>
  return (
    <div className="max-w-xl mx-auto border rounded-2xl p-6 text-center">
      <h2 className="font-semibold mb-2">Quote of the moment</h2>
      <p className="text-xl italic">“{q}”</p>
    </div>
  )
}
