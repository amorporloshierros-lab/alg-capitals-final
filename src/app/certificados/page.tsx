'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CertificadosPage() {
  const whatsappNumber = "541139538418";

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-emerald-500 pb-20">
      
      {/* NAVBAR GLOBAL */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto border-b border-neutral-900">
        <Link href="/" className="flex items-center gap-5">
          <Image src="/logo-sello.jpg" alt="Logo" width={40} height={40} />
          <div className="flex flex-col -space-y-1">
            <span className="text-sm font-black text-white tracking-widest uppercase">KEYRULES</span>
            <span className="text-xs font-bold text-emerald-500 tracking-widest uppercase">ALG CAPITALS</span>
          </div>
        </Link>
        <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-emerald-400 transition-colors">Volver al Home</Link>
      </nav>

      {/* HERO PROOF */}
      <header className="py-24 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 mb-6 text-[8px] font-bold tracking-[0.4em] text-emerald-500 uppercase bg-emerald-500/5 border border-emerald-500/20 rounded-sm italic">
          Verified Track Record & Student Results
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6">
          PRUEBA DE <span className="text-emerald-500">FONDEO.</span>
        </h1>
        <p className="text-xs text-neutral-500 uppercase tracking-[0.3em] font-mono leading-relaxed max-w-2xl mx-auto">
          No operamos con promesas. Operamos con resultados estadísticos validados por las firmas de fondeo más exigentes del mercado.
        </p>
      </header>

      {/* SECCIÓN 1: CERTIFICADOS DE FONDEO (AUTORIDAD) */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-neutral-900/50">
        <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.5em] mb-12 text-center italic">Prop Firm Funding Certificates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="border border-neutral-800 p-2 bg-neutral-900/10 hover:border-emerald-500 transition-all group cursor-pointer rounded-sm shadow-[0_0_40px_rgba(16,185,129,0.02)] hover:shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:scale-105 duration-300">
            <Image src="/certificado-1.jpg" alt="Certificado 1" width={400} height={500} className="grayscale group-hover:grayscale-0 transition-all duration-500 rounded-sm" priority />
          </div>
          <div className="border border-neutral-800 p-2 bg-neutral-900/10 hover:border-emerald-500 transition-all group cursor-pointer rounded-sm shadow-[0_0_40px_rgba(16,185,129,0.02)] hover:shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:scale-105 duration-300">
            <Image src="/certificado-2.jpg" alt="Certificado 2" width={400} height={500} className="grayscale group-hover:grayscale-0 transition-all duration-500 rounded-sm" />
          </div>
          <div className="border border-neutral-800 p-2 bg-neutral-900/10 hover:border-emerald-500 transition-all group cursor-pointer rounded-sm shadow-[0_0_40px_rgba(16,185,129,0.02)] hover:shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:scale-105 duration-300">
            <Image src="/certificado-3.jpg" alt="Certificado 3" width={400} height={500} className="grayscale group-hover:grayscale-0 transition-all duration-500 rounded-sm" />
          </div>
        </div>
      </section>

      {/* VALIDACIÓN DE LOGOS */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-y border-neutral-900/50 bg-neutral-900/5">
        <h2 className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.6em] mb-10 text-center">Institutional Partners & Audited Platforms</h2>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 grayscale opacity-40 hover:opacity-100 transition-all duration-700">
          <Image src="/ftmo.png" alt="FTMO" width={120} height={60} className="hover:scale-110 transition-transform cursor-crosshair" />
          <Image src="/alpha.png" alt="Alpha Capital" width={120} height={60} className="hover:scale-110 transition-transform cursor-crosshair" />
          <Image src="/fundednext.png" alt="FundedNext" width={120} height={60} className="hover:scale-110 transition-transform cursor-crosshair" />
        </div>
      </section>

      {/* SECCIÓN 2: TESTIMONIOS REALES (CHATS) - INTERACTIVOS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.5em] mb-12 text-center italic">Community Social Proof (Live Results)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="border border-neutral-800 p-1 bg-neutral-900/5 rounded-sm transition-all duration-300 hover:border-emerald-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:bg-neutral-900/10 cursor-pointer">
            <Image src="/comentario-1.jpg" alt="Chat 1" width={250} height={400} className="rounded-sm" />
          </div>
          <div className="border border-neutral-800 p-1 bg-neutral-900/5 rounded-sm transition-all duration-300 hover:border-emerald-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:bg-neutral-900/10 cursor-pointer">
            <Image src="/comentario-2.jpg" alt="Chat 2" width={250} height={400} className="rounded-sm" />
          </div>
          <div className="border border-neutral-800 p-1 bg-neutral-900/5 rounded-sm transition-all duration-300 hover:border-emerald-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:bg-neutral-900/10 cursor-pointer">
            <Image src="/comentario-3.jpg" alt="Chat 3" width={250} height={400} className="rounded-sm" />
          </div>
          <div className="border border-neutral-800 p-1 bg-neutral-900/5 rounded-sm transition-all duration-300 hover:border-emerald-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:bg-neutral-900/10 cursor-pointer">
            <Image src="/comentario-4.jpg" alt="Chat 4" width={250} height={400} className="rounded-sm" />
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: TESTIMONIOS ESCRITOS - RE-ACTIVADOS E INTERACTIVOS */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-neutral-900/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Testimonio 1 - Interactivo */}
          <div className="p-8 border border-neutral-800 bg-neutral-900/10 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:scale-105 hover:bg-neutral-900/30 transition-all duration-300 cursor-pointer group">
            <p className="text-[11px] text-neutral-400 italic uppercase tracking-widest leading-loose group-hover:text-slate-100 transition-colors">
              "7 meses operando con KeyRules y la claridad es absoluta. Las entradas se volvieron milimétricas. Fundé mi confianza en la estadística pura de Lucas."
            </p>
            <div className="mt-6 text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
              — Gastón M. (Gestor)
            </div>
          </div>
          
          {/* Testimonio 2 - Interactivo */}
          <div className="p-8 border border-neutral-800 bg-neutral-900/10 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:scale-105 hover:bg-neutral-900/30 transition-all duration-300 cursor-pointer group">
            <p className="text-[11px] text-neutral-400 italic uppercase tracking-widest leading-loose group-hover:text-slate-100 transition-colors">
              "El Elite Program es un antes y un después. No solo es trading, es entender la física del mercado. Mi cuenta fondeada es el resultado."
            </p>
            <div className="mt-6 text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
              — Valentina R. (Elite Student)
            </div>
          </div>
          
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 text-center border-t border-neutral-900/50">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8">¿Sos alumno de KEYRULES?</h3>
        <a 
          href={`https://wa.me/${whatsappNumber}?text=Hola Lucas, soy alumno y quiero dejar mi testimonio.`} 
          className="px-10 py-5 text-[10px] font-black text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(16,185,129,0.05)]"
        >
          Enviar mi Resultado
        </a>
      </section>

      {/* FOOTER MINI */}
      <footer className="py-20 text-center border-t border-neutral-900">
        <div className="text-[8px] text-neutral-800 font-mono uppercase tracking-[0.5em] leading-loose max-w-3xl mx-auto px-6">
          AVISO LEGAL: LOS RESULTADOS MOSTRADOS SON DE ALUMNOS REALES PERO NO GARANTIZAN EL ÉXITO INDIVIDUAL. EL TRADING REQUIERE DISCIPLINA Y GESTIÓN DE RIESGO ESTRICTA.
        </div>
      </footer>
    </div>
  );
}