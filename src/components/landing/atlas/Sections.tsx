import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Hash, Lock, Plus, Send } from 'lucide-react';
import { Robot, RobotOutfit } from './Robot';
import { BlueprintRobot } from './BlueprintRobot';

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

const EASE_OUT: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: EASE_OUT },
});

/** Renders [[wikilinks]] in purple and **bold** text. */
export const rich = (text: string) =>
  text.split(/(\[\[[^\]]+\]\]|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('[[') && part.endsWith(']]'))
      return (
        <span key={i} className="text-[#6d55bd] font-medium">
          {part.slice(2, -2)}
        </span>
      );
    if (part.startsWith('**') && part.endsWith('**'))
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });

/** Scales a fixed-size stage down to fit its container width. */
const useFitScale = (baseWidth: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / baseWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);
  return [ref, scale] as const;
};

/** True while the element is on screen; used to pause timers off-screen. */
const useOnScreen = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
};

const useCycle = (length: number, ms: number, running: boolean) => {
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % length), ms);
    return () => clearTimeout(t);
  }, [i, tick, length, ms, running]);
  const go = (n: number) => {
    setI(((n % length) + length) % length);
    setTick((t) => t + 1);
  };
  return [i, go] as const;
};

const UserAvatar: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <div
    className="shrink-0 rounded-lg bg-gradient-to-br from-[#ffd6a5] to-[#ff9fb2] flex items-center justify-center text-[12px] font-semibold text-black/70"
    style={{ width: size, height: size }}
  >
    You
  </div>
);

const BotAvatar: React.FC<{ size?: number; hue?: number }> = ({ size = 36, hue }) => (
  <div
    className="shrink-0 rounded-lg bg-[#0b1f45] overflow-hidden flex items-center justify-center"
    style={{ width: size, height: size }}
  >
    <Robot awake track={false} crop="head" hue={hue} className="w-[88%] h-[88%]" />
  </div>
);

type Msg = { who: 'you' | 'ai'; time: string; text: string };

const Message: React.FC<{ m: Msg; hue?: number; delay?: number; compact?: boolean }> = ({ m, hue, delay = 0, compact }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    className="flex gap-3"
  >
    {m.who === 'you' ? <UserAvatar size={compact ? 32 : 36} /> : <BotAvatar size={compact ? 32 : 36} hue={hue} />}
    <div className="min-w-0">
      <div className="text-[13px] flex items-center gap-1.5">
        <span className="font-semibold">{m.who === 'you' ? 'You' : 'Vault AI'}</span>
        {m.who === 'ai' && (
          <span className="text-[9.5px] font-semibold tracking-wide bg-black/5 text-black/55 px-1 py-0.5 rounded">AGENT</span>
        )}
        <span className="text-black/40 text-[11.5px]">{m.time}</span>
      </div>
      <p className="text-[14px] leading-[1.5] text-black/85">{rich(m.text)}</p>
    </div>
  </motion.div>
);

const SplitCopy: React.FC<{ title: React.ReactNode; body: string; className?: string }> = ({ title, body, className }) => (
  <motion.div {...inView()} className={className}>
    <h2 className="atlas-display atlas-h2-sm">{title}</h2>
    <p className="mt-4 text-[16px] leading-[1.6] text-black/70 max-w-[440px]">{body}</p>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* 1. Connected to every model                                         */
/* ------------------------------------------------------------------ */

const MODEL_CHIPS = [
  'Claude 3.7 Sonnet',
  'GPT-4o',
  'Gemini 2.0 Flash',
  'Claude 3.5 Sonnet',
  'Gemini 1.5 Pro',
  'Custom endpoint',
  'Claude 3.5 Haiku',
  'o1',
  'DeepSeek',
  'o3',
  'Offline mode',
];

const STAGE_W = 560;
const STAGE_H = 470;
const DOME_CX = 280;
const DOME_CY = 300;

const domeChips = (() => {
  const outer = MODEL_CHIPS.slice(0, 7);
  const inner = MODEL_CHIPS.slice(7);
  const place = (labels: string[], radii: number[], from: number, to: number) =>
    labels.map((label, i) => {
      const a = ((from + ((to - from) * i) / (labels.length - 1)) * Math.PI) / 180;
      const r = radii[i % radii.length];
      return { label, a, x: DOME_CX + r * Math.cos(a), y: DOME_CY + r * Math.sin(a) };
    });
  return [...place(outer, [232, 264], 188, 352), ...place(inner, [158], 218, 322)];
})();

const domeDots = (() => {
  let s = 3;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: 34 }, () => {
    const a = ((185 + rnd() * 170) * Math.PI) / 180;
    const r = 120 + rnd() * 150;
    return { x: DOME_CX + r * Math.cos(a), y: DOME_CY + r * Math.sin(a), r: 1.5 + rnd() * 2 };
  });
})();

