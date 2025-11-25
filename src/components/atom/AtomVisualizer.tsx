
"use client";

import { useEffect, useState, useMemo } from 'react';
import type { ElementData } from '@/lib/data';

interface AtomVisualizerProps {
  element: ElementData;
  speed: number;
  zoom: number;
}

const NUCLEUS_BASE_RADIUS = 30;
const PROTON_RADIUS = 5;
const NEUTRON_RADIUS = 5;
const ELECTRON_RADIUS = 4;
const SHELL_BASE_GAP = 35;


const generateRandomInCircle = (radius: number) => {
    const t = 2 * Math.PI * Math.random();
    const r = Math.sqrt(Math.random()) * radius;
    return {
        x: r * Math.cos(t),
        y: r * Math.sin(t),
    };
};

export default function AtomVisualizer({ element, speed, zoom }: AtomVisualizerProps) {
  const [nucleusParticles, setNucleusParticles] = useState<{ x: number; y: number; type: 'proton' | 'neutron' }[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const nucleusRadius = useMemo(() => NUCLEUS_BASE_RADIUS * zoom, [zoom]);
  const shellGap = useMemo(() => SHELL_BASE_GAP * zoom, [zoom]);

  useEffect(() => {
    if (!isClient) return;

    const particles = [];
    const particleCount = element.protons + element.neutrons;
    const effectiveRadius = nucleusRadius - Math.max(PROTON_RADIUS, NEUTRON_RADIUS);

    for (let i = 0; i < element.protons; i++) {
      particles.push({ ...generateRandomInCircle(effectiveRadius), type: 'proton' as const });
    }
    for (let i = 0; i < element.neutrons; i++) {
      particles.push({ ...generateRandomInCircle(effectiveRadius), type: 'neutron' as const });
    }
    
    // Shuffle particles for better visual distribution
    for (let i = particles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [particles[i], particles[j]] = [particles[j], particles[i]];
    }
    
    setNucleusParticles(particles);
  }, [element.protons, element.neutrons, isClient, nucleusRadius]);

  const shells = element.electronConfiguration;
  const maxShellRadius = nucleusRadius + shells.length * shellGap;
  const viewboxSize = (maxShellRadius + ELECTRON_RADIUS + 10) * 2;
  
  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center rounded-lg p-4">
        {/* Render a placeholder or nothing on the server */}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center rounded-lg p-4">
      <svg
        viewBox={`0 0 ${viewboxSize} ${viewboxSize}`}
        className="w-full h-full"
        aria-labelledby="atom-title"
        role="img"
      >
        <title id="atom-title">{element.name_bn} পরমাণুর গঠন</title>
        <defs>
          {shells.map((_, shellIndex) => {
            const shellRadius = nucleusRadius + (shellIndex + 1) * shellGap;
            return (
              <path
                key={`shell-path-def-${shellIndex}`}
                id={`shell-path-${shellIndex}`}
                d={`
                  M ${viewboxSize / 2 + shellRadius}, ${viewboxSize / 2}
                  a ${shellRadius},${shellRadius} 0 1,1 0,-0.0001
                  z
                `}
                fill="none"
              />
            );
          })}
        </defs>

        <g transform={`translate(${viewboxSize / 2}, ${viewboxSize / 2})`}>
          {/* Shells */}
          {shells.map((_, shellIndex) => {
            const shellRadius = nucleusRadius + (shellIndex + 1) * shellGap;
            return (
              <circle
                key={`shell-circle-${shellIndex}`}
                cx="0"
                cy="0"
                r={shellRadius}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
              />
            );
          })}

          {/* Nucleus */}
          <g>
            {nucleusParticles.map((p, i) => (
              <circle
                key={`particle-${i}`}
                cx={p.x}
                cy={p.y}
                r={p.type === 'proton' ? PROTON_RADIUS : NEUTRON_RADIUS}
                fill={p.type === 'proton' ? 'hsl(2, 88%, 60%)' : 'hsl(210, 8%, 70%)'}
              />
            ))}
          </g>

          {/* Electrons */}
          {shells.map((electronCount, shellIndex) => {
            const electronsInShell = [];
            const baseDuration = 30; // A higher base makes the slider effect more noticeable
            const minSpeedFactor = 0.1; // So it doesn't stop
            const maxSpeedFactor = 4;
            
            for (let i = 0; i < electronCount; i++) {
                
              const speedFactor = minSpeedFactor + ((100 - speed) / 100) * (maxSpeedFactor - minSpeedFactor);
              const duration = (baseDuration + shellIndex * 5) * speedFactor;

              const startOffset = i / electronCount;

              electronsInShell.push(
                <circle
                  key={`shell-${shellIndex}-electron-${i}`}
                  r={ELECTRON_RADIUS}
                  fill="hsl(var(--accent))"
                  style={{ filter: 'drop-shadow(0 0 4px hsl(var(--accent)))' }}
                >
                  <animateMotion
                    dur={`${duration}s`}
                    repeatCount="indefinite"
                    begin={`${-duration * startOffset}s`}
                  >
                    <mpath href={`#shell-path-${shellIndex}`} />
                  </animateMotion>
                </circle>
              );
            }
            return electronsInShell;
          }).flat()}
        </g>
      </svg>
    </div>
  );
}
