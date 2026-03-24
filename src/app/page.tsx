'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const whatsappNumber = "541139538418";
  
  // ENLACES OFICIALES INTEGRADOS
  const youtubeLink = "https://www.youtube.com/@keyrueles-zs4fh"; 
  const telegramLink = "https://t.me/keyrukes";

  const getWhatsAppLink = (planName: string, price: string) => {
    const message = encodeURIComponent(`Hola Lucas, vengo de la web. Me interesa el plan: ${planName} ($${price}). ¿Cómo gestionamos el pago?`);
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-emerald-500 pb-10">
      
      {/* NAVBAR GLOBAL */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="flex items-center gap-5">
          <Image src="/logo-sello.jpg" alt="Logo" width={54} height={54} className="relative z-10" />
          <div className="flex flex-col items-center justify-center -space-y-1">
            <span className="text-lg md:text-2xl font-black text-white tracking-wider drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">KEYRULES</span> 
            <span className="text-lg md:text-2xl font-black text-emerald-500 tracking-wider drop-shadow-[0_0_25px_rgba(16,185,129,0.7)]">ALG CAPITALS</span>
          </div>
        </div>
        <div className="space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] hidden md:flex items-center text-neutral-500">
          <Link href="/quienes-somos" className="hover:text-emerald-400 transition-colors">ADN</Link>
          <Link href="/certificados" className="hover:text-emerald-400 transition-colors">Testimonios</Link>
          <a href="#planes" className="hover:text-emerald-400 transition-colors">Acceder</a>
          <span className="text-neutral-800">|</span>
          <a href={telegramLink} target="_blank" className="text-emerald-500/50 hover:text-emerald-400 transition-colors">Telegram</a>
          {/* NUEVO BOTÓN PORTAL ALUMNOS */}
          <Link 
            href="/dashboard" 
            className="ml-4 px-5 py-2 bg-emerald-600/10 border border-emerald-500/50 hover:bg-emerald-500 hover:text-black text-emerald-500 transition-all duration-300 rounded-sm"
          >
            Portal Alumnos
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 mb-8 text-[9px] font-bold tracking-[0.4em] text-emerald-500 uppercase bg-emerald-500/5 border border-emerald-500/20 rounded-sm">Institutional Liquidity Protocol v3.0</div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-10 leading-[0.9]">DOMINA EL <br /><span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-700">ALGORITMO.</span></h1>
        <p className="max-w-xl text-sm text-neutral-500 mb-14 leading-relaxed font-mono uppercase tracking-widest opacity-80">Sistemas cuantitativos diseñados para detectar la entrega de precio institucional.</p>
        <a href="#planes" className="px-10 py-5 text-xs font-bold text-black bg-emerald-500 rounded-sm hover:scale-105 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)] uppercase tracking-widest">Accede a la Academia</a>
      </main>

      {/* AUDITORÍA */}
      <section id="auditoria" className="py-20 px-6 max-w-4xl mx-auto w-full text-center">
        <h2 className="text-2xl font-black text-white mb-10 tracking-widest uppercase italic">Track Record Auditado</h2>
        <div className="w-full aspect-video rounded-sm overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] border border-neutral-800">
          <iframe className="w-full h-full" src="https://www.youtube.com/embed/WWpyQnTI4ME?rel=0" title="Auditoría" frameBorder="0" allowFullScreen></iframe>
        </div>
      </section>

      {/* PROTOCOLOS DE INVERSIÓN (VALOR TOTAL MANTENIDO) */}
      <section id="planes" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* SOFTWARE BASE */}
          <div className="p-8 bg-neutral-900/30 border border-neutral-800 flex flex-col hover:scale-105 hover:border-emerald-500 hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer group">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-6 italic">Software Base</h3>
            <div className="mb-6 flex justify-center"><Image src="/libro-keywick.jpg" alt="Libro" width={100} height={140} /></div>
            <div className="text-4xl font-black text-white mb-8">$120</div>
            <ul className="text-[9px] text-neutral-400 space-y-4 uppercase tracking-widest flex-grow mb-10 leading-tight">
              <li>• Libro Oficial "KEYWICK"</li>
              <li>• Licencia Oracle MT5 Lite</li>
              <li>• Indicador Keywick Pro</li>
              <li>• Relative Strength Indicator</li>
              <li className="text-emerald-400 font-bold">• 2 Meses Canal Seguimiento</li>
              <li>• Gestión de Riesgo Avanzada</li>
            </ul>
            <a href={getWhatsAppLink("Software Base", "120")} className="w-full py-4 text-[10px] font-bold text-center border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-widest">Reservar</a>
          </div>

          {/* SUBSCRIPTION */}
          <div className="p-8 bg-neutral-900/30 border border-neutral-800 flex flex-col hover:scale-105 hover:border-emerald-500 hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-10 italic">Subscription</h3>
            <div className="text-4xl font-black text-white mb-8">$40<span className="text-xs">/mo</span></div>
            <ul className="text-[9px] text-neutral-400 space-y-4 uppercase tracking-widest flex-grow mb-10 leading-tight">
              <li>• Proyección Bias Semanal</li>
              <li>• Sesiones Live Trading</li>
              <li>• Acceso Grupo de Gestores</li>
              <li className="text-white font-bold">• Acceso Oracle + MT5</li>
              <li>• Revisiones de Setups</li>
              <li>• Clases Teóricas Semanales</li>
            </ul>
            <a href={getWhatsAppLink("Suscripción", "40")} className="w-full py-4 text-[10px] font-bold text-center border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-widest">Unirse</a>
          </div>

          {/* ACADEMIA GRUPAL */}
          <div className="p-8 bg-neutral-900/30 border-2 border-neutral-800 flex flex-col relative hover:scale-105 hover:border-emerald-500 hover:shadow-[0_0_80px_rgba(16,185,129,0.3)] transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[8px] font-black px-4 py-1.5 uppercase tracking-tighter">Recommended</div>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-10 italic">Academia Grupal</h3>
            <div className="text-5xl font-black text-white mb-8 italic">$550</div>
            <ul className="text-[9px] text-neutral-400 space-y-4 uppercase tracking-widest flex-grow mb-10 font-bold leading-tight">
              <li>• Programa 10 Semanas</li>
              <li>• 25 Clases en Vivo</li>
              <li>• Protocolo Entrada 5 Pasos</li>
              <li className="text-white">• Oracle MT5 Full Ilimitada</li>
              <li>• Auditoría & Track Record</li>
              <li>• Pack Premium Indicadores</li>
              <li>• Plataforma de Estudiantes</li>
              <li className="text-neutral-600 italic">• 5 Meses Canal Bias</li>
              <li className="text-neutral-600 italic">• Libro Físico/Digital</li>
            </ul>
            <a href={getWhatsAppLink("Academia Grupal", "550")} className="w-full py-5 text-[10px] font-black text-center bg-black text-white hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-widest shadow-xl">Mentoría</a>
          </div>

          {/* ELITE PROGRAM */}
          <div className="p-8 bg-neutral-900/30 border border-neutral-800 flex flex-col hover:scale-105 hover:border-emerald-500 hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-10 italic">Elite Program</h3>
            <div className="text-4xl font-black text-white mb-8 italic">$750</div>
            <ul className="text-[9px] text-neutral-400 space-y-4 uppercase tracking-widest flex-grow mb-10 leading-tight">
              <li>• Mentoría 1-a-1 Directa</li>
              <li>• Acceso Directo 24/7 (Línea)</li>
              <li>• Psicotrading Avanzado</li>
              <li>• Escalado Capital Estructurado</li>
              <li className="text-emerald-400 font-bold">• +30 Clases Privadas</li>
              <li>• Beneficios Totales & Updates</li>
              <li className="text-white font-black underline decoration-emerald-500 underline-offset-4 uppercase tracking-tighter leading-tight">Gestor de Riesgo Cuántico</li>
            </ul>
            <a href={getWhatsAppLink("Elite Program", "750")} className="w-full py-4 text-[10px] font-bold text-center border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-widest">Aplicar</a>
          </div>
        </div>

        {/* TERMINAL DE PAGO (SUTIL) */}
        <div className="mt-12 p-6 border border-neutral-900 bg-neutral-900/10 rounded-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xl font-black text-emerald-500 tracking-tighter uppercase italic">ACEPTAMOS</div>
            <div className="flex flex-col text-center md:text-right font-mono text-[10px] uppercase tracking-[0.2em] leading-relaxed text-neutral-500">
              <div>CRIPTOS: BTC, ETH, USDT | PAYPAL</div>
              <div>MERCADO PAGO, TARJETAS</div>
              <div className="mt-2 text-neutral-600 uppercase">Consultanos por nuestro Financiamiento Personalizado</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CORPORATIVO CON LINKS REALES */}
      <footer className="pt-20 pb-10 border-t border-neutral-900 bg-black/50">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-widest uppercase">KEYRULES</span>
              <span className="text-emerald-500 font-bold text-sm tracking-widest uppercase">ALG CAPITALS</span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono uppercase leading-relaxed tracking-widest">Research Division dedicada a la explotación estadística de ineficiencias de mercado.</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Navegación</h4>
            <ul className="text-[10px] text-neutral-500 space-y-2 uppercase tracking-widest">
              <li><Link href="/quienes-somos" className="hover:text-emerald-400 transition-colors">ADN Institucional</Link></li>
              <li><Link href="/certificados" className="hover:text-emerald-400 transition-colors">Proof of Funding</Link></li>
              <li><a href="#planes" className="hover:text-emerald-400 transition-colors">Protocolos</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Contacto Directo</h4>
            <ul className="text-[10px] text-neutral-500 space-y-2 uppercase tracking-widest font-mono">
              <li>Oficina: Tigre / Nordelta, AR</li>
              <li>Email: contact@algcapitals.com</li>
              <li>WhatsApp: +54 11 3953-8418</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Comunidad Social</h4>
            <div className="flex flex-col gap-3">
              <a href={youtubeLink} target="_blank" className="text-neutral-500 hover:text-emerald-400 transition-colors text-[10px] uppercase tracking-widest font-bold">YouTube Official</a>
              <a href={telegramLink} target="_blank" className="text-neutral-500 hover:text-emerald-400 transition-colors text-[10px] uppercase tracking-widest font-bold">Telegram Community</a>
              <a href="https://instagram.com" target="_blank" className="text-neutral-500 hover:text-emerald-400 transition-colors text-[10px] uppercase tracking-widest font-bold">Instagram Feed</a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 border-t border-neutral-900 pt-10">
          <div className="text-[9px] text-neutral-700 uppercase tracking-[0.5em] font-black italic">© 2024 KEYRULES x ALG CAPITALS | QUANT RESEARCH DIVISION</div>
          <div className="text-[8px] text-neutral-800 font-mono leading-loose uppercase tracking-widest border border-neutral-900/30 p-4">AVISO LEGAL: EL TRADING EN MERCADOS FINANCIEROS IMPLICA UN RIESGO SIGNIFICATIVO DE PÉRDIDA DE CAPITAL. EL RENDIMIENTO PASADO NO GARANTIZA RESULTADOS FUTUROS. ALG CAPITALS NO ES UN ASESOR FINANCIERO REGULADO.</div>
        </div>
      </footer>
    </div>
  );
}