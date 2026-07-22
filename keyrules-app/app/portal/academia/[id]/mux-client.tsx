'use client'

import MuxPlayer from '@mux/mux-player-react'

export default function MuxClient({ playbackId }: { playbackId: string }) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      accentColor="#10b981"
      style={{ height: '100%', width: '100%', maxHeight: '70vh' }}
    />
  )
}
