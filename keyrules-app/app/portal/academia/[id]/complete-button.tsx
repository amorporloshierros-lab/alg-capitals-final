'use client'

import { useTransition } from 'react'
import { markClassCompleted } from '../actions'

export default function CompleteButton({ classId }: { classId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button 
      onClick={() => startTransition(() => markClassCompleted(classId))}
      disabled={isPending}
      style={{ 
        padding: '12px 24px', 
        background: isPending ? 'rgba(16,185,129,.4)' : '#10b981', 
        color: '#000', 
        border: 'none', 
        font: '900 italic 11px/1 var(--font-sans)', 
        letterSpacing: '.3em', 
        textTransform: 'uppercase', 
        cursor: isPending ? 'not-allowed' : 'pointer' 
      }}
    >
      {isPending ? 'Marcando...' : '✔ Marcar como completada'}
    </button>
  )
}
