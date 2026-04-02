'use client';

import { cmaStats, partnershipTimeline, cmaFacts } from '@/data/content';
import AnimatedCounter from '@/components/AnimatedCounter';
import GlobeWrapper from '@/components/GlobeWrapper';

export default function Tab1Overview() {
  return (
    <div className="h-full scrollable pb-16">
      <div className="px-4 pt-4 space-y-8 pb-6">

        {/* ── Section Header ── */}
        <div className="text-center animate-fade-in-up">
          <h1 className="text-2xl font-bold text-white">CMA CGM</h1>
          <p className="text-sm text-white/50 mt-1">Le compte — Vue d&apos;ensemble</p>
        </div>

        {/* ── 1a. Interactive Globe ── */}
        <section>
          <SectionLabel>🌍 Hubs mondiaux</SectionLabel>
          <div className="rounded-2xl overflow-hidden border border-white/8 bg-[#0a1628]">
            <GlobeWrapper />
          </div>
        </section>

        {/* ── 1b. Key Stats ── */}
        <section>
          <SectionLabel>📊 Chiffres clés</SectionLabel>
          <div className="grid grid-cols-2 gap-3 stagger-children">
            {cmaStats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-4 rounded-2xl flex flex-col items-center text-center gap-1"
              >
                <div className="text-2xl font-extrabold text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-semibold text-[#E30613] leading-tight">
                  {stat.label}
                </div>
                <div className="text-[11px] text-white/40">{stat.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 1c. Partnership Timeline ── */}
        <section>
          <SectionLabel>🤝 Devoteam × CMA CGM — Historique</SectionLabel>
          <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-white/10 rounded-full" />

            <div className="space-y-5 stagger-children">
              {partnershipTimeline.map((item, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-[#E30613] border-2 border-[#0a1628] red-glow-sm" />
                  <div className="glass-card p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#E30613]">{item.year}</span>
                      <span className="text-xs font-semibold text-white">{item.title}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-snug">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 1d. Interesting Facts ── */}
        <section>
          <SectionLabel>💡 Le saviez-vous ?</SectionLabel>
          <div className="space-y-3 stagger-children">
            {cmaFacts.map((fact, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl flex gap-3">
                <span className="text-2xl flex-none">{fact.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{fact.title}</p>
                  <p className="text-xs text-white/60 leading-snug">{fact.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
      {children}
    </h2>
  );
}
