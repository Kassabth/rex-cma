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
}

interface ScreenPos {
  x: number;
  y: number;
  visible: boolean;
}

export default function GlobeWrapper() {
  const globeRef = useRef<any>(null);
  const [tooltip, setTooltip] = useState<PortTooltip | null>(null);
  const [size, setSize] = useState({ width: 340, height: 360 });
  const [countries, setCountries] = useState<any[]>([]);
  // Screen-space positions of each port, updated every animation frame
  const [portScreenPositions, setPortScreenPositions] = useState<ScreenPos[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const globeReadyRef = useRef(false);

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

  // Fetch country polygons
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
      .then((r) => r.json())
      .then((world: Topology<{ countries: GeometryCollection }>) => {
        const features = (topojson.feature(world, world.objects.countries) as any).features;
        setCountries(features);
      })
      .catch(console.error);
  }, []);

  // RAF loop: convert (lat,lng) → screen (x,y) every frame so buttons track rotation
  useEffect(() => {
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (!globeRef.current || !globeReadyRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const globeRadius = size.width / 2; // approx globe circle radius in px
      const cx = size.width / 2;
      const cy = size.height / 2;

      const positions: ScreenPos[] = globePorts.map((port) => {
        const coords = globeRef.current.getScreenCoords(port.lat, port.lng, 0.02);
        if (!coords) return { x: -999, y: -999, visible: false };
        const x = coords.x;
        const y = coords.y;
        // A port is visible if its screen position is inside the globe disc
        const dx = x - cx;
        const dy = y - cy;
        const visible = Math.sqrt(dx * dx + dy * dy) < globeRadius * 0.92;
        return { x, y, visible };
      });

      setPortScreenPositions(positions);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [size]);

  const handleGlobeReady = useCallback(() => {
    globeReadyRef.current = true;
    const globe = globeRef.current;
    if (!globe) return;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globe.controls().enableZoom = false;
    globe.pointOfView({ lat: 25, lng: 15, altitude: 2.0 }, 0);
  }, []);

  const handlePortTap = useCallback((port: (typeof globePorts)[0]) => {
    setTooltip({ name: port.name, fact: port.fact });
    // Pause rotation briefly
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      setTimeout(() => {
        if (globeRef.current) globeRef.current.controls().autoRotate = true;
      }, 5000);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full flex justify-center" style={{ height: size.height }}>
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.8);  opacity: 0.9; }
          50%  { transform: scale(1.4);  opacity: 0.25; }
          100% { transform: scale(0.8);  opacity: 0.9; }
        }
      `}</style>

      {/* Globe canvas */}
      <Globe
        ref={globeRef}
        onGlobeReady={handleGlobeReady}
        width={size.width}
        height={size.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundImageUrl={null as any}
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#1a5fa8"
        atmosphereAltitude={0.12}
        polygonsData={countries}
        polygonCapColor={() => 'rgba(30, 60, 100, 0.55)'}
        polygonSideColor={() => 'rgba(0,0,0,0)'}
        polygonStrokeColor={() => 'rgba(100,160,230,0.45)'}
        polygonAltitude={0.006}
      />

      {/* Port tap buttons — React DOM elements, positioned via screen coords.
          These sit on top of the canvas so touch events are never blocked. */}
      {portScreenPositions.map((pos, i) => {
        if (!pos.visible) return null;
        const port = globePorts[i];
        return (
          <button
            key={port.name}
            aria-label={`Port: ${port.name}`}
            onClick={() => handlePortTap(port)}
            style={{
              position: 'absolute',
              left: pos.x - 22,
              top: pos.y - 22,
              width: 44,
              height: 44,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              WebkitTapHighlightColor: 'transparent',
              // Centre the visual indicator within the tap target
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Pulsing ring */}
            <span
              style={{
                position: 'absolute',
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '2px solid rgba(227,6,19,0.5)',
                animation: 'pulse-ring 2s infinite',
                pointerEvents: 'none',
              }}
            />
            {/* Solid dot */}
            <span
              style={{
                display: 'block',
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: '#E30613',
                boxShadow: '0 0 7px 3px rgba(227,6,19,0.65)',
                pointerEvents: 'none',
              }}
            />
          </button>
        );
      })}

      {/* Tooltip — shown in the centre of the globe area, not at tap position,
          so it never gets clipped near edges */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            left: 12,
            right: 12,
            background: 'rgba(8,18,36,0.97)',
            border: '1px solid rgba(227,6,19,0.5)',
            boxShadow: '0 0 28px rgba(227,6,19,0.2)',
            borderRadius: 16,
            zIndex: 30,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'rgba(227,6,19,0.14)',
              borderBottom: '1px solid rgba(227,6,19,0.25)',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', margin: 0 }}>{tooltip.name}</p>
            <button
              onClick={() => setTooltip(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 20,
                lineHeight: 1,
                cursor: 'pointer',
                padding: '0 2px',
                WebkitTapHighlightColor: 'transparent',
              }}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', padding: '10px 14px', margin: 0, lineHeight: 1.5 }}>
            {tooltip.fact}
          </p>
        </div>
      )}

      {/* Hint */}
      <p
        style={{
          position: 'absolute',
          bottom: 8,
          width: '100%',
          textAlign: 'center',
          fontSize: 11,
          color: 'rgba(255,255,255,0.3)',
          pointerEvents: 'none',
          margin: 0,
        }}
      >
        Touchez un port • • •
      </p>
    </div>
  );
}
