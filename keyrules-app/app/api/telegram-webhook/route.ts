import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import OpenAI from 'openai'

// Constante para no responder a nuestros propios mensajes
const BOT_USERNAME = process.env.BOT_USERNAME || 'LucasAI_Bot'

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()
    
    // Si no es un mensaje, ignorar
    if (!update.message || !update.message.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = update.message.chat.id
    const text = update.message.text
    const sender = update.message.from?.username || update.message.from?.first_name

    const supabase = createAdminClient()
    const { data: config } = await supabase.from('bot_config').select('*').eq('id', 1).single()

    // Si el bot no está activo, o faltan keys, no hacer nada
    if (!config?.is_active || !config?.telegram_bot_token || !config?.openai_api_key) {
      return NextResponse.json({ ok: true })
    }

    // Inicializar OpenAI
    const openai = new OpenAI({ apiKey: config.openai_api_key })

    let reply = ''

    if (config.openai_assistant_id) {
      // Flujo con Assistant API (para leer el libro)
      // 1. Crear un Thread
      const thread = await openai.beta.threads.create()
      // 2. Agregar mensaje
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: `El usuario ${sender} dice: ${text}`
      })
      // 3. Correr el asistente
      const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: config.openai_assistant_id,
        instructions: config.system_prompt
      })
      
      if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(run.thread_id)
        const lastMsg = messages.data.filter(m => m.role === 'assistant')[0]
        if (lastMsg && lastMsg.content[0].type === 'text') {
          reply = lastMsg.content[0].text.value
        }
      } else {
        console.error('Run falló:', run.status)
        return NextResponse.json({ ok: true })
      }
    } else {
      // Flujo estándar Chat Completions (fallback)
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: config.system_prompt },
          { role: 'user', content: `El usuario ${sender} dice: ${text}` }
        ],
      })
      reply = completion.choices[0].message.content || ''
    }

    // Enviar respuesta a Telegram
    if (reply) {
      const telegramUrl = `https://api.telegram.org/bot${config.telegram_bot_token}/sendMessage`
      await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply,
          reply_to_message_id: update.message.message_id
        })
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Telegram Webhook Error:', err)
    // Siempre devolvemos 200 a Telegram para que no reintente en loop
    return NextResponse.json({ ok: true })
  }
}
