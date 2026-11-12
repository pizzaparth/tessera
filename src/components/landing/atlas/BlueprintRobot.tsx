import React from 'react';
import { motion } from 'framer-motion';

// Deterministic circuitry inside the helmet and torso
const CIRCUIT = (() => {
  let s = 11;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const chips: { x: number; y: number; w: number; h: number }[] = [];
  const traces: string[] = [];
  for (let i = 0; i < 46; i++) {
    const x = 60 + rnd() * 280;
    const y = 80 + rnd() * 480;
    chips.push({ x, y, w: 6 + rnd() * 16, h: 5 + rnd() * 12 });
  }
  for (let i = 0; i < 60; i++) {
    let x = 60 + rnd() * 280;
    let y = 80 + rnd() * 480;
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    for (let k = 0; k < 3; k++) {
      if (k % 2 === 0) x += (rnd() - 0.5) * 70;
      else y += (rnd() - 0.5) * 70;
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    traces.push(d);
  }
  return { chips, traces };
})();

const STROKE = '#4d8dff';

/** Wireframe "schematic" version of the robot for the dark section. */
export const BlueprintRobot: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 400 560" className={className} aria-hidden="true" style={{ overflow: 'visible' }}>
    <defs>
      <pattern id="bp-grid" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M8 0 L0 0 0 8" fill="none" stroke={STROKE} strokeOpacity="0.16" strokeWidth="0.6" />
      </pattern>
      <clipPath id="bp-body">
        <rect x="56" y="78" width="288" height="262" rx="132" ry="124" />
        <path d="M100 580 L100 446 C100 396 142 368 200 368 C258 368 300 396 300 446 L300 580 Z" />
        <rect x="156" y="322" width="88" height="48" rx="12" />
      </clipPath>
      <mask id="bp-visor-hole">
        <rect x="0" y="0" width="400" height="600" fill="#fff" />
        <rect x="82" y="120" width="236" height="172" rx="84" ry="80" fill="#000" />
      </mask>
      <linearGradient id="bp-scan" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={STROKE} stopOpacity="0" />
        <stop offset="50%" stopColor="#8fb8ff" stopOpacity="0.35" />
        <stop offset="100%" stopColor={STROKE} stopOpacity="0" />
      </linearGradient>
      <filter id="bp-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g filter="url(#bp-glow)">
      {/* interior */}
      <g clipPath="url(#bp-body)" mask="url(#bp-visor-hole)">
        <rect x="0" y="0" width="400" height="600" fill="url(#bp-grid)" />
        {CIRCUIT.traces.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={STROKE}
            strokeOpacity="0.55"
            strokeWidth="0.9"
            className={i % 4 === 0 ? 'bp-trace' : undefined}
          />
        ))}
        {CIRCUIT.chips.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={c.w}
            height={c.h}
            rx="1"
            fill="#0a1a3d"
            stroke={STROKE}
            strokeOpacity="0.75"
            strokeWidth="0.8"
          />
        ))}
        <motion.rect
          x="0"
          width="400"
          height="70"
          fill="url(#bp-scan)"
          initial={{ y: 40 }}
          animate={{ y: [40, 560, 40] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </g>

      {/* outlines */}
      <g fill="none" stroke={STROKE} strokeWidth="1.4">
        <rect x="194" y="26" width="12" height="46" rx="6" />
        <circle cx="200" cy="26" r="16" />
        <rect x="156" y="62" width="88" height="26" rx="13" />
        <rect x="36" y="160" width="44" height="96" rx="22" ry="34" />
        <rect x="320" y="160" width="44" height="96" rx="22" ry="34" />
        <rect x="56" y="78" width="288" height="262" rx="132" ry="124" />
        <rect x="82" y="120" width="236" height="172" rx="84" ry="80" />
        <rect x="92" y="130" width="216" height="152" rx="74" ry="70" strokeOpacity="0.5" />
        <rect x="156" y="322" width="88" height="48" rx="12" />
        <rect x="144" y="352" width="112" height="18" rx="9" />
        <path d="M100 580 L100 446 C100 396 142 368 200 368 C258 368 300 396 300 446 L300 580" />
        <rect x="52" y="398" width="50" height="180" rx="25" />
        <rect x="298" y="398" width="50" height="180" rx="25" />
      </g>

      {/* dimension marks */}
      <g stroke={STROKE} strokeOpacity="0.45" strokeWidth="0.8" fill={STROKE} fillOpacity="0.6" fontSize="8" fontFamily="ui-monospace, monospace">
        <line x1="56" y1="60" x2="344" y2="60" strokeDasharray="2 3" />
        <text x="352" y="63" stroke="none">288</text>
        <line x1="370" y1="78" x2="370" y2="340" strokeDasharray="2 3" />
        <text x="374" y="214" stroke="none">262</text>
      </g>
    </g>
  </svg>
);

export default BlueprintRobot;
