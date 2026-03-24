'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ADNPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans pb-20">
      
      {/* NAVBAR GLOBAL */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto border-b border-neutral-900">
        <Link href="/" className="flex items-center gap-5">
          <Image src="/logo-sello.jpg" alt="Logo" width={40} height={40} />
          <span className="text-xl font-black text-emerald-500 tracking-wider">ALG CAPITALS</span>
        </Link>
        <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-emerald-400 transition-colors">Volver al Home</Link>
      </nav>

      <section className="py-32 px-6 max-w-5xl mx-auto">
        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-12 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          Quant Research <br /> Division
        </h2>
        <div className="h-1 w-24 bg-emerald-500 mb-12 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <p className="text-sm text-neutral-400 leading-loose uppercase tracking-[0.2em] font-mono">
              ALG Capitals es la síntesis de 7 años de inmersión total en los mercados financieros. Forjado bajo el estudio riguroso de referentes como Larry Williams, Chris Lory, ICT e influencias cuánticas como De Prado.
            </p>
            <p className="text-sm text-neutral-400 leading-loose uppercase tracking-[0.2em] font-mono">
              Entendemos el mercado a través de Machine Learning, Microestructura y Stock Price Delivery Liquidity. No operamos con esperanza, operamos con física de mercados aplicada a la estadística pura.
            </p>
          </div>
          
          {/* IMAGEN DE ADN CORREGIDA (SIEMPRE NÍTIDA) */}
          <div className="border border-neutral-800 p-6 bg-neutral-900/10 rounded-sm shadow-[0_0_50px_rgba(16,185,129,0.05)]">
            <Image 
              src="/adn-lucas.jpg" 
              alt="Lucas ADN Institucional" 
              width={500} 
              height={700} 
              className="rounded-sm shadow-2xl transition-all duration-700"
              priority
            />
          </div>
        </div>
      </section>

      {/* FOOTER MINI PARA NAVEGACIÓN */}
      <footer className="mt-20 py-10 border-t border-neutral-900 text-center">
        <div className="text-[9px] text-neutral-700 uppercase tracking-[0.5em] font-black italic">
          © 2026 KEYRULES x ALG CAPITALS | QUANT RESEARCH DIVISION
        </div>
      </footer>
    </div>
  );
}