// Force Update: v1.0.1 - Fix Clerk Production
import React from 'react';
import { UserButton } from "@clerk/nextjs";

const DashboardCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-zinc-900/50 border border-emerald-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300">
    <h3 className="text-emerald-400 font-bold mb-4 uppercase tracking-wider text-sm">{title}</h3>
    {children}
  </div>
);

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="mb-10 flex justify-between items-center bg-zinc-900/30 p-4 rounded-xl border border-emerald-500/10">
        <div>
          <h1 className="text-3xl font-bold text-white">Bienvenido al Elite Program, <span className="text-emerald-500 font-extrabold text-shadow-glow">Trader</span></h1>
          <p className="text-zinc-400 mt-2">Ejecutá tu plan. Respetá tu gestión. Dominá el mercado.</p>
        </div>
        
        {/* El botón de perfil con opción de salir */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500 uppercase tracking-widest hidden md:block font-bold">Cuenta Activa</span>
          <div className="p-1 rounded-full border border-emerald-500/40 bg-emerald-500/10">
            <UserButton />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Market Daily Bias - XAU/USD">
            <div className="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
              <span className="text-zinc-500 z-10 font-medium">Cargando video de visión diaria...</span>
            </div>
            <div className="mt-4 p-4 bg-emerald-500/5 rounded border-l-4 border-emerald-500">
              <p className="text-sm italic text-emerald-100/80">"Foco en la sesión de NY. Buscamos quiebre de estructura en M15."</p>
            </div>
          </DashboardCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard title="Continuar Entrenamiento">
              <p className="text-lg font-semibold text-white">Módulo 4: Order Blocks</p>
              <div className="w-full bg-zinc-800 h-2 mt-4 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[65%] shadow-[0_0_10px_#10b981]"></div>
              </div>
              <p className="text-xs text-zinc-500 mt-2 text-right">65% completado</p>
            </DashboardCard>
            <DashboardCard title="Acceso VIP">
              <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-400 text-black font-black rounded transition-all transform hover:scale-[1.02] uppercase text-xs tracking-widest">
                Discord Community
              </button>
            </DashboardCard>
          </div>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Funder Sync Status">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                <span className="text-xs text-zinc-400">FTMO Stage 1</span>
                <span className="text-emerald-500 font-mono font-bold">+$450.20</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                <span className="text-xs text-zinc-400">Alpha Capital</span>
                <span className="text-zinc-500 font-mono">En espera</span>
              </div>
            </div>
          </DashboardCard>
          <DashboardCard title="Recursos Elite">
            <ul className="text-sm space-y-3">
              <li className="text-zinc-300 hover:text-emerald-400 cursor-pointer flex items-center gap-2 transition-colors">
                <span>📁</span> Trading Journal 2026
              </li>
              <li className="text-zinc-300 hover:text-emerald-400 cursor-pointer flex items-center gap-2 transition-colors">
                <span>📉</span> Checklist Alta Probabilidad
              </li>
            </ul>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}