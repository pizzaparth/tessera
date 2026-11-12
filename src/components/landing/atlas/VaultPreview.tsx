import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, FileText, Hash, Network, Search, Send, Star } from 'lucide-react';
import { Robot } from './Robot';

type Node = { id: string; label: string; x: number; y: number };
type Scenario = {
  chip: string;
  note: string;
  prompt: string;
  statuses: string[];
  answer: string;
  focus: string[];
  added: Node[];
  addedEdges: [string, string][];
};

const BASE_NODES: Node[] = [
  { id: 'memory', label: 'Memory', x: 200, y: 150 },
  { id: 'learning', label: 'Learning', x: 118, y: 104 },
  { id: 'reading', label: 'Reading log', x: 284, y: 92 },
  { id: 'writing', label: 'Writing', x: 290, y: 206 },
  { id: 'stoic', label: 'Stoicism', x: 82, y: 214 },
  { id: 'design', label: 'Product design', x: 178, y: 246 },
  { id: 'zettel', label: 'Zettelkasten', x: 226, y: 50 },
  { id: 'habits', label: 'Habits', x: 352, y: 146 },
  { id: 'feynman', label: 'Feynman technique', x: 58, y: 138 },
];

const BASE_EDGES: [string, string][] = [
  ['memory', 'learning'],
  ['memory', 'reading'],
  ['memory', 'writing'],
  ['learning', 'feynman'],
  ['reading', 'zettel'],
  ['writing', 'habits'],
  ['habits', 'reading'],
  ['design', 'writing'],
  ['stoic', 'feynman'],
];

const SCENARIOS: Scenario[] = [
  {
    chip: 'Link my notes',
    note: 'memory',
    prompt: 'Link my notes on spaced repetition to everything I have on memory.',
    statuses: ['Reading 42 notes in your vault…', 'Matching concepts across folders…'],
    answer:
      'Found 7 related notes. Added 4 links and a hub note, [[Memory Systems]], that ties [[Spaced repetition]], [[Learning]] and your [[Reading log]] together.',
    focus: ['memory', 'learning', 'reading'],
    added: [
      { id: 'spaced', label: 'Spaced repetition', x: 120, y: 182 },
      { id: 'hub', label: 'Memory Systems', x: 250, y: 128 },
    ],
    addedEdges: [
      ['spaced', 'memory'],
      ['spaced', 'learning'],
      ['hub', 'memory'],
      ['hub', 'reading'],
      ['hub', 'spaced'],
    ],
  },
  {
    chip: 'Expand a topic',
    note: 'zettel',
    prompt: 'Expand [[Zettelkasten]] into its core ideas.',
    statuses: ['Outlining the topic…', 'Drafting linked notes…'],
    answer:
      'Drafted 4 notes under [[Zettelkasten]]: [[Atomic notes]], [[Permanent notes]], [[Luhmann]] and [[Index]]. Each one links back to your existing [[Reading log]].',
    focus: ['zettel', 'reading'],
    added: [
      { id: 'atomic', label: 'Atomic notes', x: 140, y: 34 },
      { id: 'perm', label: 'Permanent notes', x: 330, y: 40 },
      { id: 'luhmann', label: 'Luhmann', x: 166, y: 70 },
      { id: 'index', label: 'Index', x: 296, y: 18 },
    ],
    addedEdges: [
      ['atomic', 'zettel'],
      ['perm', 'zettel'],
      ['luhmann', 'zettel'],
      ['index', 'zettel'],
    ],
  },
  {
    chip: 'Find hidden links',
    note: 'stoic',
    prompt: 'What connects [[Stoicism]] and [[Product design]]?',
    statuses: ['Walking paths between both notes…', 'Ranking bridges…'],
    answer:
      'Both treat constraint as a tool. Three ideas bridge them: [[Via negativa]], [[Less but better]] and [[Premortems]]. I linked them in both notes.',
    focus: ['stoic', 'design'],
    added: [
      { id: 'vianeg', label: 'Via negativa', x: 106, y: 270 },
      { id: 'less', label: 'Less but better', x: 40, y: 254 },
      { id: 'premortem', label: 'Premortems', x: 128, y: 236 },
    ],
    addedEdges: [
      ['vianeg', 'stoic'],
      ['vianeg', 'design'],
      ['less', 'stoic'],
      ['less', 'design'],
      ['premortem', 'stoic'],
      ['premortem', 'design'],
    ],
  },
  {
    chip: 'Recap my week',
    note: 'writing',
    prompt: 'Summarize what I wrote this week.',
    statuses: ['Collecting notes edited since Monday…', 'Grouping by theme…'],
    answer:
      '12 notes, 3 themes: learning systems, writing habits and graph tooling. Strongest new link: [[Feynman technique]] to [[Teaching notes]].',
    focus: ['feynman', 'writing', 'habits'],
    added: [{ id: 'teaching', label: 'Teaching notes', x: 40, y: 72 }],
    addedEdges: [
      ['teaching', 'feynman'],
      ['teaching', 'writing'],
    ],
  },
];

