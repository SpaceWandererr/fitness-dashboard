import { useState } from 'react'
const Q = [
  { q: 'What does Array.map return?', a: ['A mutated array', 'A new array'], correct: 1 },
  { q: 'Time complexity of binary search?', a: ['O(log n)', 'O(n)'], correct: 0 },
  { q: 'React state updates are...', a: ['Synchronous', 'Asynchronous-ish'], correct: 1 }
]
export default function Quiz() {
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const cur = Q[i]
  const pick = (idx) => {
    if (idx === cur.correct) setScore(s => s+1)
    if (i+1 < Q.length) setI(i+1)
  }
  return (
    <div className="max-w-md mx-auto border rounded-2xl p-4">
      <h2 className="font-semibold mb-3">Quick Quiz</h2>
      <p className="mb-4">{cur.q}</p>
      <div className="space-y-2">
        {cur.a.map((opt, idx) => (
          <button key={idx} onClick={() => pick(idx)} className="w-full border rounded p-2">{opt}</button>
        ))}
      </div>
      <div className="mt-4 text-sm opacity-70">Score: {score}/{Q.length}</div>
    </div>
  )
}
