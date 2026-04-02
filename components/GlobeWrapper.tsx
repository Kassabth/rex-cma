'use client';

import dynamic from 'next/dynamic';
import { globePorts } from '@/data/content';
import { useState, useRef, useCallback, useEffect } from 'react';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';

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
  const [size, setSize] = useState({ width: 340, height: 360 });
  const [countries, setCountries] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stable click handler via ref — avoids stale closure inside htmlElement callback
  const handlePortClickRef = useRef<(name: string, fact: string, clientX: number, clientY: number) => void>();
  handlePortClickRef.current = (name, fact, clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      name,
      fact,
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      setTimeout(() => {
        if (globeRef.current) globeRef.current.controls().autoRotate = true;
      }, 5000);
    }
  };

  // Responsive sizing
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setSize({ width: w, height: Math.min(w, 380) });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Fetch country polygons from world-atlas topojson (~90 KB)
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
      .then((r) => r.json())
      .then((world: Topology<{ countries: GeometryCollection }>) => {
        const features = (topojson.feature(world, world.objects.countries) as any).features;
        setCountries(features);
      })
      .catch(console.error);
  }, []);

  // Globe controls on ready
  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globe.controls().enableZoom = false;
    // Start centred on Europe / Atlantic so Marseille is visible
    globe.pointOfView({ lat: 25, lng: 15, altitude: 2.0 }, 0);
  }, []);

  // Build HTML elements for port markers — large tap targets, visually a glowing dot
  const buildHtmlElement = useCallback((d: any) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = [
      'position: relative',
      'width: 44px',
      'height: 44px',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'cursor: pointer',
      '-webkit-tap-highlight-color: transparent',
    ].join(';');

    // Glow ring (purely visual, pointer-events: none)
    const ring = document.createElement('div');
    ring.style.cssText = [
      'position: absolute',
      'width: 22px',
      'height: 22px',
      'border-radius: 50%',
      'border: 2px solid rgba(227,6,19,0.45)',
      'animation: pulse-ring 2s infinite',
      'pointer-events: none',
    ].join(';');

    // Centre dot
    const dot = document.createElement('div');
    dot.style.cssText = [
      'width: 10px',
      'height: 10px',
      'border-radius: 50%',
      'background: #E30613',
      'box-shadow: 0 0 8px 3px rgba(227,6,19,0.7)',
      'pointer-events: none',
    ].join(';');

    wrapper.appendChild(ring);
    wrapper.appendChild(dot);

    // The entire 44×44 wrapper is the tap target
    wrapper.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      handlePortClickRef.current?.(d.name, d.fact, e.clientX, e.clientY);
    });
    // Also handle touchend for iOS
    wrapper.addEventListener('touchend', (e: TouchEvent) => {
      e.stopPropagation();
      const touch = e.changedTouches[0];
      if (touch) handlePortClickRef.current?.(d.name, d.fact, touch.clientX, touch.clientY);
    });

    return wrapper;
  }, []);

  return (
    <div ref={containerRef} className="relative w-full flex justify-center">
      {/* Inline keyframe for the ring pulse */}
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.8; }
          50%  { transform: scale(1.3);  opacity: 0.3; }
          100% { transform: scale(0.85); opacity: 0.8; }
        }
      `}</style>

      <Globe
        ref={globeRef}
        onGlobeReady={handleGlobeReady}
        width={size.width}
        height={size.height}
        // Dark ocean base + high-res land texture
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundImageUrl={null as any}
        backgroundColor="rgba(0,0,0,0)"
        // Subtle blue atmosphere — matches navy branding
        atmosphereColor="#1a5fa8"
        atmosphereAltitude={0.12}
        // Country polygons — correct shapes with visible borders
        polygonsData={countries}
        polygonCapColor={() => 'rgba(30, 60, 100, 0.55)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
        polygonStrokeColor={() => 'rgba(100, 160, 230, 0.45)'}
        polygonAltitude={0.006}
        // Port markers as HTML elements — proper 44px tap targets
        htmlElementsData={globePorts}
        htmlElement={buildHtmlElement}
        htmlAltitude={0.02}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 max-w-[210px] rounded-2xl shadow-2xl"
          style={{
            left: Math.min(Math.max(tooltip.x - 105, 8), size.width - 220),
            top: Math.max(tooltip.y - 110, 8),
            background: 'rgba(8, 18, 36, 0.97)',
            border: '1px solid rgba(227, 6, 19, 0.5)',
            boxShadow: '0 0 24px rgba(227,6,19,0.2)',
          }}
        >
          {/* Red header strip */}
          <div
            className="px-4 py-2 rounded-t-2xl flex items-center justify-between gap-2"
            style={{ background: 'rgba(227,6,19,0.15)', borderBottom: '1px solid rgba(227,6,19,0.25)' }}
          >
            <p className="font-bold text-sm text-white">{tooltip.name}</p>
            <button
              className="text-white/50 hover:text-white text-lg leading-none"
              onClick={() => setTooltip(null)}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-white/75 leading-relaxed px-4 py-3">{tooltip.fact}</p>
        </div>
      )}

      {/* Hint */}
      <p className="absolute bottom-2 text-center w-full text-[11px] text-white/30 pointer-events-none">
        Touchez un port • • •
      </p>
    </div>
  );
}
