"use client";

import { useEffect, useState } from 'react';
import type { ElementData } from '@/lib/data';

interface AtomVisualizerProps {
  element: ElementData;
}

const NUCLEUS_RADIUS = 30;
const PROTON_RADIUS = 5;
const NEUTRON_RADIUS = 5;
const ELECTRON_RADIUS = 4;
const SHELL_GAP = 35;

const generateRandomInCircle = (radius: number) => {
    // Ensure we run this only on the client
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    const t = 2 * Math.PI * Math.random();
    const r = Math.sqrt(Math.random()) * radius;
    return {
        x: r * Math.cos(t),
        y: r * Math.sin(t),
    };
};

export default function AtomVisualizer({ element }: AtomVisualizerProps) {
  const [nucleusParticles, setNucleusParticles] = useState<{ x: number; y: number; type: 'proton' | 'neutron' }[]>([]);

  useEffect(() => {
    const particles = [];
    const particleCount = element.protons + element.neutrons;
    const effectiveRadius = NUCLEUS_RADIUS - Math.max(PROTON_RADIUS, NEUTRON_RADIUS);

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
  }, [element.protons, element.neutrons]);

  const shells = element.electronConfiguration;
  const maxShellRadius = NUCLEUS_RADIUS + shells.length * SHELL_GAP;
  const viewboxSize = (maxShellRadius + ELECTRON_RADIUS + 10) * 2;
  
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] min-h-[400px] flex items-center justify-center bg-card rounded-lg p-4 shadow-lg">
      <svg
        viewBox={`0 0 ${viewboxSize} ${viewboxSize}`}
        className="w-full h-full"
        aria-labelledby="atom-title"
        role="img"
      >
        <title id="atom-title">{element.name_bn} পরমাণুর গঠন</title>
        <defs>
          {shells.map((_, shellIndex) => {
            const shellRadius = NUCLEUS_RADIUS + (shellIndex + 1) * SHELL_GAP;
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
            const shellRadius = NUCLEUS_RADIUS + (shellIndex + 1) * SHELL_GAP;
            return (
              <circle
                key={`shell-circle-${shellIndex}`}
                cx="0"
                cy="0"
                r={shellRadius}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Nucleus */}
          <g>
            <circle cx="0" cy="0" r={NUCLEUS_RADIUS} fill="hsl(var(--background))" opacity="0.5" />
            {nucleusParticles.map((p, i) => (
              <circle
                key={`particle-${i}`}
                cx={p.x}
                cy={p.y}
                r={p.type === 'proton' ? PROTON_RADIUS : NEUTRON_RADIUS}
                fill={p.type === 'proton' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
              />
            ))}
          </g>

          {/* Electrons */}
          {shells.map((electronCount, shellIndex) => {
            const electronsInShell = [];
            for (let i = 0; i < electronCount; i++) {
              const duration = 10 + shellIndex * 5 + Math.random() * 4 - 2;
              const startOffset = i / electronCount;

              electronsInShell.push(
                <circle
                  key={`shell-${shellIndex}-electron-${i}`}
                  r={ELECTRON_RADIUS}
                  fill="hsl(var(--accent))"
                  style={{ filter: 'drop-shadow(0 0 3px hsl(var(--accent)))' }}
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