const ANTENNA = { x: DOME_CX, y: 202 };

const Laptop: React.FC = () => (
  <svg viewBox="0 0 260 150" className="w-full h-auto" aria-hidden="true">
    <defs>
      <linearGradient id="lp-lid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f3f4f7" />
        <stop offset="100%" stopColor="#cfd3db" />
      </linearGradient>
      <linearGradient id="lp-base" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e4e6eb" />
        <stop offset="100%" stopColor="#b8bdc7" />
      </linearGradient>
      <filter id="lp-shadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#1b2233" floodOpacity="0.16" />
      </filter>
    </defs>
    <g filter="url(#lp-shadow)">
      <rect x="20" y="0" width="220" height="136" rx="10" fill="url(#lp-lid)" stroke="#c3c8d1" />
      <rect x="0" y="134" width="260" height="10" rx="5" fill="url(#lp-base)" />
      <g transform="translate(130 66)" fill="none" stroke="#b9bec8" strokeWidth="4" strokeLinecap="round">
        <line x1="-8" y1="2" x2="10" y2="-6" />
        <line x1="-8" y1="2" x2="6" y2="16" />
        <line x1="10" y1="-6" x2="6" y2="16" />
        <circle cx="-8" cy="2" r="5" fill="#dde0e6" />
        <circle cx="10" cy="-6" r="4.5" fill="#dde0e6" />
        <circle cx="6" cy="16" r="4.5" fill="#dde0e6" />
      </g>
    </g>
  </svg>
);

