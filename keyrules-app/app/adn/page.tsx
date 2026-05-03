import Navbar from '@/components/chrome/navbar'
import ChatBotFab from '@/components/chrome/chatbot-fab'
import ScrollReveal from '@/components/scroll-reveal'
import ADN from '@/components/screens/adn'
import Footer from '@/components/landing/footer'

export default function ADNPage() {
  return (
    <>
      <Navbar />
      <ADN />
      <Footer />
      <ChatBotFab />
      <ScrollReveal />
    </>
  )
}
