'use client'

import { useEffect } from 'react'

// Bidireccional: elementos entran al scrollear abajo, salen al scrollear arriba.
// Excluye CoinIntro, nav, y elementos fijos.
export default function ScrollReveal() {
  useEffect(() => {
    const mark = () => {
      document.querySelectorAll<HTMLElement>('img, section, footer, h2, h3, h1, p, [data-reveal]').forEach(el => {
        if (el.closest('[data-no-reveal], nav, .coin-drop-wrap')) return
        if (!el.classList.contains('sr')) {
          el.classList.add('sr')
          const r = Math.random()
          if (el.tagName === 'H1' || el.tagName === 'H2') el.classList.add('sr-up-lg')
          else if (el.tagName === 'IMG') el.classList.add('sr-zoom')
          else if (r < 0.4) el.classList.add('sr-left')
          else if (r < 0.7) el.classList.add('sr-right')
          else el.classList.add('sr-up')
        }
      })
    }

    mark()

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('sr-in')
        else e.target.classList.remove('sr-in')
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })

    const attach = () => document.querySelectorAll('.sr').forEach(el => io.observe(el))
    attach()

    const interval = setInterval(() => { mark(); attach() }, 600)
    return () => { io.disconnect(); clearInterval(interval) }
  }, [])

  return null
}