export const ModelsSection: React.FC = () => {
  const [fitRef, scale] = useFitScale(STAGE_W);
  const [screenRef, onScreen] = useOnScreen<HTMLDivElement>();
  const [active] = useCycle(domeChips.length, 1700, onScreen);
  const chip = domeChips[active];
  const gaze = { x: Math.cos(chip.a) * 0.9, y: -0.75 };

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24" ref={screenRef}>
      <div className="max-w-[1080px] mx-auto grid md:grid-cols-2 gap-10 md:gap-6 items-center">
        <SplitCopy
          title={
            <>
              Connected to
              <br />
              every model.
            </>
          }
          body="Pick Claude, GPT, Gemini or DeepSeek, or point it at any OpenAI-compatible endpoint. Switch models mid-thought and your graph stays the same. No key yet? Offline mode still expands your notes."
        />

        <motion.div {...inView(0.1)} ref={fitRef} className="relative w-full" style={{ height: STAGE_H * scale }}>
          <div
            className="absolute top-0 left-1/2"
            style={{ width: STAGE_W, height: STAGE_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top center' }}
          >
            {/* beam */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
              {domeDots.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#d4d7de" />
              ))}
              <motion.line
                key={active}
                x1={ANTENNA.x}
                y1={ANTENNA.y}
                x2={chip.x}
                y2={chip.y}
                stroke="#4f8cff"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
              <motion.circle
                key={`p-${active}`}
                r="3.5"
                fill="#4f8cff"
                initial={{ cx: chip.x, cy: chip.y, opacity: 0 }}
                animate={{ cx: [chip.x, ANTENNA.x], cy: [chip.y, ANTENNA.y], opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, delay: 0.5, ease: 'easeIn' }}
              />
            </svg>

            {/* chips */}
            {domeChips.map((c, i) => (
              <motion.div
                key={c.label}
                className="absolute"
                style={{ left: c.x, top: c.y }}
                animate={{ scale: i === active ? 1.08 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div
                  className={`-translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[12px] font-medium tracking-[-0.01em] shadow-[0_1px_2px_rgba(15,10,20,0.12)] transition-shadow ${
                    i === active ? 'ring-2 ring-[#4f8cff] text-black' : 'ring-1 ring-black/[0.07] text-black/70'
                  }`}
                >
                  {c.label}
                </div>
              </motion.div>
            ))}

            {/* robot + laptop */}
            <div className="absolute overflow-hidden" style={{ left: DOME_CX - 115, top: 170, width: 230, height: 288, paddingTop: 20, paddingLeft: 10, paddingRight: 10 }}>
              <Robot awake gaze={gaze} className="w-full h-auto" />
            </div>
            <div className="absolute" style={{ left: DOME_CX - 130, top: 318, width: 260 }}>
              <Laptop />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 2. A thread beside every note                                      */
/* ------------------------------------------------------------------ */

const THREADS: { note: string; msgs: Msg[] }[] = [
  {
    note: 'thesis-draft',
    msgs: [
      { who: 'ai', time: '9:00 AM', text: 'Morning recap: you added 3 notes to [[Chapter 2]] yesterday and left a TODO on **sources**.' },
      { who: 'you', time: '9:03 AM', text: 'Pull in the sources I flagged.' },
      { who: 'ai', time: '9:03 AM', text: 'Found 4 in your [[Reading log]]. Linked them under **Sources** in [[Chapter 2]].' },
    ],
  },
  {
    note: 'reading-log',
    msgs: [
      { who: 'you', time: '8:12 PM', text: 'What did I highlight in my notes on decision making?' },
      { who: 'ai', time: '8:12 PM', text: '11 highlights in two clusters: **fast vs slow thinking** and **anchoring**. Want them as notes?' },
      { who: 'you', time: '8:13 PM', text: 'Yes, and link both to [[Memory]].' },
      { who: 'ai', time: '8:13 PM', text: 'Done. 2 new notes, both linked to [[Memory]].' },
    ],
  },
  {
    note: 'side-project',
    msgs: [
      { who: 'you', time: '6:40 PM', text: 'Turn my scattered notes on the app idea into a plan.' },
      { who: 'ai', time: '6:41 PM', text: 'Pulled 9 notes. Drafted [[App plan]] with **Problem**, **MVP** and **Open questions**.' },
      { who: 'you', time: '6:44 PM', text: 'Move the pricing ideas out of MVP.' },
      { who: 'ai', time: '6:44 PM', text: 'Moved to [[Later]] and linked it from the plan.' },
    ],
  },
  {
    note: 'daily-notes',
    msgs: [
      { who: 'ai', time: '10:15 PM', text: 'You mentioned **sleep** in 5 daily notes this week. Make it a topic?' },
      { who: 'you', time: '10:16 PM', text: 'Sure.' },
      { who: 'ai', time: '10:16 PM', text: 'Created [[Sleep]] and linked it from all 5 days.' },
    ],
  },
];

export const ThreadsSection: React.FC = () => {
  const [screenRef, onScreen] = useOnScreen<HTMLDivElement>();
  const [index, go] = useCycle(THREADS.length, 6500, onScreen);
  const n = THREADS.length;

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24" ref={screenRef}>
      <div className="max-w-[1080px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div {...inView()} className="order-2 md:order-1">
          <div className="relative h-[372px] max-w-[460px]">
            {THREADS.map((t, k) => {
              const depth = (k - index + n) % n;
              return (
                <motion.div
                  key={t.note}
                  className="absolute inset-x-0 rounded-2xl bg-white ring-1 ring-black/[0.07] shadow-[0_12px_40px_-12px_rgba(15,10,30,0.18)] overflow-hidden"
                  animate={{
                    top: (n - 1 - depth) * 16,
                    scale: 1 - depth * 0.035,
                    opacity: depth === 0 ? 1 : 1 - depth * 0.15,
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                  style={{ zIndex: 10 - depth, height: 316, transformOrigin: 'top center' }}
                >
                  <div
                    className={`flex gap-1 h-9 px-4 border-b border-black/5 text-[13px] leading-4 font-semibold text-black/70 ${
                      depth === 0 ? 'items-center' : 'items-start pt-0.5'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 text-black/40" /> {t.note}
                  </div>
                  {depth === 0 && (
                    <div key={`${t.note}-${index}`} className="px-4 py-4 space-y-3.5">
                      {t.msgs.map((m, i) => (
                        <Message key={i} m={m} compact delay={0.15 + i * 0.35} />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-3 mt-5 max-w-[460px]">
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous thread"
              className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 bg-black/[0.04] rounded-full px-2.5 py-2">
              {THREADS.map((t, k) => (
                <button
                  key={t.note}
                  onClick={() => go(k)}
                  aria-label={`Show ${t.note}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${k === index ? 'w-5 bg-black/70' : 'w-1.5 bg-black/25'}`}
                />
              ))}
            </div>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next thread"
              className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <SplitCopy
          className="order-1 md:order-2"
          title={
            <>
              A thread beside
              <br />
              every note.
            </>
          }
          body="Most AI tools live in a chat that forgets what you were working on. Here the conversation sits next to your notes. Every answer knows which note you're on, and everything it writes lands back in your vault as linked markdown."
        />
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Grounded, never guessing                                         */
/* ------------------------------------------------------------------ */

const GROUNDED_ROWS = [
  { k: 'Source', v: 'From your [[Reading log]], not the web' },
  { k: 'Shorthand', v: '"ZK" means Zettelkasten' },
  { k: 'Style', v: 'Bullets first, then a TL;DR' },
  { k: 'New ideas', v: 'Filed under AI Discoveries' },
  { k: 'Links', v: 'Backlinked to the note you are on' },
  { k: 'Correction', v: "It's Luhmann, not Luhman" },
];

const VISOR_TEXTS = ['Checking your notes', '"ZK" = Zettelkasten', 'Bullets, then a TL;DR', 'Filed as a discovery', 'Linking back…', 'Luhmann, got it'];

export const GroundedSection: React.FC = () => {
  const [screenRef, onScreen] = useOnScreen<HTMLDivElement>();
  const [i] = useCycle(GROUNDED_ROWS.length, 2200, onScreen);
  const rows = [0, 1, 2].map((o) => ({ ...GROUNDED_ROWS[(i + o) % GROUNDED_ROWS.length], o }));

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24" ref={screenRef}>
      <div className="max-w-[1080px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <SplitCopy
          title={
            <>
              Grounded,
              <br />
              never guessing.
            </>
          }
          body="Answers come from your own notes: your shorthand, your sources, your links. When the AI adds something new, it files it under AI Discoveries, so you always know what you wrote and what it wrote."
        />

        <motion.div {...inView(0.1)} className="flex flex-col items-center">
          <div className="w-[260px] h-[270px] overflow-hidden">
            <Robot awake visor="stars" visorText={VISOR_TEXTS[i]} className="w-full h-auto" />
          </div>
          <div className="relative -mt-12 w-full max-w-[400px] space-y-2.5">
            <AnimatePresence initial={false} mode="popLayout">
              {rows.map((r) => (
                <motion.div
                  key={r.k}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: r.o === 2 ? 0.45 : 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="flex items-center rounded-2xl bg-white/95 backdrop-blur ring-1 ring-black/[0.07] shadow-[0_8px_24px_-10px_rgba(15,10,30,0.18)] px-5 py-3.5 text-[14px]"
                >
                  <span className="w-[92px] shrink-0 text-black/45">{r.k}</span>
                  <span className="w-px h-5 bg-black/10 mr-4" />
                  <span className="text-black/85">{rich(r.v)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 4. One vault, many minds                                            */
/* ------------------------------------------------------------------ */

type Persona = {
  model: string;
  slug: string;
  role: string;
  outfit: RobotOutfit;
  hue: number;
  goodAt: string[];
  note: string;
  prompt: string;
  reply: string;
};

const PERSONAS: Persona[] = [
  {
    model: 'Claude 3.7 Sonnet',
    slug: 'claude-3-7-sonnet',
    role: 'Deep research',
    outfit: 'headset',
    hue: 180,
    goodAt: ['Long notes', 'Careful linking', 'Summaries'],
    note: 'thesis-draft',
    prompt: 'Read my [[Thesis draft]] and list the weakest arguments.',
    reply: 'Three stand out. The one in **Section 2** leans on a single source, so I linked two counterpoints from your [[Reading log]].',
  },
  {
    model: 'GPT-4o',
    slug: 'gpt-4o',
    role: 'Drafting',
    outfit: 'hoodie',
    hue: 330,
    goodAt: ['First drafts', 'Rewrites', 'Outlines'],
    note: 'side-project',
    prompt: 'Turn [[App plan]] into a one-page brief.',
    reply: 'Drafted [[App brief]] with problem, audience, MVP and risks. It links back to every note I used.',
  },
  {
    model: 'Gemini 2.0 Flash',
    slug: 'gemini-2.0-flash',
    role: 'Quick ideas',
    outfit: 'sweater',
    hue: 262,
    goodAt: ['Brainstorms', 'Titles', 'Fast answers'],
    note: 'writing',
    prompt: 'Give me 10 title ideas for my essay on [[Habits]].',
    reply: 'Here are 10. My pick: **"Small Loops, Big Change"**. I saved the full list to [[Habits]].',
  },
  {
    model: 'DeepSeek',
    slug: 'deepseek',
    role: 'Reasoning',
    outfit: 'vest',
    hue: 150,
    goodAt: ['Step-by-step', 'Consistency checks', 'Math'],
    note: 'daily-notes',
    prompt: 'Is my [[Sleep]] note consistent with what I logged this week?',
    reply: 'Mostly. Two daily notes contradict the 8-hour rule. I flagged both in [[Sleep]].',
  },
];

const LINEUP: { outfit: RobotOutfit; hue: number; w: number }[] = [
  { outfit: 'headset', hue: 180, w: 104 },
  { outfit: 'sweater', hue: 262, w: 124 },
  { outfit: 'coat', hue: 212, w: 160 },
  { outfit: 'hoodie', hue: 330, w: 124 },
  { outfit: 'vest', hue: 150, w: 104 },
];

export const TeamSection: React.FC = () => {
  const [screenRef, onScreen] = useOnScreen<HTMLDivElement>();
  const [p, go] = useCycle(PERSONAS.length, 6000, onScreen);
  const persona = PERSONAS[p];

  return (
    <section className="bg-[#f6f6f7] px-4 sm:px-6 pb-16 sm:pb-24 overflow-hidden" ref={screenRef}>
      <div className="max-w-[1080px] mx-auto flex flex-col items-center text-center">
        <motion.div {...inView()} className="flex items-end justify-center gap-1 sm:gap-3 -mt-px pt-10">
          {LINEUP.map((r, k) => (
            <div key={k} className="overflow-hidden" style={{ width: `clamp(${r.w * 0.55}px, ${r.w / 10}vw, ${r.w}px)`, aspectRatio: '400 / 470' }}>
              <Robot awake outfit={r.outfit} hue={r.hue} className="w-full h-auto" />
            </div>
          ))}
        </motion.div>

        <motion.h2 {...inView(0.05)} className="atlas-display atlas-h2 mt-8">
          One vault, many minds.
        </motion.h2>
        <motion.p {...inView(0.12)} className="atlas-lede mt-4 max-w-[560px]">
          Pick the model that fits the job: a careful one for research, a quick one for brainstorming. Switch any time
          from the chat panel. Your notes and links stay put.
        </motion.p>

        <motion.div {...inView(0.15)} className="atlas-bezel w-full mt-12 rounded-[28px] sm:rounded-[40px] p-2.5 sm:p-5 text-left">
          <div className="grid md:grid-cols-[1.35fr_1fr] gap-2.5 sm:gap-4">
            {/* chat */}
            <div className="rounded-[18px] bg-white overflow-hidden min-h-[300px] flex flex-col">
              <div className="flex items-center gap-1.5 h-12 px-5 border-b border-black/5 font-semibold text-[16px] tracking-[-0.01em]">
                <Hash className="w-4 h-4 text-black/45" /> {persona.note}
              </div>
              <div className="flex-1 px-5 py-4 space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div key={p} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <Message m={{ who: 'you', time: '11:02 AM', text: persona.prompt }} />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-2 text-[12px] text-black/45 pl-12"
                    >
                      <span className="h-px flex-1 bg-black/10" />
                      Model: {persona.model}
                      <span className="h-px flex-1 bg-black/10" />
                    </motion.div>
                    <Message m={{ who: 'ai', time: '11:02 AM', text: persona.reply }} hue={persona.hue} delay={1} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="px-5 pb-4">
                <div className="flex items-center justify-between rounded-xl ring-1 ring-black/10 px-3.5 py-2.5 text-black/40 text-[14px]">
                  <span>Ask your vault…</span>
                  <Send className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* persona card */}
            <div className="relative rounded-[18px] bg-white overflow-hidden min-h-[340px] flex flex-col">
              <div className="px-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={p}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="text-[18px] font-semibold tracking-[-0.01em]">{persona.model}</div>
                        <div className="text-[13px] text-black/50">{persona.role}</div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <span className="text-[11px] font-mono text-[#3b6fd8] bg-[#eaf1ff] rounded px-1.5 py-0.5 whitespace-nowrap">
                    {persona.slug}
                  </span>
                </div>
                <div className="mt-4 text-[10.5px] font-semibold tracking-[0.08em] text-black/40">GOOD AT</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {persona.goodAt.map((g) => (
                    <span key={g} className="text-[12px] rounded-md ring-1 ring-black/10 px-2 py-1 text-black/75">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={p}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                    className="w-[190px] h-[200px] overflow-hidden"
                  >
                    <Robot awake outfit={persona.outfit} hue={persona.hue} className="w-full h-auto" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="absolute bottom-3 right-3 flex gap-1.5">
                {PERSONAS.map((x, k) => (
                  <button
                    key={x.slug}
                    onClick={() => go(k)}
                    aria-label={`Show ${x.model}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${k === p ? 'w-4 bg-black/70' : 'w-1.5 bg-black/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Open source (dark blueprint)                                     */
/* ------------------------------------------------------------------ */

export const OpenSourceSection: React.FC = () => (
  <section className="atlas-blueprint relative overflow-hidden px-4 sm:px-6 pt-20 sm:pt-28">
    <div className="relative max-w-[1080px] mx-auto flex flex-col items-center text-center">
      <motion.h2 {...inView()} className="atlas-display atlas-h2 text-white">
        Open source.
        <br />
        Your keys, your server.
      </motion.h2>
      <motion.p {...inView(0.1)} className="mt-5 max-w-[560px] text-[16px] leading-[1.6] text-white/70">
        Brain Vault is open source, and you can run it on your own machine. API keys live in your server's .env,
        and requests go from your server to the provider you pick.
      </motion.p>
      <motion.div {...inView(0.2)} className="mt-12 w-[clamp(240px,34vw,400px)] aspect-[400/440] overflow-hidden">
        <BlueprintRobot className="w-full h-auto" />
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 6. Ready? steps                                                     */
/* ------------------------------------------------------------------ */

const StepMock: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <div className="rounded-[22px] p-2.5 h-[200px]" style={{ background: bg }}>
    <div className="h-full rounded-[14px] bg-white overflow-hidden shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]">{children}</div>
  </div>
);

export const StepsSection: React.FC<{ onOpen: () => void }> = ({ onOpen }) => (
  <section className="px-4 sm:px-6 py-20 sm:py-28">
    <div className="max-w-[1080px] mx-auto flex flex-col items-center">
      <motion.h2 {...inView()} className="atlas-display atlas-h2 text-center">
        Ready to meet your vault?
      </motion.h2>

      <div className="grid gap-8 md:gap-5 md:grid-cols-3 w-full mt-12">
        <motion.div {...inView(0.05)}>
          <StepMock bg="linear-gradient(160deg,#3d4bff 0%,#7d4fe0 45%,#ff5a36 100%)">
            <div className="flex items-center gap-1.5 mx-3 mt-3 rounded-md bg-black/[0.04] px-2.5 py-1.5 text-[11px] text-black/50">
              <Lock className="w-3 h-3" /> /demo
            </div>
            <div className="flex flex-col items-center mt-5">
              <BotAvatar size={34} />
              <div className="mt-2.5 text-[13px] font-semibold">Open Brain Vault?</div>
              <div className="flex gap-2 mt-3">
                <span className="text-[12px] rounded-md ring-1 ring-black/10 px-3 py-1">Not now</span>
                <span className="text-[12px] rounded-md bg-black text-white px-3 py-1">Open</span>
              </div>
            </div>
          </StepMock>
          <h3 className="mt-5 text-[15px] font-semibold">1.&nbsp; Open the vault</h3>
          <p className="mt-1.5 text-[14px] leading-[1.5] text-black/60">
            Launch the demo in your browser. No account, nothing to configure.
          </p>
        </motion.div>

        <motion.div {...inView(0.12)}>
          <StepMock bg="linear-gradient(160deg,#5b4bff 0%,#b267f0 50%,#f24d8a 100%)">
            <div className="flex items-center gap-1 h-9 px-3.5 border-b border-black/5 text-[12px] font-semibold text-black/70">
              <Hash className="w-3 h-3 text-black/40" /> spaced-repetition
            </div>
            <div className="px-3.5 pt-3 text-[13px] leading-[1.5] text-black/80">
              Reviewing at growing intervals beats cramming. See <span className="text-[#6d55bd]">[[Mem</span>
              <span className="inline-block w-px h-[1em] bg-black/70 align-[-2px] animate-pulse" />
            </div>
            <div className="mx-3.5 mt-2 w-[180px] rounded-lg ring-1 ring-black/10 shadow-[0_6px_16px_-6px_rgba(0,0,0,0.2)] text-[12px] overflow-hidden">
              <div className="px-2.5 py-1.5 bg-[#f1edff] text-[#4b36a8] font-medium">Memory</div>
              <div className="px-2.5 py-1.5 text-black/65">Memory Systems</div>
              <div className="px-2.5 py-1.5 text-black/40">+ Create “Mem”</div>
            </div>
          </StepMock>
          <h3 className="mt-5 text-[15px] font-semibold">2.&nbsp; Write with [[links]]</h3>
          <p className="mt-1.5 text-[14px] leading-[1.5] text-black/60">
            Type double brackets to link notes. Each link becomes an edge in your graph.
          </p>
        </motion.div>

        <motion.div {...inView(0.19)}>
          <StepMock bg="linear-gradient(160deg,#c03cff 0%,#f0457a 50%,#ff7a3d 100%)">
            <div className="flex items-center gap-1.5 h-9 px-3.5 border-b border-black/5 text-[12px] font-semibold text-black/70">
              <Plus className="w-3.5 h-3.5 text-black/40" /> Pick a model
            </div>
            <div className="p-3 flex flex-wrap gap-1.5">
              {MODEL_CHIPS.map((m, k) => (
                <span
                  key={m}
                  className={`text-[11px] rounded-full px-2 py-1 ring-1 ${
                    k === 0 ? 'ring-[#4f8cff] bg-[#eef4ff] text-[#2456c9]' : 'ring-black/10 text-black/65'
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>
          </StepMock>
          <h3 className="mt-5 text-[15px] font-semibold">3.&nbsp; Bring AI in when you're ready</h3>
          <p className="mt-1.5 text-[14px] leading-[1.5] text-black/60">
            The vault works on its own. Add a model when you want it to link, expand and recall for you.
          </p>
        </motion.div>
      </div>

      <motion.button {...inView(0.1)} onClick={onOpen} className="atlas-pill atlas-pill-lg mt-12">
        Open the demo
        <kbd className="ml-1 text-[11px] font-mono bg-white/15 rounded px-1.5 py-0.5">D</kbd>
      </motion.button>
      <a href="#faq" className="mt-4 text-[13px] text-black/50 underline underline-offset-4 decoration-black/20 hover:text-black">
        Frequently asked questions
      </a>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 7. FAQ                                                              */
/* ------------------------------------------------------------------ */

const FAQS = [
  { q: 'Is Brain Vault free?', a: 'Yes. It is a hobby project and the code is open source on GitHub.' },
  {
    q: 'Do I need an API key?',
    a: 'No. Without a key, the AI uses a built-in offline mode so you can try the graph and expansion. Add a key for Anthropic, OpenAI, Gemini or DeepSeek to use a real model.',
  },
  {
    q: 'Which models can I use?',
    a: 'Claude, GPT-4o and the o-series, Gemini and DeepSeek. You can also point it at any OpenAI-compatible endpoint with CUSTOM_AI_BASE_URL.',
  },
  {
    q: 'Where do my API keys go?',
    a: "Put them in the server's .env file, or paste one into the app. Requests go from your server to the provider you pick.",
  },
  {
    q: 'How do links work?',
    a: 'Type [[ and a note name. Each link becomes an edge in the graph, and notes the AI creates show up as new nodes.',
  },
  { q: 'Can I run it myself?', a: 'Yes. Clone the repo, run npm install, then npm run dev to start the client and the API server together.' },
];

export const FaqSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-4 sm:px-6 pb-20 sm:pb-28 scroll-mt-10">
      <div className="max-w-[760px] mx-auto">
        <motion.h2 {...inView()} className="atlas-display atlas-h2-sm text-center mb-10">
          Frequently asked questions
        </motion.h2>
        <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {FAQS.map((f, k) => {
            const isOpen = open === k;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : k)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left text-[16px] font-medium tracking-[-0.01em] cursor-pointer"
                >
                  {f.q}
                  <Plus className={`w-4 h-4 shrink-0 text-black/50 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-10 text-[15px] leading-[1.6] text-black/65">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 8. Footer with peeking robot                                        */
/* ------------------------------------------------------------------ */

export const RobotFooter: React.FC<{ onOpen: () => void; githubUrl: string }> = ({ onOpen, githubUrl }) => (
  <footer className="relative overflow-hidden h-[clamp(300px,36vw,440px)]">
    <motion.div
      initial={{ y: 80 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: EASE_OUT }}
      style={{ x: '-50%' }}
      className="absolute left-1/2 top-0 w-[clamp(220px,24vw,320px)]"
    >
      <Robot awake className="w-full h-auto" />
    </motion.div>
    <div className="absolute inset-x-0 bottom-0 z-10">
      <div className="mx-auto flex items-center justify-between gap-4 px-4 sm:px-8 py-5 text-[13px] text-black/50">
        <span>© {new Date().getFullYear()} Brain Vault · Built by Parth Pancholi</span>
        <div className="flex items-center gap-5">
          <button onClick={onOpen} className="hover:text-black transition-colors cursor-pointer">
            Demo
          </button>
          <a href={githubUrl} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </div>
  </footer>
);
