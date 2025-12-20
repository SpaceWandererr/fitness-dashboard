import { useState } from 'react'
import { load, save } from '../utils/localStorage.js'

export default function Gallery() {
  const [items, setItems] = useState(() => load('wd_imgs_v2', []))
  const [before, setBefore] = useState(null)
  const [after, setAfter] = useState(null)
  const [slider, setSlider] = useState(50)

  const onSelect = async (e, category) => {
    const files = Array.from(e.target.files || [])
    const reads = await Promise.all(files.map(f => new Promise(res => {
      const reader = new FileReader()
      reader.onload = () => res(reader.result)
      reader.readAsDataURL(f)
    })))
    const newItems = reads.map(src => ({ src, caption: '', category, date: new Date().toISOString().slice(0,10) }))
    const next = [...items, ...newItems]
    setItems(next); save('wd_imgs_v2', next)
  }

  const updateCaption = (idx, cap) => {
    const next = [...items]; next[idx].caption = cap; setItems(next); save('wd_imgs_v2', next)
  }

  return (
    <div className="space-y-6 md:mt-10 lg:mt-0">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="border rounded px-3 py-2 cursor-pointer">Upload Gym Photos
          <input type="file" className="hidden" accept="image/*" multiple onChange={(e)=>onSelect(e,'Gym')} />
        </label>
        <label className="border rounded px-3 py-2 cursor-pointer">Upload Coding Shots
          <input type="file" className="hidden" accept="image/*" multiple onChange={(e)=>onSelect(e,'Coding')} />
        </label>
        <button onClick={()=>{ setItems([]); save('wd_imgs_v2', []) }} className="px-3 py-2 border rounded">Clear</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((it, i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <img src={it.src} className="w-full h-40 object-cover" />
            <div className="p-2 text-sm">
              <div className="opacity-70">{it.category} • {it.date}</div>
              <input className="mt-1 w-full border rounded p-1" placeholder="Caption..." value={it.caption} onChange={e=>updateCaption(i, e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-2xl p-4">
        <h3 className="font-semibold mb-2">Before / After Comparison</h3>
        <div className="flex gap-3 items-center">
          <input type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>setBefore(r.result); r.readAsDataURL(f) }} />
          <span>vs</span>
          <input type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>setAfter(r.result); r.readAsDataURL(f) }} />
        </div>
        {before && after && (
          <div className="mt-4 relative w-full max-w-xl aspect-video mx-auto">
            <img src={before} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
            <div className="absolute inset-0 overflow-hidden rounded-xl" style={{ width: slider + '%' }}>
              <img src={after} className="w-full h-full object-cover" />
            </div>
            <input type="range" min="0" max="100" value={slider} onChange={e=>setSlider(+e.target.value)} className="absolute bottom-2 left-2 right-2" />
          </div>
        )}
      </div>
    </div>
  )
}
