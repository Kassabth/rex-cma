'use client';

import { useState } from 'react';
import { challenges } from '@/data/content';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function Tab5Challenges() {
  const [openCard, setOpenCard] = useState<string | null>(challenges[0].id);

  return (
    <div className="h-full scrollable pb-16">
      <div className="px-4 pt-4 pb-6 space-y-6">

        <div className="text-center animate-fade-in-up">
          <h1 className="text-2xl font-bold text-white">Défis & Perspectives</h1>
          <p className="text-sm text-white/50 mt-1">Enjeux actuels · Plans de réponse</p>
        </div>

        {/* Challenge cards */}
        <div className="space-y-3 stagger-children">
          {challenges.map((challenge) => {
            const isOpen = openCard === challenge.id;
            return (
              <div
                key={challenge.id}
                className={clsx(
                  'rounded-2xl border overflow-hidden transition-all duration-300',
                  isOpen
                    ? 'border-[#E30613]/40 bg-[#1a0608]/60'
                    : 'border-white/8 bg-white/4'
                )}
              >
                {/* Card Header */}
                <button
                  className="w-full flex items-start gap-3 p-4 text-left tap-target"
                  onClick={() => setOpenCard(isOpen ? null : challenge.id)}
                >
                  <span className="text-2xl flex-none mt-0.5">{challenge.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{challenge.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-white/40">Impact :</span>
                      <span className={`text-[10px] font-bold ${challenge.impactColor}`}>
                        {challenge.impact}
                      </span>
                    </div>
                  </div>
                  <span className="text-white/30 flex-none mt-1">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-4 space-y-4 animate-fade-in-up">
                    {/* Description */}
                    <p className="text-sm text-white/70 leading-relaxed border-l-2 border-white/10 pl-3">
                      {challenge.description}
                    </p>

                    {/* Response plan */}
                    <div className="rounded-xl bg-white/5 border border-white/8 p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm">✅</span>
                        <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                          {challenge.response.title}
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {challenge.response.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2
                              size={14}
                              className="flex-none mt-0.5 text-green-400"
                            />
                            <span className="text-sm text-white/70 leading-snug">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary visual */}
        <section className="glass-card rounded-2xl p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
            🎯 Priorités 2026
          </p>
          <div className="space-y-3">
            {[
              { label: 'Scalabilité', progress: 35, color: '#E30613' },
              { label: 'Capitalisation', progress: 55, color: '#4a9eff' },
              { label: 'Alignement stakeholders', progress: 40, color: '#f59e0b' },
              { label: 'Cloud & Modernisation', progress: 20, color: '#10b981' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-white/60">{item.label}</span>
                  <span className="text-xs text-white/40">{item.progress}% résolu</span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/30 mt-3 text-center">
            TODO — Remplacer par des données réelles
          </p>
        </section>

      </div>
    </div>
  );
}
