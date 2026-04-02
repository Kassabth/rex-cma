'use client';

import {
  headcountData,
  milestones,
  missionStats2024,
  missionStats2025,
  projections2026,
} from '@/data/content';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Tab2Evolution() {
  return (
    <div className="h-full scrollable pb-16">
      <div className="px-4 pt-4 space-y-8 pb-6">

        <div className="text-center animate-fade-in-up">
          <h1 className="text-2xl font-bold text-white">Évolution de la Mission</h1>
          <p className="text-sm text-white/50 mt-1">2024–2025 Bilan · 2026 Projections</p>
        </div>

        {/* ── Stats Comparison 2024 / 2025 ── */}
        <section>
          <SectionLabel>📈 Bilan comparatif</SectionLabel>
          <div className="grid grid-cols-2 gap-4">
            <StatBlock year="2024" stats={missionStats2024} color="text-blue-300" />
            <StatBlock year="2025" stats={missionStats2025} color="text-[#E30613]" />
          </div>
        </section>

        {/* ── Headcount Chart ── */}
        <section>
          <SectionLabel>👥 Évolution des effectifs</SectionLabel>
          <div className="glass-card rounded-2xl p-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={headcountData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003B6F" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#003B6F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorArchi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E30613" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#E30613" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="period"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                  interval={1}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0f2040',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: 12,
                  }}
                  labelStyle={{ color: 'white' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}
                />
                <Area
                  type="monotone"
                  dataKey="ea"
                  name="Enterprise Architecture"
                  stroke="#4a9eff"
                  fill="url(#colorEA)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="archi4it"
                  name="Archi4IT"
                  stroke="#E30613"
                  fill="url(#colorArchi)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── Milestones Timeline ── */}
        <section>
          <SectionLabel>🗓 Jalons clés 2024–2025</SectionLabel>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-white/10 rounded-full" />
            <div className="space-y-4 stagger-children">
              {milestones.map((m, i) => (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-4 top-2 w-3 h-3 rounded-full border-2 border-[#0a1628] ${
                      m.type === 'milestone'
                        ? 'bg-[#E30613]'
                        : m.type === 'deliverable'
                        ? 'bg-blue-400'
                        : 'bg-green-400'
                    }`}
                  />
                  <div className="glass-card p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wide">
                        {m.date}
                      </span>
                      <TypeBadge type={m.type} />
                    </div>
                    <p className="text-sm font-semibold text-white">{m.title}</p>
                    <p className="text-xs text-white/60 mt-0.5 leading-snug">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2026 Projections ── */}
        <section>
          <SectionLabel>🚀 Projections 2026</SectionLabel>

          {/* KPI targets */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Consultants cible', value: 18, suffix: '' },
              { label: 'Workstreams', value: 3, suffix: ' nvx' },
              { label: 'Livrables', value: 100, suffix: '+' },
            ].map((kpi) => (
              <div key={kpi.label} className="glass-card p-3 rounded-xl text-center">
                <div className="text-xl font-extrabold text-white">
                  <AnimatedCounter target={kpi.value} suffix={kpi.suffix} />
                </div>
                <div className="text-[10px] text-white/50 mt-0.5 leading-tight">{kpi.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 stagger-children">
            {projections2026.map((p, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl flex gap-3 items-start">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{p.title}</p>
                  <p className="text-xs text-white/60 leading-snug">{p.description}</p>
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

function StatBlock({
  year,
  stats,
  color,
}: {
  year: string;
  stats: { label: string; value: number; suffix: string }[];
  color: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-3">
      <div className={`text-lg font-extrabold ${color} mb-3 text-center`}>{year}</div>
      <div className="space-y-2">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center">
            <AnimatedCounter
              target={s.value}
              suffix={s.suffix}
              className={`text-xl font-bold ${color}`}
            />
            <span className="text-[10px] text-white/50 leading-tight mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    milestone: { label: 'Jalon', cls: 'bg-[#E30613]/20 text-[#E30613]' },
    deliverable: { label: 'Livrable', cls: 'bg-blue-500/20 text-blue-300' },
    team: { label: 'Équipe', cls: 'bg-green-500/20 text-green-300' },
  };
  const badge = map[type] || map.milestone;
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${badge.cls}`}>
      {badge.label}
    </span>
  );
}
