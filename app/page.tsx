'use client';

import { useState } from 'react';
import Navigation, { type TabId } from '@/components/Navigation';
import Tab1Overview from '@/components/tabs/Tab1Overview';
import Tab2Evolution from '@/components/tabs/Tab2Evolution';
import Tab3Team from '@/components/tabs/Tab3Team';
import Tab4Domains from '@/components/tabs/Tab4Domains';
import Tab5Challenges from '@/components/tabs/Tab5Challenges';
import Tab6Chatbot from '@/components/tabs/Tab6Chatbot';

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  overview: Tab1Overview,
  evolution: Tab2Evolution,
  team: Tab3Team,
  domains: Tab4Domains,
  challenges: Tab5Challenges,
  chatbot: Tab6Chatbot,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="flex flex-col h-full bg-[#0a1628]">
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-4 pt-safe h-12 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/8 z-40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-widest text-[#E30613] uppercase">
            Devoteam
          </span>
          <span className="text-white/20 text-xs">×</span>
          <span className="text-xs font-semibold tracking-widest text-white/70 uppercase">
            CMA CGM
          </span>
        </div>
        <span className="text-xs text-white/30 font-medium">REX 2024–2025</span>
      </header>

      {/* Tab Content */}
      <main className="flex-1 overflow-hidden">
        <ActiveComponent />
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
