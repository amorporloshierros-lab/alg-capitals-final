import { createClient } from '@/lib/supabase/server'
import CoinIntro from '@/components/coin-intro'
import Navbar from '@/components/chrome/navbar'
import ChatBotFab from '@/components/chrome/chatbot-fab'
import ScrollReveal from '@/components/scroll-reveal'
import Hero from '@/components/landing/hero'
import Auditoria from '@/components/landing/auditoria'
import Plans from '@/components/landing/plans'
import Footer from '@/components/landing/footer'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: meetConfig } = await supabase
    .from('meet_config')
    .select('*')
    .eq('id', 1)
    .single()

  return (
    <>
      <CoinIntro />
      <Navbar />
      <Hero meetConfig={meetConfig} />
      <Auditoria />
      <Plans />
      <Footer />
      <ChatBotFab />
      <ScrollReveal />
    </>
  )
}