const SIDEBAR_NOTES = [
  { id: 'memory', label: 'Memory' },
  { id: 'zettel', label: 'Zettelkasten' },
  { id: 'stoic', label: 'Stoicism' },
  { id: 'writing', label: 'Writing' },
  { id: 'design', label: 'Product design' },
  { id: 'habits', label: 'Habits' },
];

const SCENARIO_MS = 9000;

const renderLinks = (text: string) =>
  text.split(/(\[\[[^\]]+\]\])/g).map((part, i) =>
    part.startsWith('[[') && part.endsWith(']]') ? (
      <span key={i} className="text-[#6d55bd] font-medium">
        {part.slice(2, -2)}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );

const ProgressRing: React.FC<{ active: boolean; runKey: number }> = ({ active, runKey }) => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0 -rotate-90" aria-hidden="true">
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.6" />
    {active && (
      <motion.circle
        key={runKey}
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: SCENARIO_MS / 1000, ease: 'linear' }}
      />
    )}
  </svg>
);

const Graph: React.FC<{ scenario: Scenario; showAdded: boolean }> = ({ scenario, showAdded }) => {
  const nodes = useMemo(() => {
    const map = new Map<string, Node>();
    BASE_NODES.forEach((n) => map.set(n.id, n));
    scenario.added.forEach((n) => map.set(n.id, n));
    return map;
  }, [scenario]);
  const addedIds = new Set(scenario.added.map((n) => n.id));

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Knowledge graph preview">
      <defs>
        <radialGradient id="vp-focus" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>

      {BASE_EDGES.map(([a, b]) => {
        const A = nodes.get(a)!;
        const B = nodes.get(b)!;
        const hot = scenario.focus.includes(a) && scenario.focus.includes(b);
        return (
          <line
            key={`${a}-${b}`}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke={hot ? '#6d55bd' : '#2a2a30'}
            strokeWidth={hot ? 1.4 : 1}
            style={{ transition: 'stroke 0.5s' }}
          />
        );
      })}

      <AnimatePresence>
        {showAdded &&
          scenario.addedEdges.map(([a, b], i) => {
            const A = nodes.get(a)!;
            const B = nodes.get(b)!;
            return (
              <motion.line
                key={`${scenario.chip}-${a}-${b}`}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="#22d3ee"
                strokeOpacity={0.7}
                strokeWidth={1.2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
              />
            );
          })}
      </AnimatePresence>

      {BASE_NODES.map((n) => {
        const focused = scenario.focus.includes(n.id);
        return (
          <g key={n.id}>
            {focused && (
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={16}
                fill="url(#vp-focus)"
                animate={{ r: [12, 18, 12] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={focused ? 4.5 : 3.2}
              fill={focused ? '#c4b5fd' : '#52525b'}
              style={{ transition: 'fill 0.5s' }}
            />
            <text
              x={n.x}
              y={n.y + 14}
              textAnchor="middle"
              fontSize="8.5"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fill={focused ? '#f4f4f5' : '#71717a'}
              style={{ transition: 'fill 0.5s' }}
            >
              {n.label}
            </text>
          </g>
        );
      })}

      <AnimatePresence>
        {showAdded &&
          scenario.added.map((n, i) => (
            <motion.g
              key={`${scenario.chip}-${n.id}`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 + i * 0.12 }}
              style={{ originX: `${n.x}px`, originY: `${n.y}px` }}
            >
              <circle cx={n.x} cy={n.y} r={4} fill="#67e8f9" />
              <text
                x={n.x}
                y={n.y + 14}
                textAnchor="middle"
                fontSize="8.5"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fill="#cffafe"
              >
                {n.label}
              </text>
            </motion.g>
          ))}
      </AnimatePresence>
    </svg>
  );
};

/** Product preview frame: gradient bezel, prompt chips and a mock vault window. */
export const VaultPreview: React.FC<{ visible: boolean }> = ({ visible }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [stage, setStage] = useState(0); // 0 prompt, 1+ statuses, then answer
  const [typed, setTyped] = useState(0);

  const scenario = SCENARIOS[active];
  const answerStage = scenario.statuses.length + 1;

  // Scenario timeline
  useEffect(() => {
    if (!visible) return;
    setStage(0);
    setTyped(0);
    const timers: number[] = [];
    scenario.statuses.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStage(i + 1), 700 + i * 1100));
    });
    timers.push(window.setTimeout(() => setStage(answerStage), 700 + scenario.statuses.length * 1100));
    timers.push(
      window.setTimeout(() => {
        setActive((a) => (a + 1) % SCENARIOS.length);
        setRunKey((k) => k + 1);
      }, SCENARIO_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [active, runKey, visible, scenario, answerStage]);

  // Stream the answer
  useEffect(() => {
    if (stage !== answerStage) return;
    if (typed >= scenario.answer.length) return;
    const t = window.setTimeout(() => setTyped((n) => Math.min(scenario.answer.length, n + 3)), 18);
    return () => clearTimeout(t);
  }, [stage, typed, scenario, answerStage]);

  const select = (i: number) => {
    setActive(i);
    setRunKey((k) => k + 1);
  };

  const showAnswer = stage === answerStage;

  return (
    <div className="atlas-bezel relative rounded-[28px] sm:rounded-[40px] p-2.5 sm:p-6">
      {/* prompt chips */}
      <div
        role="tablist"
        aria-label="Example prompts"
        className="relative grid grid-cols-2 lg:grid-cols-4 gap-1 rounded-[20px] sm:rounded-full p-1 bg-white/15 backdrop-blur-md ring-1 ring-white/20 mb-2.5 sm:mb-5"
      >
        {SCENARIOS.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.chip}
              role="tab"
              aria-selected={isActive}
              onClick={() => select(i)}
              className={`relative flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[13px] sm:text-[15px] font-medium tracking-[-0.01em] transition-colors cursor-pointer ${
                isActive ? 'text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="atlas-chip"
                  className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(15,10,20,0.15)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <ProgressRing active={isActive && visible} runKey={runKey} />
                {s.chip}
              </span>
            </button>
          );
        })}
      </div>

      {/* window */}
      <div className="relative overflow-hidden rounded-[16px] sm:rounded-[20px] bg-white shadow-[0_20px_60px_-20px_rgba(20,10,50,0.45)] ring-1 ring-black/5">
        {/* title bar */}
        <div className="flex items-center justify-between h-10 sm:h-11 px-4 bg-gradient-to-r from-[#eef0ff] via-[#f6f2ff] to-[#fdf0f6] border-b border-black/5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <button
            onClick={() => navigate('/demo')}
            className="flex items-center gap-1 text-[13px] text-black/60 hover:text-black transition-colors cursor-pointer"
          >
            Open the demo <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex h-[460px] sm:h-[500px]">
          {/* sidebar */}
          <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-black/5 bg-gradient-to-b from-[#f7f5ff] to-[#fff5f8] px-3 py-4 text-[14px]">
            <div className="flex items-center justify-between px-2 mb-4">
              <span className="font-semibold text-[16px] tracking-[-0.01em] flex items-center gap-1">
                My Vault <ChevronDown className="w-3.5 h-3.5 text-black/50" />
              </span>
              <Search className="w-4 h-4 text-black/45" />
            </div>
            <div className="space-y-0.5 mb-4">
              <div className="flex items-center gap-2 px-2 py-1.5 text-black/70">
                <Network className="w-4 h-4" /> Graph view
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-black/70">
                <Star className="w-4 h-4" /> Starred
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 mb-1 text-[12px] text-black/45">
              <ChevronDown className="w-3 h-3" /> Notes
            </div>
            <div className="space-y-0.5">
              {SIDEBAR_NOTES.map((n) => {
                const on = n.id === scenario.note;
                return (
                  <div
                    key={n.id}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                      on ? 'bg-white shadow-[0_1px_2px_rgba(15,10,20,0.08)] font-semibold text-black' : 'text-black/65'
                    }`}
                  >
                    <FileText className="w-4 h-4 opacity-60" /> {n.label}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* main */}
          <div className="flex-1 min-w-0 flex flex-col lg:flex-row">
            {/* thread */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center gap-1.5 h-12 px-4 sm:px-5 border-b border-black/5 font-semibold text-[15px] sm:text-[17px] tracking-[-0.01em]">
                <Hash className="w-4 h-4 text-black/50" />
                {SIDEBAR_NOTES.find((n) => n.id === scenario.note)?.label ?? 'Vault'}
              </div>

              <div className="flex-1 overflow-hidden px-4 sm:px-5 py-4 space-y-4 text-[14px] sm:text-[15px] leading-[1.5]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${active}-${runKey}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-[#ffd6a5] to-[#ff9fb2] flex items-center justify-center text-[13px] font-semibold text-black/70">
                        You
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px]">
                          <span className="font-semibold">You</span>{' '}
                          <span className="text-black/40 text-[12px]">9:41 AM</span>
                        </div>
                        <p className="text-black/85">{renderLinks(scenario.prompt)}</p>
                      </div>
                    </div>

                    {stage > 0 && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                        <div className="w-9 h-9 shrink-0 rounded-lg bg-[#0b1f45] overflow-hidden flex items-center justify-center">
                          <Robot awake track={false} crop="head" className="w-8 h-8" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[14px] flex items-center gap-1.5">
                            <span className="font-semibold">Vault AI</span>
                            <span className="text-[10px] font-semibold tracking-wide bg-black/5 text-black/55 px-1 py-0.5 rounded">
                              AGENT
                            </span>
                            <span className="text-black/40 text-[12px]">9:41 AM</span>
                          </div>
                          {showAnswer ? (
                            <p className="text-black/85">
                              {renderLinks(scenario.answer.slice(0, typed))}
                              {typed < scenario.answer.length && (
                                <span className="inline-block w-[2px] h-[1em] align-[-2px] bg-black/60 ml-0.5 animate-pulse" />
                              )}
                            </p>
                          ) : (
                            <p className="atlas-shimmer-text">{scenario.statuses[stage - 1]}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* composer */}
              <div className="px-4 sm:px-5 pb-4">
                <div className="flex items-center justify-between rounded-xl ring-1 ring-black/10 px-3.5 py-3 text-black/40 text-[14px]">
                  <span>Ask your vault…</span>
                  <Send className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* graph */}
            <div className="h-[180px] lg:h-auto lg:w-[46%] shrink-0 bg-black border-t lg:border-t-0 lg:border-l border-black/5 relative">
              <div className="absolute top-3 left-4 text-[11px] font-mono text-white/40 tracking-wide">graph · live</div>
              <Graph scenario={scenario} showAdded={showAnswer} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultPreview;
