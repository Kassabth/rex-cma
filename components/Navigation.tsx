'use client';

import { Globe, TrendingUp, Users, Layers, Target, MessageCircle } from 'lucide-react';
import clsx from 'clsx';

export type TabId = 'overview' | 'evolution' | 'team' | 'domains' | 'challenges' | 'chatbot';

export interface Tab {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

export const TABS: Tab[] = [
  {
    id: 'overview',
    label: 'Présentation du Compte',
    shortLabel: 'Compte',
    icon: <Globe size={20} />,
  },
  {
    id: 'evolution',
    label: 'Évolution de la Mission',
    shortLabel: 'Mission',
    icon: <TrendingUp size={20} />,
  },
  {
    id: 'team',
    label: "L'Équipe Devoteam",
    shortLabel: 'Équipe',
    icon: <Users size={20} />,
  },
  {
    id: 'domains',
    label: "Domaines d'Intervention",
    shortLabel: 'Domaines',
    icon: <Layers size={20} />,
  },
  {
    id: 'challenges',
    label: 'Défis & Perspectives',
    shortLabel: 'Défis',
    icon: <Target size={20} />,
  },
  {
    id: 'chatbot',
    label: 'Ask Devoteam',
    shortLabel: 'Chat',
    icon: <MessageCircle size={20} />,
  },
];

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-md border-t border-white/10">
      <div className="flex items-stretch h-16 safe-area-bottom">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'flex-1 flex flex-col items-center justify-center gap-0.5 tap-target transition-all duration-200',
                'focus:outline-none active:scale-95',
                isActive
                  ? 'text-[#E30613]'
                  : 'text-white/40 hover:text-white/70'
              )}
              aria-label={tab.label}
            >
              <span
                className={clsx(
                  'transition-transform duration-200',
                  isActive && 'scale-110'
                )}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] font-medium leading-none truncate max-w-[52px]">
                {tab.shortLabel}
              </span>
              {isActive && (
                <span className="absolute top-0 h-0.5 w-8 bg-[#E30613] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
