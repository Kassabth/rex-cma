'use client';

import dynamic from 'next/dynamic';
import { globePorts } from '@/data/content';
import { useState, useRef, useCallback, useEffect } from 'react';

// react-globe.gl requires browser APIs — dynamic import with no SSR
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface PortTooltip {
  name: string;
  fact: string;
  x: number;
  y: number;
}

export default function GlobeWrapper() {
  const globeRef = useRef<any>(null);
  const [tooltip, setTooltip] = useState<PortTooltip | null>(null);
  const [size, setSize] = useState({ width: 340, height: 340 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive sizing
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setSize({ width: w, height: Math.min(w, 360) });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Auto-rotate
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.6;
    globe.controls().enableZoom = false;
    // Center on Europe/Mediterranean area
    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 }, 0);
  }, []);

  const handlePointClick = useCallback((point: any, event: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setTooltip({
      name: point.name,
      fact: point.fact,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    // Pause rotation on interaction
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      setTimeout(() => {
        if (globeRef.current) globeRef.current.controls().autoRotate = true;
      }, 4000);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full flex justify-center">
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundImageUrl={null as any}
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#003B6F"
        atmosphereAltitude={0.15}
        pointsData={globePorts}
        pointLat="lat"
        pointLng="lng"
        pointLabel=""
        pointColor={() => '#E30613'}
        pointAltitude={0.02}
        pointRadius={0.6}
        pointResolution={8}
        onPointClick={handlePointClick}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 max-w-[200px] p-3 rounded-xl shadow-2xl pointer-events-none"
          style={{
            left: Math.min(tooltip.x, size.width - 220),
            top: Math.max(tooltip.y - 90, 0),
            background: 'rgba(10, 22, 40, 0.95)',
            border: '1px solid rgba(227, 6, 19, 0.4)',
          }}
        >
          <p className="font-semibold text-sm text-white mb-1">{tooltip.name}</p>
          <p className="text-xs text-white/70 leading-snug">{tooltip.fact}</p>
          <button
            className="mt-2 text-xs text-[#E30613] font-medium pointer-events-auto"
            onClick={() => setTooltip(null)}
          >
            Fermer ×
          </button>
        </div>
      )}

      {/* Tap hint */}
      <p className="absolute bottom-1 text-center w-full text-xs text-white/30">
        Touchez un port pour en savoir plus
      </p>
    </div>
  );
}
