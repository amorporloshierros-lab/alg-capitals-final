import Navbar from '@/components/chrome/navbar'
import ChatBotFab from '@/components/chrome/chatbot-fab'
import ScrollReveal from '@/components/scroll-reveal'
import Plans from '@/components/landing/plans'
import Footer from '@/components/landing/footer'

export default function PlanesPage() {
  return (
    <>
      <Navbar />
      <Plans />
      <Footer />
      <ChatBotFab />
      <ScrollReveal />
    </>
  )
}
