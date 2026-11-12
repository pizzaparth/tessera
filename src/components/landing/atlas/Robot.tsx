import React, { useEffect, useId, useRef } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export type RobotOutfit = 'none' | 'headset' | 'sweater' | 'coat' | 'hoodie' | 'vest';

type RobotProps = {
  /** Eyes open and glowing. False renders the dim, half-closed "asleep" face. */
  awake: boolean;
  /** Eyes and head follow the pointer. Ignored when `gaze` is set. */
  track?: boolean;
  /** Fixed gaze direction, each axis -1..1. Overrides pointer tracking. */
  gaze?: { x: number; y: number } | null;
  /** 'head' crops the SVG to the helmet only (used for small avatars). */
  crop?: 'full' | 'head';
  /** Eye glow hue (HSL degrees). */
  hue?: number;
  outfit?: RobotOutfit;
  /** 'stars' swaps the eyes for a night-sky visor with a caption. */
  visor?: 'glass' | 'stars';
  visorText?: string;
  className?: string;
};

const EYE_Y = 206;
const EYE_LEFT_X = 160;
const EYE_RIGHT_X = 240;

const OUTFIT_FABRIC: Record<Exclude<RobotOutfit, 'none'>, [string, string]> = {
  headset: ['#2f3f68', '#1f2b4a'],
  sweater: ['#c3b6fb', '#9d8cf0'],
  coat: ['#d3b58e', '#a98a63'],
  hoodie: ['#f8c0d4', '#e895b4'],
  vest: ['#9cc2ab', '#719b83'],
};

// Deterministic star field for the 'stars' visor
const STARS = (() => {
  let s = 7;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: 150 }, () => ({
    x: 92 + rnd() * 216,
    y: 130 + rnd() * 152,
    r: 0.4 + rnd() * 1.3,
    o: 0.35 + rnd() * 0.65,
    twinkle: rnd() < 0.18,
    d: 1.5 + rnd() * 2.5,
  }));
})();

/**
 * Original glossy robot mascot drawn in SVG. Eyes are layered radial glows
 * that wake up, blink at random and track the cursor.
 */
