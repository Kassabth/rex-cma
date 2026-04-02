'use client';

import { useState } from 'react';
import { practiceAreas } from '@/data/content';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export default function Tab4Domains() {
  const [expanded, setExpanded] = useState<string | null>('ea');

  return (
    <div className="h-full scrollable pb-16">
      <div className="px-4 pt-4 pb-6 space-y-6">

        <div className="text-center animate-fade-in-up">
          <h1 className="text-2xl font-bold text-white">Nos Domaines</h1>
          <p className="text-sm text-white/50 mt-1">Périmètres d&apos;intervention Devoteam</p>
        </div>

        {/* Position diagram */}
        <section className="glass-card rounded-2xl p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
            🗺 Positionnement Devoteam
          </p>
          <PositionDiagram />
        </section>

        {/* Practice Cards */}
        {practiceAreas.map((practice) => {
          const isOpen = expanded === practice.id;
          return (
            <div key={practice.id} className="rounded-2xl overflow-hidden border border-white/8">

              {/* Header */}
              <button
                className={clsx(
                  'w-full flex items-center gap-3 p-4 text-left transition-colors duration-200',
                  isOpen ? 'bg-white/8' : 'bg-white/4 hover:bg-white/6'
                )}
                onClick={() => setExpanded(isOpen ? null : practice.id)}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-none"
                  style={{ backgroundColor: practice.color + '40', border: `1px solid ${practice.color}60` }}
                >
                  {practice.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm">{practice.title}</p>
                  <p className="text-xs text-white/50">{practice.subtitle}</p>
                </div>
                <span className="text-white/40 flex-none">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-4 bg-white/3 animate-fade-in-up">
                  <div
                    className="text-xs font-medium italic py-2 px-3 rounded-lg mt-2"
                    style={{ borderLeft: `3px solid ${practice.color}`, background: practice.color + '15' }}
                  >
                    &ldquo;{practice.tagline}&rdquo;
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed">{practice.description}</p>

                  {/* Responsibilities */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                      Responsabilités
                    </p>
                    <ul className="space-y-1.5">
                      {practice.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                          <CheckCircle
                            size={14}
                            className="flex-none mt-0.5"
                            style={{ color: practice.color }}
                          />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tools */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                      Outils
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {practice.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: practice.color + '25', color: 'rgba(255,255,255,0.75)' }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* KPIs */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                      KPIs clés
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {practice.kpis.map((kpi, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-2 text-center"
                          style={{ background: practice.color + '20', border: `1px solid ${practice.color}30` }}
                        >
                          <p className="text-xs font-bold text-white">{kpi.value}</p>
                          <p className="text-[9px] text-white/50 mt-0.5 leading-tight">{kpi.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}

function PositionDiagram() {
  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* CMA CGM DSI Box */}
      <div className="w-full max-w-xs rounded-xl border border-white/20 bg-white/5 p-3 text-center">
        <p className="text-xs font-bold text-white/80">DSI CMA CGM</p>
        <p className="text-[10px] text-white/40">Direction des Systèmes d&apos;Information</p>
      </div>

      <div className="flex gap-2 items-center">
        <div className="h-5 w-0.5 bg-white/20" />
      </div>

      {/* Devoteam box with two practices */}
      <div className="w-full max-w-xs rounded-xl border border-[#E30613]/30 bg-[#E30613]/8 p-3">
        <p className="text-xs font-bold text-[#E30613] text-center mb-3">Devoteam</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[#003B6F]/50 border border-[#003B6F] p-2 text-center">
            <div className="text-base mb-0.5">🏛️</div>
            <p className="text-[10px] font-semibold text-blue-300">Enterprise</p>
            <p className="text-[10px] text-blue-300">Architecture</p>
          </div>
          <div className="rounded-lg bg-[#E30613]/20 border border-[#E30613]/50 p-2 text-center">
            <div className="text-base mb-0.5">⚙️</div>
            <p className="text-[10px] font-semibold text-red-300">Archi4IT</p>
            <p className="text-[10px] text-red-300">Opérationnel</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div className="h-5 w-0.5 bg-white/20" />
      </div>

      {/* Projects box */}
      <div className="w-full max-w-xs rounded-xl border border-white/10 bg-white/3 p-3 text-center">
        <p className="text-xs font-bold text-white/60">Équipes Projets CMA CGM</p>
        <p className="text-[10px] text-white/30">Delivery · Dev · Métier</p>
      </div>
    </div>
  );
}
