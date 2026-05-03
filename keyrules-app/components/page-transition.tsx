'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function PageTransition() {
  const pathname = usePathname()
  const prevPath = useRef(pathname)
  const [wipe, setWipe] = useState(false)

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname
      setWipe(true)
      const t = setTimeout(() => setWipe(false), 850)
      return () => clearTimeout(t)
    }
  }, [pathname])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', inset: 0, zIndex: 150, pointerEvents: 'none',
        opacity: wipe ? 1 : 0,
        background: `linear-gradient(90deg,
          transparent 0%,
          rgba(16,185,129,.08) 45%,
          rgba(16,185,129,.25) 50%,
          rgba(16,185,129,.08) 55%,
          transparent 100%)`,
        backgroundSize: '300% 100%',
        backgroundPosition: wipe ? undefined : '100% 0',
        animation: wipe ? 'screenWipe 850ms cubic-bezier(.5,.02,.5,1) forwards' : 'none',
        transition: 'opacity 200ms',
      }}
    >
      <style>{`
        @keyframes screenWipe {
          0%   { background-position:100% 0; opacity:0; }
          20%  { opacity:1; }
          80%  { opacity:1; }
          100% { background-position:-100% 0; opacity:0; }
        }
      `}</style>
    </div>
  )
}
