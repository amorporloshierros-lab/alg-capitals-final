'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MediaEditor({ initialItems }: { initialItems: any[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    kind: 'certificate',
    storage_path: '',
    caption: '',
    published: true,
    sort_order: 0
  })

  const handleAdd = async () => {
    if (!form.storage_path) return alert('Ingresa una URL de imagen o path')
    setLoadingId('new')
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error(await res.text())
      const newItem = await res.json()
      setItems([...items, newItem].sort((a,b) => a.sort_order - b.sort_order))
      setForm({ ...form, storage_path: '', caption: '', sort_order: form.sort_order + 1 })
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Borrar item?')) return
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      setItems(items.filter(i => i.id !== id))
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoadingId(null)
    }
  }

  const togglePublish = async (id: string, current: boolean) => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !current })
      })
      if (!res.ok) throw new Error(await res.text())
      setItems(items.map(i => i.id === id ? { ...i, published: !current } : i))
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'start' }}>
      
      {/* ADD FORM */}
      <div style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', padding: 24 }}>
        <h2 style={{ font: '900 italic 16px/1 var(--font-sans)', color: '#fff', textTransform: 'uppercase', marginBottom: 20 }}>Agregar Item</h2>
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', marginBottom: 8 }}>Tipo</label>
            <select value={form.kind} onChange={e => setForm({...form, kind: e.target.value})} style={{ width: '100%', background: '#000', border: '1px solid #262626', color: '#f5f5f5', padding: '10px' }}>
              <option value="certificate">Certificado (Fondeo)</option>
              <option value="review">Review / Testimonio</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', marginBottom: 8 }}>URL de la Imagen</label>
            <input type="text" value={form.storage_path} onChange={e => setForm({...form, storage_path: e.target.value})} style={{ width: '100%', background: '#000', border: '1px solid #262626', color: '#f5f5f5', padding: '10px' }} placeholder="https://..." />
          </div>
          <div>
            <label style={{ display: 'block', font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', marginBottom: 8 }}>Caption (Nombre o monto)</label>
            <input type="text" value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} style={{ width: '100%', background: '#000', border: '1px solid #262626', color: '#f5f5f5', padding: '10px' }} placeholder="Ej: Augusto - $100K FTMO" />
          </div>
          <div>
            <label style={{ display: 'block', font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', marginBottom: 8 }}>Orden</label>
            <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} style={{ width: '100%', background: '#000', border: '1px solid #262626', color: '#f5f5f5', padding: '10px' }} />
          </div>
          <button onClick={handleAdd} disabled={loadingId === 'new'} style={{ width: '100%', padding: '12px', background: loadingId === 'new' ? '#525252' : '#10b981', color: '#000', border: 'none', font: '900 italic 12px/1 var(--font-sans)', textTransform: 'uppercase', cursor: 'pointer' }}>
            {loadingId === 'new' ? 'Guardando...' : 'Agregar Item'}
          </button>
        </div>
      </div>

      {/* LIST */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {items.map(it => (
          <div key={it.id} style={{ background: '#050505', border: '1px solid #1f1f1f', overflow: 'hidden', position: 'relative', opacity: it.published ? 1 : 0.5 }}>
            <div style={{ height: 160, background: '#111', position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.storage_path} alt={it.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src='https://placehold.co/400x300/111/333?text=IMG+ERROR' }} />
              <div style={{ position: 'absolute', top: 8, left: 8, padding: '4px 8px', background: 'rgba(0,0,0,.8)', font: '900 italic 8px/1 var(--font-sans)', color: it.kind === 'certificate' ? '#fbbf24' : '#10b981', textTransform: 'uppercase' }}>
                {it.kind}
              </div>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ font: '900 italic 12px/1 var(--font-sans)', color: '#fff', marginBottom: 12, minHeight: 24 }}>{it.caption || 'Sin nombre'}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ font: '400 10px/1 var(--font-mono)', color: '#525252' }}>Orden: {it.sort_order}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => togglePublish(it.id, it.published)} disabled={loadingId === it.id} style={{ background: 'none', border: 'none', color: it.published ? '#10b981' : '#737373', cursor: 'pointer', font: '900 10px/1 var(--font-sans)', textTransform: 'uppercase' }}>
                    {it.published ? 'On' : 'Off'}
                  </button>
                  <button onClick={() => handleDelete(it.id)} disabled={loadingId === it.id} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', font: '900 10px/1 var(--font-sans)', textTransform: 'uppercase' }}>
                    Del
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
