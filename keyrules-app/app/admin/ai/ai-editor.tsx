'use client'

import { useState, useTransition } from 'react'
import { saveBotConfig } from './actions'

export default function AiEditor({ config }: { config: any }) {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState({
    is_active: config?.is_active ?? false,
    telegram_bot_token: config?.telegram_bot_token ?? '',
    openai_api_key: config?.openai_api_key ?? '',
    openai_assistant_id: config?.openai_assistant_id ?? '',
    system_prompt: config?.system_prompt ?? 'Eres Lucas, un experto en trading...'
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(false)
    startTransition(async () => {
      await saveBotConfig(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ font: '900 italic 28px/1 var(--font-sans)', color: '#f5f5f5', textTransform: 'uppercase', margin: 0 }}>Cerebro AI (Lucas Clon)</h1>
        <button 
          onClick={handleSave} 
          disabled={isPending}
          style={{ padding: '10px 20px', background: isPending ? '#525252' : '#10b981', color: '#000', border: 'none', font: '900 italic 12px/1 var(--font-sans)', letterSpacing: '.1em', textTransform: 'uppercase', cursor: isPending ? 'wait' : 'pointer' }}
        >
          {isPending ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar Config'}
        </button>
      </div>

      <div style={{ background: 'rgba(23,23,23,.6)', border: '1px solid #1f1f1f', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <label style={{ font: '900 italic 14px/1 var(--font-sans)', color: '#fff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={data.is_active} 
              onChange={e => setData(d => ({ ...d, is_active: e.target.checked }))} 
              style={{ width: 18, height: 18, accentColor: '#10b981' }}
            />
            🤖 Bot Activo (Responde en Telegram automáticamente)
          </label>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={{ display: 'block', font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Telegram Bot Token (obtenido de @BotFather)</label>
            <input 
              type="password" 
              value={data.telegram_bot_token} 
              onChange={e => setData(d => ({ ...d, telegram_bot_token: e.target.value }))}
              style={{ width: '100%', background: '#050505', border: '1px solid #262626', color: '#f5f5f5', padding: '12px', font: '400 14px/1 var(--font-mono)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>OpenAI API Key (ChatGPT)</label>
            <input 
              type="password" 
              value={data.openai_api_key} 
              onChange={e => setData(d => ({ ...d, openai_api_key: e.target.value }))}
              style={{ width: '100%', background: '#050505', border: '1px solid #262626', color: '#f5f5f5', padding: '12px', font: '400 14px/1 var(--font-mono)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>OpenAI Assistant ID (Opcional - Si creaste un Assistant con tu libro en PDF)</label>
            <input 
              type="text" 
              value={data.openai_assistant_id} 
              onChange={e => setData(d => ({ ...d, openai_assistant_id: e.target.value }))}
              placeholder="asst_abc123..."
              style={{ width: '100%', background: '#050505', border: '1px solid #262626', color: '#f5f5f5', padding: '12px', font: '400 14px/1 var(--font-mono)' }}
            />
            <div style={{ font: '400 11px/1.4 var(--font-sans)', color: '#525252', marginTop: 6 }}>
              Para que el bot use TODA la información de tu libro, ve a <a href="https://platform.openai.com/assistants" target="_blank" rel="noreferrer" style={{ color: '#10b981' }}>OpenAI Assistants</a>, crea uno, sube el PDF de tu libro ahí, y pega el ID aquí.
            </div>
          </div>

          <div>
            <label style={{ display: 'block', font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Personalidad / System Prompt (Fallback si no usas Assistant ID)</label>
            <textarea 
              value={data.system_prompt} 
              onChange={e => setData(d => ({ ...d, system_prompt: e.target.value }))}
              rows={8}
              style={{ width: '100%', background: '#050505', border: '1px solid #262626', color: '#f5f5f5', padding: '12px', font: '400 13px/1.5 var(--font-mono)', resize: 'vertical' }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', padding: 20 }}>
        <h3 style={{ font: '900 italic 14px/1 var(--font-sans)', color: '#10b981', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Webhook URL</h3>
        <p style={{ font: '400 12px/1.5 var(--font-sans)', color: '#d4d4d4', margin: '0 0 10px 0' }}>
          Para que Telegram le avise al bot cuando alguien escribe, debes ejecutar esta URL una sola vez en tu navegador:
        </p>
        <code style={{ display: 'block', padding: 10, background: '#000', color: '#10b981', font: '400 11px/1.4 var(--font-mono)', wordBreak: 'break-all' }}>
          https://api.telegram.org/bot[TU_TOKEN_ACA]/setWebhook?url=https://keyrulesalg.com/api/telegram-webhook
        </code>
      </div>
    </div>
  )
}
