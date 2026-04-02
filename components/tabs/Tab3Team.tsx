'use client';

import { useState } from 'react';
import { teamData } from '@/data/content';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import clsx from 'clsx';

interface TeamNode {
  id: string;
  name: string;
  role: string;
  practice: 'management' | 'ea' | 'archi4it';
  currentProject: string;
  children: TeamNode[];
}

const PRACTICE_CONFIG = {
  management: {
    label: 'Direction',
    bg: 'bg-[#1a2a40]',
    border: 'border-white/20',
    badge: 'bg-white/10 text-white/70',
    dot: 'bg-white',
  },
  ea: {
    label: 'Enterprise Architecture',
    bg: 'bg-[#003B6F]/60',
    border: 'border-[#004d92]',
    badge: 'bg-[#003B6F] text-blue-200',
    dot: 'bg-blue-400',
  },
  archi4it: {
    label: 'Archi4IT',
    bg: 'bg-[#1a0608]/80',
    border: 'border-[#E30613]/50',
    badge: 'bg-[#E30613]/20 text-[#ff6b74]',
    dot: 'bg-[#E30613]',
  },
};

interface DetailCard {
  node: TeamNode;
}

export default function Tab3Team() {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<TeamNode | null>(null);

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full scrollable pb-16">
      <div className="px-4 pt-4 pb-6 space-y-6">

        <div className="text-center animate-fade-in-up">
          <h1 className="text-2xl font-bold text-white">L&apos;Équipe Devoteam</h1>
          <p className="text-sm text-white/50 mt-1">Mission CMA CGM — Structure organisationnelle</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 justify-center">
          {(Object.entries(PRACTICE_CONFIG) as [keyof typeof PRACTICE_CONFIG, typeof PRACTICE_CONFIG['ea']][]).map(
            ([key, cfg]) => (
              <span key={key} className="flex items-center gap-1.5 text-xs text-white/60">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            )
          )}
        </div>

        {/* Org Tree */}
        <OrgNode
          node={teamData as TeamNode}
          collapsed={collapsed}
          onToggle={toggleCollapse}
          onSelect={setSelected}
          depth={0}
        />

        <p className="text-center text-xs text-white/30">
          Touchez un membre pour voir son profil
        </p>

      </div>

      {/* Detail slide-up modal */}
      {selected && (
        <DetailModal node={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function OrgNode({
  node,
  collapsed,
  onToggle,
  onSelect,
  depth,
}: {
  node: TeamNode;
  collapsed: Set<string>;
  onToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (node: TeamNode) => void;
  depth: number;
}) {
  const cfg = PRACTICE_CONFIG[node.practice];
  const isCollapsed = collapsed.has(node.id);
  const hasChildren = node.children.length > 0;

  return (
    <div className={clsx('relative', depth > 0 && 'ml-4 mt-2')}>
      {/* Connector line */}
      {depth > 0 && (
        <div className="absolute -left-4 top-5 w-4 h-0.5 bg-white/10" />
      )}

      {/* Node card */}
      <button
        className={clsx(
          'w-full text-left rounded-xl p-3 border transition-all duration-200 active:scale-[0.98]',
          cfg.bg,
          cfg.border
        )}
        onClick={() => onSelect(node)}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full flex-none ${cfg.dot}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{node.name}</p>
            <p className="text-xs text-white/50 truncate">{node.role}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-none">
            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
              {cfg.label}
            </span>
            {hasChildren && (
              <span
                className="text-white/30 hover:text-white/60 p-1 rounded-md tap-target flex items-center justify-center"
                onClick={(e) => onToggle(node.id, e)}
              >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <div className="relative ml-4 border-l border-white/8 pl-0">
          {node.children.map((child) => (
            <OrgNode
              key={child.id}
              node={child}
              collapsed={collapsed}
              onToggle={onToggle}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DetailModal({ node, onClose }: { node: TeamNode; onClose: () => void }) {
  const cfg = PRACTICE_CONFIG[node.practice];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={clsx(
          'relative w-full rounded-t-3xl p-6 pb-10 border-t',
          cfg.bg,
          cfg.border
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 tap-target"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center text-xl`}>
            {node.practice === 'management' ? '👤' : node.practice === 'ea' ? '🏛️' : '⚙️'}
          </div>
          <div>
            <p className="font-bold text-white">{node.name}</p>
            <p className="text-sm text-white/60">{node.role}</p>
          </div>
        </div>

        <div className="space-y-3">
          <InfoRow label="Practice" value={cfg.label} />
          <InfoRow label="Projet actuel" value={node.currentProject} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-xl p-3">
      <p className="text-xs text-white/40 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}