export const Robot: React.FC<RobotProps> = ({
  awake,
  track = true,
  gaze = null,
  crop = 'full',
  hue = 205,
  outfit = 'none',
  visor = 'glass',
  visorText,
  className,
}) => {
  const rawId = useId();
  const id = (name: string) => `${rawId.replace(/:/g, '')}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  const svgRef = useRef<SVGSVGElement>(null);

  // Eye state
  const lid = useMotionValue(awake ? 1 : 0.16);
  const glow = useMotionValue(awake ? 1 : 0.28);
  const glowOpacity = useTransform(glow, (g) => g * 0.75);
  const coreOpacity = useTransform(glow, (g) => 0.35 + g * 0.65);

  // Gaze
  const lookXRaw = useMotionValue(0);
  const lookYRaw = useMotionValue(0);
  const lookX = useSpring(lookXRaw, { stiffness: 140, damping: 18, mass: 0.6 });
  const lookY = useSpring(lookYRaw, { stiffness: 140, damping: 18, mass: 0.6 });
  const headTilt = useTransform(lookX, (x) => x * 0.18);

  // Wake / sleep transitions
  const wasAwake = useRef(awake);
  useEffect(() => {
    if (awake === wasAwake.current) return;
    wasAwake.current = awake;
    if (awake) {
      animate(glow, [0.28, 1, 0.55, 1], { duration: 0.7, times: [0, 0.35, 0.6, 1], ease: 'easeOut' });
      animate(lid, [0.16, 1, 0.08, 1], { duration: 0.75, times: [0, 0.45, 0.7, 1], ease: 'easeInOut' });
    } else {
      animate(glow, 0.28, { duration: 0.5 });
      animate(lid, 0.16, { duration: 0.5 });
    }
  }, [awake, glow, lid]);

  // Random blinking
  useEffect(() => {
    if (!awake) return;
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        const double = Math.random() < 0.25;
        animate(lid, double ? [1, 0.06, 1, 0.06, 1] : [1, 0.06, 1], {
          duration: double ? 0.42 : 0.2,
          ease: 'easeInOut',
        });
        schedule();
      }, 2600 + Math.random() * 3200);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [awake, lid]);

  // Fixed gaze
  const gx = gaze?.x;
  const gy = gaze?.y;
  useEffect(() => {
    if (gx === undefined || gy === undefined) return;
    lookXRaw.set(gx * 22);
    lookYRaw.set(gy * 14);
  }, [gx, gy, lookXRaw, lookYRaw]);

  // Pointer tracking
  const hasGaze = gx !== undefined;
  useEffect(() => {
    if (hasGaze) return;
    if (!track || !awake) {
      lookXRaw.set(0);
      lookYRaw.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * (crop === 'head' ? 0.6 : 0.38);
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      lookXRaw.set(clamp(dx) * 22);
      lookYRaw.set(clamp(dy) * 14);
    };
    const onLeave = () => {
      lookXRaw.set(0);
      lookYRaw.set(0);
    };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [hasGaze, track, awake, crop, lookXRaw, lookYRaw]);

  const viewBox = crop === 'head' ? '20 4 360 346' : '0 0 400 560';
  const fabric = outfit === 'none' ? null : OUTFIT_FABRIC[outfit];
  const bodyFill = fabric ? url('fabric') : url('shellBody');
  const armFill = fabric && outfit !== 'vest' ? url('fabricSide') : url('metalSide');
  const textWidth = visorText ? Math.min(200, visorText.length * 7.4 + 28) : 0;

  const eye = (cx: number) => (
    <motion.g style={{ scaleY: lid, originX: 0.5, originY: 0.72 }}>
      <motion.ellipse
        cx={cx}
        cy={EYE_Y}
        rx={34}
        ry={46}
        fill={url('eyeGlow')}
        filter={url('blurBig')}
        style={{ opacity: glowOpacity }}
      />
      <motion.ellipse
        cx={cx}
        cy={EYE_Y}
        rx={15.5}
        ry={27}
        fill={url('eyeCore')}
        filter={url('blurSoft')}
        style={{ opacity: coreOpacity }}
      />
    </motion.g>
  );

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label="Vault robot mascot"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={id('shell')} cx="36%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="42%" stopColor="#f6f7f9" />
          <stop offset="78%" stopColor="#dfe2e8" />
          <stop offset="100%" stopColor="#bfc4ce" />
        </radialGradient>
        <radialGradient id={id('shellBody')} cx="40%" cy="12%" r="95%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#eef0f3" />
          <stop offset="100%" stopColor="#c6cbd4" />
        </radialGradient>
        {fabric && (
          <>
            <radialGradient id={id('fabric')} cx="42%" cy="15%" r="95%">
              <stop offset="0%" stopColor={fabric[0]} />
              <stop offset="100%" stopColor={fabric[1]} />
            </radialGradient>
            <linearGradient id={id('fabricSide')} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={fabric[1]} />
              <stop offset="45%" stopColor={fabric[0]} />
              <stop offset="100%" stopColor={fabric[1]} />
            </linearGradient>
          </>
        )}
        <linearGradient id={id('metal')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f5f7" />
          <stop offset="100%" stopColor="#b5bbc6" />
        </linearGradient>
        <linearGradient id={id('metalSide')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9ced7" />
          <stop offset="45%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c3c8d1" />
        </linearGradient>
        <linearGradient id={id('bezel')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4d8df" />
          <stop offset="100%" stopColor="#f3f4f7" />
        </linearGradient>
        <radialGradient id={id('visor')} cx="50%" cy="58%" r="68%">
          {visor === 'stars' ? (
            <>
              <stop offset="0%" stopColor="#14254f" />
              <stop offset="60%" stopColor="#0b1634" />
              <stop offset="100%" stopColor="#050a1c" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor={`hsl(${hue} 70% 42%)`} />
              <stop offset="42%" stopColor={`hsl(${hue} 76% 30%)`} />
              <stop offset="78%" stopColor={`hsl(${hue} 80% 18%)`} />
              <stop offset="100%" stopColor={`hsl(${hue} 85% 10%)`} />
            </>
          )}
        </radialGradient>
        <radialGradient id={id('shimmer')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`hsl(${hue} 100% 68%)`} stopOpacity="0.55" />
          <stop offset="100%" stopColor={`hsl(${hue} 100% 68%)`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('eyeGlow')} cx="50%" cy="48%" r="50%">
          <stop offset="0%" stopColor={`hsl(${hue} 100% 84%)`} stopOpacity="0.9" />
          <stop offset="45%" stopColor={`hsl(${hue} 94% 66%)`} stopOpacity="0.45" />
          <stop offset="100%" stopColor={`hsl(${hue} 90% 56%)`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('eyeCore')} cx="50%" cy="46%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="38%" stopColor={`hsl(${hue} 100% 95%)`} />
          <stop offset="72%" stopColor={`hsl(${hue} 95% 78%)`} stopOpacity="0.85" />
          <stop offset="100%" stopColor={`hsl(${hue} 92% 66%)`} stopOpacity="0" />
        </radialGradient>
        <pattern id={id('pixels')} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect x="0.6" y="0.6" width="2.2" height="2.2" rx="0.6" fill={`hsl(${hue} 100% 80%)`} opacity="0.13" />
        </pattern>
        <clipPath id={id('visorClip')}>
          <rect x="92" y="130" width="216" height="152" rx="74" ry="70" />
        </clipPath>
        <filter id={id('blurBig')} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id={id('blurSoft')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        <filter id={id('highlight')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id('shadow')} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#1b2233" floodOpacity="0.14" />
        </filter>
      </defs>

      <g filter={url('shadow')}>
        {/* ---------- Body ---------- */}
        {crop === 'full' && (
          <g>
            {/* arms */}
            <rect x="52" y="398" width="50" height="180" rx="25" fill={armFill} />
            <rect x="298" y="398" width="50" height="180" rx="25" fill={armFill} />
            {!fabric && (
              <>
                <ellipse cx="77" cy="410" rx="22" ry="12" fill="#ffffff" opacity="0.7" filter={url('highlight')} />
                <ellipse cx="323" cy="410" rx="22" ry="12" fill="#ffffff" opacity="0.7" filter={url('highlight')} />
              </>
            )}

            {/* neck */}
            <rect x="156" y="322" width="88" height="48" rx="12" fill={url('metal')} />
            <rect x="144" y="352" width="112" height="18" rx="9" fill="#e8eaee" stroke="#cdd1d9" strokeWidth="1.5" />

            {/* torso */}
            <path
              d="M100 580 L100 446 C100 396 142 368 200 368 C258 368 300 396 300 446 L300 580 Z"
              fill={outfit === 'vest' ? url('shellBody') : bodyFill}
            />
            <ellipse
              cx="168"
              cy="402"
              rx="46"
              ry="14"
              fill="#ffffff"
              opacity={fabric && outfit !== 'vest' ? 0.25 : 0.9}
              filter={url('highlight')}
            />

            {outfit === 'none' && (
              <>
                {/* chest emblem: three linked nodes */}
                <g stroke="#cfd4dc" strokeWidth="5" strokeLinecap="round">
                  <line x1="184" y1="452" x2="218" y2="440" />
                  <line x1="184" y1="452" x2="210" y2="480" />
                  <line x1="218" y1="440" x2="210" y2="480" />
                </g>
                <g fill="#e6e9ee" stroke="#c3c8d1" strokeWidth="2.5">
                  <circle cx="184" cy="452" r="9" />
                  <circle cx="218" cy="440" r="8" />
                  <circle cx="210" cy="480" r="8" />
                </g>
              </>
            )}

            {fabric && (outfit === 'sweater' || outfit === 'headset') && (
              <>
                <ellipse cx="200" cy="374" rx="64" ry="15" fill={fabric[1]} />
                <ellipse cx="200" cy="371" rx="50" ry="9" fill={url('metal')} />
              </>
            )}

            {fabric && outfit === 'hoodie' && (
              <>
                <path
                  d="M112 384 C112 344 160 354 200 354 C240 354 288 344 288 384 C288 414 112 414 112 384 Z"
                  fill={fabric[1]}
                />
                <ellipse cx="200" cy="376" rx="54" ry="12" fill={url('metal')} />
                <g stroke="#ffffff" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round">
                  <line x1="182" y1="398" x2="178" y2="446" />
                  <line x1="218" y1="398" x2="222" y2="446" />
                </g>
                <path d="M140 500 L260 500 L250 560 L150 560 Z" fill={fabric[1]} opacity="0.55" />
              </>
            )}

            {fabric && outfit === 'coat' && (
              <>
                <path d="M166 370 L200 452 L234 370 Z" fill="#f6f6f4" />
                <path d="M154 372 L200 470 M246 372 L200 470" stroke={fabric[1]} strokeWidth="10" strokeLinecap="round" />
                <ellipse cx="200" cy="372" rx="58" ry="12" fill={fabric[1]} />
                <ellipse cx="200" cy="369" rx="46" ry="8" fill={url('metal')} />
                {[480, 512, 544].map((y) => (
                  <g key={y} fill={fabric[1]}>
                    <circle cx="186" cy={y} r="5" />
                    <circle cx="214" cy={y} r="5" />
                  </g>
                ))}
              </>
            )}

            {fabric && outfit === 'vest' && (
              <>
                <path d="M100 580 L100 446 C100 404 136 376 172 372 L196 470 L196 580 Z" fill={url('fabric')} />
                <path d="M300 580 L300 446 C300 404 264 376 228 372 L204 470 L204 580 Z" fill={url('fabric')} />
                {[490, 522, 554].map((y) => (
                  <circle key={y} cx="192" cy={y} r="4.5" fill={fabric[1]} />
                ))}
              </>
            )}
          </g>
        )}

        {/* ---------- Head ---------- */}
        <motion.g style={{ rotate: track || hasGaze ? headTilt : 0, originX: 0.5, originY: 1 }}>
          {/* antenna */}
          <rect x="194" y="26" width="12" height="46" rx="6" fill={url('metal')} />
          <circle cx="200" cy="26" r="16" fill={url('shell')} />
          <ellipse cx="195" cy="20" rx="6" ry="4" fill="#ffffff" opacity="0.9" />
          <rect x="156" y="62" width="88" height="26" rx="13" fill={url('shellBody')} />

          {/* ears */}
          <rect x="36" y="160" width="44" height="96" rx="22" ry="34" fill={url('metalSide')} />
          <rect x="320" y="160" width="44" height="96" rx="22" ry="34" fill={url('metalSide')} />

          {/* helmet */}
          <rect x="56" y="78" width="288" height="262" rx="132" ry="124" fill={url('shell')} />
          <ellipse cx="150" cy="104" rx="70" ry="16" fill="#ffffff" opacity="0.95" filter={url('highlight')} />

          {/* visor */}
          <rect x="82" y="120" width="236" height="172" rx="84" ry="80" fill={url('bezel')} />
          <rect x="92" y="130" width="216" height="152" rx="74" ry="70" fill={url('visor')} />
          <g clipPath={url('visorClip')}>
            {visor === 'stars' ? (
              <>
                {STARS.map((s, i) =>
                  s.twinkle ? (
                    <motion.circle
                      key={i}
                      cx={s.x}
                      cy={s.y}
                      r={s.r}
                      fill="#ffffff"
                      animate={{ opacity: [s.o, 0.1, s.o] }}
                      transition={{ duration: s.d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.03 }}
                    />
                  ) : (
                    <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={s.o * 0.8} />
                  ),
                )}
                <AnimatePresence mode="wait">
                  {visorText && (
                    <motion.g
                      key={visorText}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                    >
                      <rect
                        x={200 - textWidth / 2}
                        y={236}
                        width={textWidth}
                        height={26}
                        rx={13}
                        fill="#ffffff"
                        fillOpacity="0.16"
                        stroke="#ffffff"
                        strokeOpacity="0.25"
                      />
                      <text
                        x={200}
                        y={253.5}
                        textAnchor="middle"
                        fontSize="12.5"
                        fontWeight="500"
                        fontFamily="Inter, sans-serif"
                        fill="#ffffff"
                      >
                        {visorText}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <motion.ellipse
                  rx={110}
                  ry={70}
                  fill={url('shimmer')}
                  initial={{ cx: 150, cy: 240 }}
                  animate={{ cx: [150, 250, 210, 150], cy: [240, 220, 170, 240] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                />
                <rect x="92" y="130" width="216" height="152" fill={url('pixels')} />

                {/* eyes */}
                <motion.g style={{ x: lookX, y: lookY }}>
                  {eye(EYE_LEFT_X)}
                  {eye(EYE_RIGHT_X)}
                </motion.g>
              </>
            )}

            {/* glass reflection */}
            <path
              d="M112 176 C122 146 160 136 200 136 C240 136 278 146 288 176 C260 158 236 154 200 154 C164 154 140 158 112 176 Z"
              fill="#ffffff"
              opacity="0.07"
            />
          </g>

          {outfit === 'headset' && (
            <g>
              <path d="M58 196 C58 52 342 52 342 196" fill="none" stroke="#24262d" strokeWidth="14" strokeLinecap="round" />
              <rect x="26" y="152" width="54" height="108" rx="24" fill="#24262d" />
              <rect x="320" y="152" width="54" height="108" rx="24" fill="#24262d" />
              <rect x="34" y="162" width="14" height="88" rx="7" fill="#3a3d46" />
              <rect x="352" y="162" width="14" height="88" rx="7" fill="#3a3d46" />
              <path d="M56 250 C66 300 112 318 150 312" fill="none" stroke="#24262d" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx="154" cy="311" rx="10" ry="8" fill="#24262d" />
            </g>
          )}
        </motion.g>
      </g>
    </svg>
  );
};

export default Robot;
